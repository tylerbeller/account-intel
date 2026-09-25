// Prospect dossier web app. Node built-ins only: no install step, no build step,
// nothing to break between writing it and demoing it.
//
//   node web/server.mjs          → http://localhost:4317
//
// Research runs are `droid exec` child processes. The agent writes JSON to
// web/data/<slug>.json; this server validates it against the schema and serves it.

import { createServer } from 'node:http';
import { readFile, readdir, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAccount, crossReference, netNewReadout } from './crm/provider.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const dataDir = join(__dirname, 'data');
const historyDir = join(dataDir, 'history');
const publicDir = join(__dirname, 'public');
const schemaPath = join(repoRoot, '.factory', 'skills', 'account-dossier', 'dossier.schema.json');
const povSchemaPath = join(repoRoot, '.factory', 'skills', 'account-pov', 'pov.schema.json');

const PORT = Number(process.env.PORT || 4317);

function resolveDroid() {
  if (process.env.DROID_BIN && existsSync(process.env.DROID_BIN)) return process.env.DROID_BIN;
  const home = process.env.USERPROFILE || process.env.HOME || '';
  const candidate = join(home, 'bin', process.platform === 'win32' ? 'droid.exe' : 'droid');
  if (existsSync(candidate)) return candidate;
  return process.platform === 'win32' ? 'droid.exe' : 'droid';
}

export function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// --- minimal schema validation ------------------------------------------------
// Enough of draft-07 to enforce our own contract: required, type, enum, bounds,
// and item shapes. A generated artifact that silently omits half its sections is
// worse than a hard failure, so this runs on every read.

function validate(node, schema, path = '', errors = []) {
  if (!schema || typeof schema !== 'object') return errors;

  if (schema.type === 'object' || schema.properties || schema.required) {
    if (node === null || typeof node !== 'object' || Array.isArray(node)) {
      errors.push(`${path || 'root'}: expected object`);
      return errors;
    }
    for (const key of schema.required || []) {
      if (node[key] === undefined) errors.push(`${path}${path ? '.' : ''}${key}: missing (required)`);
    }
    for (const [key, sub] of Object.entries(schema.properties || {})) {
      if (node[key] !== undefined) validate(node[key], sub, `${path}${path ? '.' : ''}${key}`, errors);
    }
    return errors;
  }

  if (schema.type === 'array') {
    if (!Array.isArray(node)) {
      errors.push(`${path}: expected array`);
      return errors;
    }
    if (schema.minItems !== undefined && node.length < schema.minItems) {
      errors.push(`${path}: needs at least ${schema.minItems} item(s), got ${node.length}`);
    }
    if (schema.maxItems !== undefined && node.length > schema.maxItems) {
      errors.push(`${path}: allows at most ${schema.maxItems} item(s), got ${node.length}`);
    }
    node.forEach((item, i) => validate(item, schema.items, `${path}[${i}]`, errors));
    return errors;
  }

  if (schema.enum) {
    if (!schema.enum.includes(node)) errors.push(`${path}: "${node}" is not one of ${schema.enum.join(' | ')}`);
    return errors;
  }

  if (schema.type === 'string' && typeof node !== 'string') errors.push(`${path}: expected string`);
  if (schema.type === 'boolean' && typeof node !== 'boolean') errors.push(`${path}: expected boolean`);
  if (schema.type === 'integer') {
    if (!Number.isInteger(node)) errors.push(`${path}: expected integer`);
    else {
      if (schema.minimum !== undefined && node < schema.minimum) errors.push(`${path}: ${node} below minimum ${schema.minimum}`);
      if (schema.maximum !== undefined && node > schema.maximum) errors.push(`${path}: ${node} above maximum ${schema.maximum}`);
    }
  }
  return errors;
}

// Referential integrity: a citation that points at nothing is not a citation.
function checkSourceRefs(dossier) {
  const ids = new Set((dossier.sources || []).map((s) => s.id));
  const dangling = [];
  const walk = (node, path) => {
    if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${path}[${i}]`));
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (k === 'sourceId' && v && !ids.has(v)) dangling.push(`${path}.sourceId → "${v}" not in sources`);
        else walk(v, `${path}${path ? '.' : ''}${k}`);
      }
    }
  };
  walk(dossier, '');
  return dangling;
}

let schemaCache = null;
async function getSchema() {
  if (!schemaCache) schemaCache = JSON.parse(await readFile(schemaPath, 'utf8'));
  return schemaCache;
}

let povSchemaCache = null;
async function getPovSchema() {
  if (!povSchemaCache) povSchemaCache = JSON.parse(await readFile(povSchemaPath, 'utf8'));
  return povSchemaCache;
}

// The argument layer cites the dossier's sources, so its ids are checked against
// the dossier rather than against itself.
function checkPovRefs(pov, dossier) {
  const ids = new Set((dossier.sources || []).map((s) => s.id));
  const dangling = [];
  const walk = (node, path) => {
    if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${path}[${i}]`));
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (k === 'sourceId' && v && !ids.has(v)) dangling.push(`${path}.sourceId → "${v}" not in dossier sources`);
        else if (k === 'sourceIds' && Array.isArray(v)) {
          v.forEach((id, i) => {
            if (id && !ids.has(id)) dangling.push(`${path}.sourceIds[${i}] → "${id}" not in dossier sources`);
          });
        } else walk(v, `${path}${path ? '.' : ''}${k}`);
      }
    }
  };
  walk(pov, '');
  return dangling;
}

// --- freshness ---------------------------------------------------------------
// Research rots. A dossier that does not say how old it is invites a rep to
// quote a number that stopped being true two quarters ago.

function freshness(dossier) {
  const iso = dossier.generatedAt;
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return { age: null, state: 'unknown', note: 'No generatedAt date, so age cannot be established.' };
  const age = Math.max(0, Math.round((Date.now() - then) / 86400000));
  if (age <= 14) return { age, state: 'fresh', note: `Generated ${age} day(s) ago.` };
  if (age <= 45) return { age, state: 'aging', note: `Generated ${age} days ago. Check for a new quarter or leadership change before a senior meeting.` };
  return {
    age,
    state: 'stale',
    note: `Generated ${age} days ago. Re-run before quoting any figure from it.`,
  };
}

// --- version history ---------------------------------------------------------
// A re-run overwrites the artifact, so the previous copy is archived first and a
// diff of the meaningful fields is offered afterwards. "What changed" is the
// question a rep actually has on the second visit.

async function archiveExisting(slug) {
  const file = join(dataDir, `${slug}.json`);
  if (!existsSync(file)) return null;
  const dir = join(historyDir, slug);
  await mkdir(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = join(dir, `${stamp}.json`);
  await copyFile(file, target);
  return target;
}

async function previousVersion(slug) {
  const dir = join(historyDir, slug);
  if (!existsSync(dir)) return null;
  const files = (await readdir(dir)).filter((f) => f.endsWith('.json')).sort();
  if (!files.length) return null;
  try {
    return JSON.parse(await readFile(join(dir, files[files.length - 1]), 'utf8'));
  } catch {
    return null;
  }
}

function diffDossiers(prev, next) {
  if (!prev) return null;
  const changes = [];

  const prevScore = prev.fit?.score;
  const nextScore = next.fit?.score;
  if (prevScore !== nextScore) {
    changes.push({ field: 'Fit score', from: `${prevScore}/30 ${prev.fit?.verdict || ''}`.trim(), to: `${nextScore}/30 ${next.fit?.verdict || ''}`.trim() });
  }

  const setOf = (arr, key) => new Set((arr || []).map((x) => String(x[key])));
  const listDelta = (label, prevArr, nextArr, key) => {
    const a = setOf(prevArr, key);
    const b = setOf(nextArr, key);
    const added = [...b].filter((x) => !a.has(x));
    const removed = [...a].filter((x) => !b.has(x));
    if (added.length) changes.push({ field: `${label} added`, to: added.join('; ') });
    if (removed.length) changes.push({ field: `${label} removed`, from: removed.join('; ') });
  };

  listDelta('Catalyst', prev.catalysts, next.catalysts, 'event');
  listDelta('Target', prev.targets, next.targets, 'name');
  listDelta('Competitor', prev.competition, next.competition, 'vendor');

  const prevSources = (prev.sources || []).length;
  const nextSources = (next.sources || []).length;
  if (prevSources !== nextSources) {
    changes.push({ field: 'Source count', from: String(prevSources), to: String(nextSources) });
  }

  return { since: prev.generatedAt || null, changes };
}

// --- research jobs -----------------------------------------------------------

const jobs = new Map(); // slug -> { slug, company, status, startedAt, finishedAt, log[], error }

async function startResearch(company, { refresh = false } = {}) {
  const slug = slugify(company);
  const existing = jobs.get(slug);
  if (existing && existing.status === 'running') return existing;

  // Keep the copy we are about to overwrite so "what changed" can be answered.
  await archiveExisting(slug);

  const outRel = `web/data/${slug}.json`;
  const prompt =
    `/account-dossier ${company}\n\n` +
    `Write the dossier JSON to ${outRel}. Follow the schema exactly and cite every figure. ` +
    (refresh ? 'Refresh the research even if artifacts already exist. ' : '') +
    `When done, report the output path, the fit verdict and score, the source count, and the top three unknowns.`;

  const job = {
    slug,
    company,
    status: 'running',
    startedAt: new Date().toISOString(),
    finishedAt: null,
    log: [],
    error: null,
  };
  jobs.set(slug, job);

  const child = spawn(resolveDroid(), ['exec', '--auto', 'medium', prompt], {
    cwd: repoRoot,
    windowsHide: true,
  });

  const append = (buf) => {
    const text = buf.toString();
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed) job.log.push(trimmed);
    }
    // Keep the tail bounded; the UI only shows recent progress.
    if (job.log.length > 400) job.log = job.log.slice(-400);
  };

  child.stdout.on('data', append);
  child.stderr.on('data', append);

  child.on('error', (err) => {
    job.status = 'failed';
    job.error = `could not start droid CLI: ${err.message}`;
    job.finishedAt = new Date().toISOString();
  });

  child.on('close', async (code) => {
    job.finishedAt = new Date().toISOString();
    const file = join(dataDir, `${slug}.json`);
    if (!existsSync(file)) {
      job.status = 'failed';
      job.error = job.error || `run exited ${code} without writing ${outRel}`;
      return;
    }
    try {
      const parsed = JSON.parse(await readFile(file, 'utf8'));
      const errors = validate(parsed, await getSchema());
      const dangling = checkSourceRefs(parsed);
      job.validation = { errors, dangling };
      job.status = errors.length ? 'invalid' : 'done';
      if (errors.length) job.error = `${errors.length} schema problem(s)`;
    } catch (err) {
      job.status = 'failed';
      job.error = `wrote invalid JSON: ${err.message}`;
    }
  });

  return job;
}

// --- point of view jobs ------------------------------------------------------
// Kept separate from research on purpose: the argument changes with every
// conversation, and a rep should be able to regenerate it without paying for a
// fresh research run.

const povJobs = new Map();

function startPov(slug, company) {
  const existing = povJobs.get(slug);
  if (existing && existing.status === 'running') return existing;

  const dossierRel = `web/data/${slug}.json`;
  const outRel = `web/data/${slug}.pov.json`;
  const prompt =
    `/account-pov ${company}\n\n` +
    `Read the dossier at ${dossierRel} and write the argument layer to ${outRel}. ` +
    `Use only source ids that already exist in that dossier's sources array. ` +
    `Follow pov.schema.json exactly. When done, report the three claims, the warm-path count, and the doNotSay count.`;

  const job = {
    slug,
    company,
    kind: 'pov',
    status: 'running',
    startedAt: new Date().toISOString(),
    finishedAt: null,
    log: [],
    error: null,
  };
  povJobs.set(slug, job);

  const child = spawn(resolveDroid(), ['exec', '--auto', 'medium', prompt], { cwd: repoRoot, windowsHide: true });

  const append = (buf) => {
    for (const line of buf.toString().split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed) job.log.push(trimmed);
    }
    if (job.log.length > 400) job.log = job.log.slice(-400);
  };
  child.stdout.on('data', append);
  child.stderr.on('data', append);

  child.on('error', (err) => {
    job.status = 'failed';
    job.error = `could not start droid CLI: ${err.message}`;
    job.finishedAt = new Date().toISOString();
  });

  child.on('close', async (code) => {
    job.finishedAt = new Date().toISOString();
    const file = join(dataDir, `${slug}.pov.json`);
    if (!existsSync(file)) {
      job.status = 'failed';
      job.error = job.error || `run exited ${code} without writing ${outRel}`;
      return;
    }
    try {
      const pov = JSON.parse(await readFile(file, 'utf8'));
      const dossier = JSON.parse(await readFile(join(dataDir, `${slug}.json`), 'utf8'));
      const errors = validate(pov, await getPovSchema());
      const dangling = checkPovRefs(pov, dossier);
      job.validation = { errors, dangling };
      job.status = errors.length ? 'invalid' : 'done';
      if (errors.length) job.error = `${errors.length} schema problem(s)`;
    } catch (err) {
      job.status = 'failed';
      job.error = `wrote invalid JSON: ${err.message}`;
    }
  });

  return job;
}

async function readPov(slug, dossier) {
  const file = join(dataDir, `${slug}.pov.json`);
  if (!existsSync(file)) return null;
  try {
    const pov = JSON.parse(await readFile(file, 'utf8'));
    const errors = validate(pov, await getPovSchema());
    const dangling = checkPovRefs(pov, dossier);
    const stale = pov.basedOnDossier && dossier.generatedAt && pov.basedOnDossier !== dossier.generatedAt;
    return { pov, validation: { errors, dangling }, stale: Boolean(stale) };
  } catch (err) {
    return { pov: null, validation: { errors: [`unreadable: ${err.message}`], dangling: [] }, stale: false };
  }
}

function runVerifier(slug) {
  return new Promise((resolvePromise) => {
    const script = join(repoRoot, 'scripts', 'verify-sources.ps1');
    if (process.platform !== 'win32' || !existsSync(script)) {
      return resolvePromise({ available: false, output: 'verifier available on Windows PowerShell only' });
    }
    const child = spawn(
      'powershell',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', script, '-Path', join(dataDir, `${slug}.json`), '-Quiet'],
      { cwd: repoRoot, windowsHide: true },
    );
    let out = '';
    child.stdout.on('data', (b) => (out += b.toString()));
    child.stderr.on('data', (b) => (out += b.toString()));
    child.on('error', (err) => resolvePromise({ available: false, output: err.message }));
    child.on('close', (code) => resolvePromise({ available: true, exitCode: code, output: out }));
  });
}

// --- http --------------------------------------------------------------------

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(payload) });
  res.end(payload);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    return {};
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  try {
    if (path === '/api/dossiers' && req.method === 'GET') {
      await mkdir(dataDir, { recursive: true });
      // .pov.json files are the argument layer for a dossier, not dossiers themselves.
      const files = (await readdir(dataDir)).filter((f) => f.endsWith('.json') && !f.endsWith('.pov.json'));
      const items = [];
      for (const f of files) {
        try {
          const d = JSON.parse(await readFile(join(dataDir, f), 'utf8'));
          const slug = f.replace(/\.json$/, '');
          items.push({
            slug,
            name: d.company?.name || f,
            verdict: d.fit?.verdict || null,
            score: d.fit?.score ?? null,
            generatedAt: d.generatedAt || null,
            sources: (d.sources || []).length,
            freshness: freshness(d).state,
            hasPov: existsSync(join(dataDir, `${slug}.pov.json`)),
          });
        } catch {
          items.push({ slug: f.replace(/\.json$/, ''), name: f, broken: true });
        }
      }
      items.sort((a, b) => String(b.generatedAt).localeCompare(String(a.generatedAt)));
      return json(res, 200, { items });
    }

    if (path.startsWith('/api/dossier/') && req.method === 'GET') {
      const slug = slugify(decodeURIComponent(path.slice('/api/dossier/'.length)));
      const file = join(dataDir, `${slug}.json`);
      if (!existsSync(file)) return json(res, 404, { error: 'not found' });
      const dossier = JSON.parse(await readFile(file, 'utf8'));
      const errors = validate(dossier, await getSchema());
      const dangling = checkSourceRefs(dossier);

      // Internal context and the argument layer are fetched alongside the facts so
      // the page renders in one pass, but they stay separate keys so the UI can
      // label their provenance differently.
      const crm = await loadAccount(slug);
      const crossRef = crm.found ? crossReference(crm.account, dossier) : netNewReadout();
      const pov = await readPov(slug, dossier);
      const changes = diffDossiers(await previousVersion(slug), dossier);

      return json(res, 200, {
        dossier,
        validation: { errors, dangling },
        freshness: freshness(dossier),
        crm: { ...crm, crossRef },
        pov,
        changes,
      });
    }

    if (path === '/api/research' && req.method === 'POST') {
      const body = await readBody(req);
      const company = String(body.company || '').trim();
      if (!company) return json(res, 400, { error: 'company is required' });
      if (company.length > 120) return json(res, 400, { error: 'company name too long' });
      const job = await startResearch(company, { refresh: Boolean(body.refresh) });
      return json(res, 202, { slug: job.slug, status: job.status });
    }

    if (path.startsWith('/api/pov/') && req.method === 'POST') {
      const slug = slugify(decodeURIComponent(path.slice('/api/pov/'.length)));
      const file = join(dataDir, `${slug}.json`);
      if (!existsSync(file)) return json(res, 404, { error: 'research that company first' });
      const dossier = JSON.parse(await readFile(file, 'utf8'));
      const job = startPov(slug, dossier.company?.name || slug);
      return json(res, 202, { slug: job.slug, status: job.status, kind: 'pov' });
    }

    if (path.startsWith('/api/crm/') && req.method === 'GET') {
      const slug = slugify(decodeURIComponent(path.slice('/api/crm/'.length)));
      const crm = await loadAccount(slug);
      const file = join(dataDir, `${slug}.json`);
      const dossier = existsSync(file) ? JSON.parse(await readFile(file, 'utf8')) : { targets: [] };
      const crossRef = crm.found ? crossReference(crm.account, dossier) : netNewReadout();
      return json(res, 200, { ...crm, crossRef });
    }

    if (path.startsWith('/api/job/') && req.method === 'GET') {
      const slug = slugify(decodeURIComponent(path.slice('/api/job/'.length)));
      const job = url.searchParams.get('kind') === 'pov' ? povJobs.get(slug) : jobs.get(slug);
      if (!job) return json(res, 404, { error: 'no job for that company in this session' });
      return json(res, 200, {
        slug: job.slug,
        company: job.company,
        status: job.status,
        startedAt: job.startedAt,
        finishedAt: job.finishedAt,
        error: job.error,
        validation: job.validation || null,
        log: job.log.slice(-40),
      });
    }

    if (path.startsWith('/api/verify/') && req.method === 'POST') {
      const slug = slugify(decodeURIComponent(path.slice('/api/verify/'.length)));
      if (!existsSync(join(dataDir, `${slug}.json`))) return json(res, 404, { error: 'not found' });
      const result = await runVerifier(slug);
      return json(res, 200, result);
    }

    // static files
    let rel = path === '/' ? 'index.html' : path.replace(/^\/+/, '');
    const file = join(publicDir, rel);
    if (!file.startsWith(publicDir) || !existsSync(file)) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      return res.end('not found');
    }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
    return res.end(body);
  } catch (err) {
    return json(res, 500, { error: err.message });
  }
});

await mkdir(dataDir, { recursive: true });
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use — a dossier server is probably already running.`);
    console.error(`Open http://localhost:${PORT} directly, or stop the other process first.`);
    process.exit(1);
  }
  throw err;
});
server.listen(PORT, () => {
  console.log(`Prospect dossier app  →  http://localhost:${PORT}`);
  console.log(`Droid CLI             →  ${resolveDroid()}`);
  console.log(`Dossiers              →  ${dataDir}`);
});
