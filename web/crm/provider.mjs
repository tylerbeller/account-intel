// CRM seam.
//
// The dossier is public research. This is the other half: what we already know
// internally. They are kept apart on purpose, because blending sourced public
// evidence with unsourced internal notes is how a rep ends up quoting a CRM
// guess to a buyer as if it were a fact.
//
// Providers:
//   sample      (default) synthetic fixtures in sample-accounts.json
//   local       real export placed in local-accounts.json, which is gitignored
//   salesforce  not implemented; the adapter contract is documented below
//
// A real Salesforce adapter has to return the same shape as loadAccount():
// account fields, opportunities[], contacts[], activities[], signals[]. Field
// names already follow Salesforce objects so the mapping is mechanical.

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const samplePath = join(__dirname, 'sample-accounts.json');
const localPath = join(__dirname, 'local-accounts.json');

let cache = null;

async function loadStore() {
  if (cache) return cache;
  // A real export wins over the fixtures when present.
  const path = existsSync(localPath) ? localPath : samplePath;
  const parsed = JSON.parse(await readFile(path, 'utf8'));
  cache = { ...parsed, synthetic: path === samplePath, sourceFile: path === samplePath ? 'sample-accounts.json' : 'local-accounts.json' };
  return cache;
}

export async function loadAccount(slug) {
  const requested = process.env.CRM_PROVIDER || 'sample';

  if (requested === 'salesforce') {
    return {
      provider: 'salesforce',
      connected: false,
      synthetic: false,
      found: false,
      account: null,
      note: 'No Salesforce adapter is wired up. Set CRM_PROVIDER=sample to demo with fixtures, or implement an adapter that returns the loadAccount() shape.',
    };
  }

  const store = await loadStore();
  const account = (store.accounts || {})[slug] || null;

  return {
    provider: store.provider || 'sample',
    connected: false,
    synthetic: store.synthetic !== false,
    sourceFile: store.sourceFile,
    notice: store._notice,
    found: !!account,
    account,
  };
}

// --- cross-reference ---------------------------------------------------------
// The value is not the CRM table on its own, it is the overlap between who we
// have already talked to and who the research says matters now.

const STOP = new Set([
  'and', 'of', 'the', 'chief', 'officer', 'senior', 'vice', 'president', 'evp', 'svp', 'vp',
  'director', 'managing', 'head', 'lead', 'manager', 'global', 'group', 'general', 'co',
]);

// Words too broad to establish that two people work on the same thing.
const GENERIC = new Set(['technology', 'information', 'digital', 'systems', 'business', 'corporate', 'enterprise', 'operations']);

function terms(text) {
  return new Set(
    String(text || '')
      .toLowerCase()
      .replace(/[^a-z\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

function normalizeName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/\b(jr|sr|ii|iii|iv)\b/g, '')
    .replace(/[^a-z\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

function daysBetween(fromIso, toDate = new Date()) {
  const then = Date.parse(fromIso);
  if (Number.isNaN(then)) return null;
  return Math.round((toDate.getTime() - then) / 86400000);
}

export function crossReference(account, dossier) {
  const targets = (dossier && dossier.targets) || [];
  const contacts = (account && account.contacts) || [];
  const opportunities = (account && account.opportunities) || [];

  const nameMatches = [];
  const functionMatches = [];

  for (const c of contacts) {
    const cName = normalizeName(c.name);
    const exact = targets.find((t) => normalizeName(t.name) === cName && cName);
    if (exact) {
      nameMatches.push({
        contact: c.name,
        contactTitle: c.title,
        disposition: c.disposition,
        stillThere: c.stillThere,
        targetName: exact.name,
        targetTitle: exact.title,
        targetRole: exact.role,
        targetRank: exact.rank,
      });
      continue;
    }

    // A contact who has left is reported as a departure, not as a relationship.
    if (c.stillThere === false) continue;

    // No name overlap is the common case, and it is still informative: it means
    // the buying center moved on. Fall back to matching what they work on.
    const cTerms = new Set([...terms(c.function), ...terms(c.title)]);
    let best = null;
    for (const t of targets) {
      const tTerms = new Set([...terms(t.title), ...terms(t.scope)]);
      const shared = [...cTerms].filter((w) => tTerms.has(w));
      // One broad word in common ("technology") is a coincidence, not an overlap.
      const meaningful = shared.length > 1 || shared.some((w) => !GENERIC.has(w));
      if (shared.length && meaningful && (!best || shared.length > best.shared.length)) {
        best = { target: t, shared };
      }
    }
    if (best) {
      functionMatches.push({
        contact: c.name,
        contactTitle: c.title,
        disposition: c.disposition,
        stillThere: c.stillThere,
        targetName: best.target.name,
        targetTitle: best.target.title,
        targetRole: best.target.role,
        targetRank: best.target.rank,
        sharedTerms: best.shared,
      });
    }
  }

  // Deterministic read-outs. No inference beyond what the records state.
  const readout = [];
  const lost = opportunities.filter((o) => /closed lost/i.test(o.stageName || ''));
  const won = opportunities.filter((o) => /closed won/i.test(o.stageName || ''));
  const open = opportunities.filter((o) => !/closed/i.test(o.stageName || ''));

  let state = 'net-new';
  if (open.length) state = 'active pipeline';
  else if (won.length) state = 'existing customer';
  else if (lost.length) state = 'prior loss';
  else if (contacts.length) state = 'early touch';

  for (const o of open) {
    readout.push(
      `Open opportunity: ${o.name} at ${o.stageName}${o.amount ? `, ${o.amount}` : ''}${o.closeDate ? `, close date ${o.closeDate}` : ''}. Advance it rather than re-pitching.`,
    );
  }
  for (const o of lost) {
    readout.push(`Closed lost ${o.closeDate || ''}: ${o.lossReason || 'no reason recorded'}. Answer that objection before re-entering.`);
  }

  const champions = contacts.filter((c) => c.disposition === 'champion' && c.stillThere);
  if (champions.length) {
    readout.push(`Prior champion still in place: ${champions.map((c) => `${c.name} (${c.title})`).join(', ')}.`);
  }
  const departedBlockers = contacts.filter((c) => c.disposition === 'blocker' && c.stillThere === false);
  if (departedBlockers.length) {
    readout.push(`Prior blocker no longer listed: ${departedBlockers.map((c) => c.name).join(', ')}. The objection that killed the last attempt may have left with them.`);
  }

  const stale = account && account.lastActivityDate ? daysBetween(account.lastActivityDate) : null;
  if (stale !== null && stale > 180) {
    readout.push(`Last activity was ${stale} days ago. Treat these relationships as lapsed and re-earn them.`);
  }

  if (!nameMatches.length && contacts.length && targets.length) {
    readout.push(
      'None of the people previously contacted appear in the current target list, so the buying center has moved. Prior rapport does not transfer automatically.',
    );
  }

  return {
    state,
    daysSinceLastActivity: stale,
    counts: { open: open.length, lost: lost.length, won: won.length, contacts: contacts.length },
    nameMatches,
    functionMatches,
    readout,
  };
}

export function netNewReadout() {
  return {
    state: 'net-new',
    daysSinceLastActivity: null,
    counts: { open: 0, lost: 0, won: 0, contacts: 0 },
    nameMatches: [],
    functionMatches: [],
    readout: [
      'No CRM record for this account. Treat it as net-new: there is no prior loss to explain and no internal champion to reuse.',
      'Nothing here has been pre-qualified. The unknowns section is your call plan.',
    ],
  };
}
