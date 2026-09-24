'use strict';

const $ = (id) => document.getElementById(id);
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

let sourceIndex = {};
let pollTimer = null;
let currentSlug = null;

// ---------- source citation links ----------

function cite(sourceId) {
  if (!sourceId) return '';
  const s = sourceIndex[sourceId];
  if (!s) return `<span class="src" title="citation missing from sources">[?]</span>`;
  return ` <a class="src" href="${esc(s.url)}" target="_blank" rel="noopener" title="${esc(s.title)}">[${esc(sourceId)}]</a>`;
}

function citeNode(id) {
  const s = sourceIndex[id];
  if (!s) {
    const span = document.createElement('span');
    span.className = 'src';
    span.title = 'citation missing from sources';
    span.textContent = `[${id}]`;
    return span;
  }
  const a = document.createElement('a');
  a.className = 'src';
  a.href = s.url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.title = s.title || '';
  a.textContent = `[${id}]`;
  return a;
}

// The research skill writes inline [sN] markers inside prose fields. Rewriting text
// nodes (rather than the HTML string) keeps attributes and tag names untouched.
function linkInlineCites(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const targets = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement && node.parentElement.closest('a')) continue;
    if (/\[s\d+\]/.test(node.nodeValue)) targets.push(node);
  }
  for (const node of targets) {
    const text = node.nodeValue;
    const frag = document.createDocumentFragment();
    const re = /\[(s\d+)\]/g;
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      frag.appendChild(citeNode(m[1]));
      last = m.index + m[0].length;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }
}

// ---------- section builders ----------

function card(id, kicker, title, inner) {
  return `<section class="card" id="${id}"><h3>${esc(kicker)}</h3><p class="card-title">${esc(title)}</p>${inner}</section>`;
}

function overviewCard(d) {
  const o = d.overview || {};
  const stats = (o.scale || [])
    .map((s) => `<div class="stat"><div class="v">${esc(s.value)}${cite(s.sourceId)}</div><div class="l">${esc(s.label)}</div></div>`)
    .join('');
  const segments = (o.segments || []).length
    ? `<ul class="plain">${o.segments
        .map((s) => `<li><span class="t">${esc(s.name)}</span><div class="e">${esc(s.note)}${cite(s.sourceId)}</div></li>`)
        .join('')}</ul>`
    : '';
  return card(
    'overview',
    'Company overview',
    'What they do and how big it is',
    `${stats ? `<div class="stats">${stats}</div>` : ''}
     <p style="margin:14px 0 0">${esc(o.whatTheyDo)}</p>
     ${segments ? `<div style="margin-top:14px">${segments}</div>` : ''}`,
  );
}

function trendsCard(d) {
  const t = d.trends || {};
  const fin = (t.financials || []).length
    ? `<table><thead><tr><th>Period</th><th>Metric</th><th>Value</th><th></th></tr></thead><tbody>
       ${t.financials
         .map(
           (f) => `<tr><td>${esc(f.period)}</td><td>${esc(f.metric)}</td><td><strong>${esc(f.value)}</strong>${cite(f.sourceId)}</td>
             <td class="dir-${esc(f.direction || 'flat')}">${f.direction === 'up' ? '▲' : f.direction === 'down' ? '▼' : '—'}</td></tr>`,
         )
         .join('')}</tbody></table>`
    : '<p class="e">No reported figures captured.</p>';

  const guidance = (t.guidance || []).length
    ? `<h4 style="margin:18px 0 6px;font-size:12px;letter-spacing:.6px;text-transform:uppercase;color:var(--mut);font-family:var(--mono)">Guidance</h4>
       <ul class="plain">${t.guidance
         .map((g) => `<li><span class="t">${esc(g.value)}</span><div class="e">${esc(g.item)}${cite(g.sourceId)}</div></li>`)
         .join('')}</ul>`
    : '';

  const industry = (t.industry || []).length
    ? `<ul class="plain">${t.industry
        .map((i) => `<li><span class="t">${esc(i.trend)}</span><div class="e">${esc(i.implication)}${cite(i.sourceId)}</div></li>`)
        .join('')}</ul>`
    : '<p class="e">No industry trends captured.</p>';

  const pressures = (t.pressures || []).length
    ? `<ul class="plain">${t.pressures
        .map((p) => `<li><span class="t">${esc(p.pressure)}</span><div class="e">${esc(p.evidence)}${cite(p.sourceId)}</div></li>`)
        .join('')}</ul>`
    : '';

  return card(
    'trends',
    'Company trends',
    'Revenue, earnings, guidance and the forces around them',
    `<p style="margin:0 0 14px">${esc(t.trajectory)}</p>
     <div class="grid2">
       <div><h4 style="margin:0 0 8px;font-size:12px;letter-spacing:.6px;text-transform:uppercase;color:var(--mut);font-family:var(--mono)">Reported results</h4>${fin}${guidance}</div>
       <div><h4 style="margin:0 0 8px;font-size:12px;letter-spacing:.6px;text-transform:uppercase;color:var(--mut);font-family:var(--mono)">Industry and macro</h4>${industry}
       ${pressures ? `<h4 style="margin:18px 0 6px;font-size:12px;letter-spacing:.6px;text-transform:uppercase;color:var(--mut);font-family:var(--mono)">Pressures</h4>${pressures}` : ''}</div>
     </div>`,
  );
}

function catalystCard(d) {
  const items = (d.catalysts || []).length
    ? `<ul class="timeline">${d.catalysts
        .map(
          (c) => `<li class="${esc(c.urgency || '')}"><div class="date">${esc(c.date)}</div>
            <div><div class="ev">${esc(c.event)}${cite(c.sourceId)}</div><div class="wy">${esc(c.whyItMatters)}</div></div></li>`,
        )
        .join('')}</ul>`
    : '<p class="e">No dated catalysts found.</p>';
  return card('catalysts', 'Timing', 'Why now, in dated events', items);
}

function fitCard(d) {
  const f = d.fit || {};
  const verdictClass = /strong/.test(f.verdict) ? 'good' : /not a fit|weak/.test(f.verdict) ? 'bad' : '';
  const pct = Math.round(((f.score || 0) / 30) * 100);

  const rubric = (f.rubric || [])
    .map(
      (r) => `<div class="rubric-row"><div class="rh"><span class="rn">${esc(r.dimension)}</span><span class="rs">${esc(r.score)} / 5</span></div>
        <div class="bar"><div style="width:${(r.score / 5) * 100}%"></div></div>
        <div class="rr">${esc(r.rationale)}${cite(r.sourceId)}</div></div>`,
    )
    .join('');

  const list = (arr) =>
    `<ul class="plain">${(arr || [])
      .map((x) => `<li><span class="t">${esc(x.point)}</span><div class="e">${esc(x.evidence)}${cite(x.sourceId)}</div></li>`)
      .join('')}</ul>`;

  const disq = (f.disqualifiers || []).length
    ? `<div class="banner" style="background:rgba(240,163,48,.08);border-color:rgba(240,163,48,.4);color:#ffd9a0">
         <strong>Would end the pursuit:</strong><ul>${f.disqualifiers.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`
    : '';

  return card(
    'fit',
    'Fit assessment',
    'Is this a company Factory should pursue?',
    `<div class="score-wrap">
       <div class="score-badge"><div class="n">${esc(f.score ?? '–')}</div><div class="d">of 30</div></div>
       <div style="flex:1;min-width:220px">
         <span class="chip ${verdictClass}" style="font-size:13px;padding:4px 12px">${esc(f.verdict || 'unscored')}</span>
         <div class="bar" style="margin-top:9px;height:8px"><div style="width:${pct}%"></div></div>
         ${f.summary ? `<p style="margin:10px 0 0;font-size:13.5px">${esc(f.summary)}</p>` : ''}
       </div>
     </div>
     <div class="rubric">${rubric}</div>
     <div class="grid2" style="margin-top:16px">
       <div class="pro-con pro"><h4>Reasons to pursue</h4>${list(f.reasonsFor)}</div>
       <div class="pro-con con"><h4>Reasons against</h4>${list(f.reasonsAgainst)}</div>
     </div>
     ${disq}`,
  );
}

function targetsCard(d) {
  const roleClass = (r) => (r === 'economic buyer' ? 'eb' : r === 'champion' ? 'ch' : r === 'gatekeeper' ? 'gk' : '');
  const rows = (d.targets || [])
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .map(
      (t) => `<tr>
        <td><span class="rank">${esc(t.rank)}</span></td>
        <td><strong>${esc(t.name)}</strong><div class="e" style="font-size:12.5px;color:var(--mut);margin-top:2px">${esc(t.title)}</div>
          ${t.tenure ? `<div class="conf">${esc(t.tenure)}</div>` : ''}
          <div class="conf ${esc(t.confidence || '')}">${esc(t.confidence || '')}${cite(t.sourceId)}</div></td>
        <td><span class="role ${roleClass(t.role)}">${esc(t.role)}</span>${t.scope ? `<div class="e" style="font-size:12px;color:var(--mut);margin-top:5px">${esc(t.scope)}</div>` : ''}</td>
        <td>${esc(t.whyStartHere)}${t.opener ? `<div class="opener">“${esc(t.opener)}”</div>` : ''}</td>
      </tr>`,
    )
    .join('');

  return card(
    'targets',
    'Who to contact',
    'Ranked by who to approach first, not by seniority',
    `<table><thead><tr><th>#</th><th>Person</th><th>Role</th><th>Why start here</th></tr></thead><tbody>${rows}</tbody></table>`,
  );
}

function estateCard(d) {
  const e = d.techEstate || {};
  const patterns = (e.patterns || [])
    .map(
      (p) => `<li><span class="t">${esc(p.pattern)}</span>
        <span class="${p.supported ? 'supported' : 'unsupported'}" style="margin-left:8px">${p.supported ? 'SUPPORTED' : 'UNSUPPORTED BY PUBLIC RECORD'}</span>
        <div class="e">${esc(p.theirEstate)}${cite(p.sourceId)}</div></li>`,
    )
    .join('');
  const stack = (e.stack || [])
    .map((s) => `<li><span class="t">${esc(s.technology)}</span><div class="e">${esc(s.evidence)}${cite(s.sourceId)}</div></li>`)
    .join('');
  return card(
    'estate',
    'Engineering estate',
    'What they actually run, and where Factory lands',
    `<div class="grid2">
       <div><h4 style="margin:0 0 8px;font-size:12px;letter-spacing:.6px;text-transform:uppercase;color:var(--mut);font-family:var(--mono)">Operating patterns</h4><ul class="plain">${patterns}</ul></div>
       <div><h4 style="margin:0 0 8px;font-size:12px;letter-spacing:.6px;text-transform:uppercase;color:var(--mut);font-family:var(--mono)">Stack signals</h4><ul class="plain">${stack}</ul></div>
     </div>`,
  );
}

function competitionCard(d) {
  if (!(d.competition || []).length) return '';
  const rows = d.competition
    .map(
      (c) => `<tr><td><strong>${esc(c.vendor)}</strong></td><td>${esc(c.position)}${cite(c.sourceId)}</td>
        <td style="color:var(--mut)">${esc(c.tradeoff || '—')}</td></tr>`,
    )
    .join('');
  return card(
    'competition',
    'Competitive field',
    'Who is already inside, and where they are stronger',
    `<table><thead><tr><th>Vendor</th><th>Position</th><th>Where they win</th></tr></thead><tbody>${rows}</tbody></table>`,
  );
}

function dealCard(d) {
  const m = d.dealModel;
  if (!m) return '';
  const ladder = (m.ladder || []).length
    ? `<table><thead><tr><th>Rung</th><th>Seats</th><th>Annual value</th><th>Gate</th></tr></thead><tbody>
       ${m.ladder
         .map(
           (r) =>
             `<tr><td><strong>${esc(r.rung)}</strong></td><td>${esc(r.seats || '—')}</td><td>${esc(r.annualValue || '—')}</td><td style="color:var(--mut)">${esc(r.gate)}</td></tr>`,
         )
         .join('')}</tbody></table>`
    : '';
  const assumptions = (m.assumptions || []).length
    ? `<ul class="plain">${m.assumptions.map((a) => `<li class="e" style="color:var(--mut)">${esc(a)}</li>`).join('')}</ul>`
    : '';
  return card(
    'deal',
    'Deal shape',
    'Bottom-up economics and the expansion ladder',
    `${m.unit ? `<p style="margin:0 0 12px"><strong style="color:var(--head)">Unit:</strong> ${esc(m.unit)}</p>` : ''}
     ${ladder}
     ${assumptions ? `<h4 style="margin:16px 0 6px;font-size:12px;letter-spacing:.6px;text-transform:uppercase;color:var(--mut);font-family:var(--mono)">Assumptions, not quotes</h4>${assumptions}` : ''}`,
  );
}

function objectionsCard(d) {
  if (!(d.objections || []).length) return '';
  const rows = d.objections
    .map((o) => `<tr><td style="width:36%"><strong>“${esc(o.objection)}”</strong></td><td>${esc(o.response)}</td></tr>`)
    .join('');
  return card('objections', 'Objections', 'What they will say, and the answer', `<table><tbody>${rows}</tbody></table>`);
}

function unknownsCard(d) {
  const items = (d.unknowns || [])
    .map(
      (u) => `<li><span class="t">${esc(u.question)}</span><div class="e">${esc(u.whyItMatters)}</div>
        ${u.searched ? `<div class="conf" style="margin-top:3px">searched: ${esc(u.searched)}</div>` : ''}</li>`,
    )
    .join('');
  return card(
    'unknowns',
    'Unknowns',
    'What is not public — these are your first-call questions',
    `<ul class="plain">${items}</ul>`,
  );
}

function sourcesCard(d) {
  const items = (d.sources || [])
    .map(
      (s) => `<li><span class="sid">${esc(s.id)}</span><div><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>
        <div class="pub">${esc(s.publisher || '')}${s.date ? ` · ${esc(s.date)}` : ''}${s.primary ? ' · primary' : ''}</div></div></li>`,
    )
    .join('');
  return card(
    'sources',
    'Sources',
    `${(d.sources || []).length} citations`,
    `<button class="verify-btn" id="verify">Check every link resolves</button>
     <div class="verify-out hidden" id="verify-out"></div>
     <ul class="sources-list" style="margin-top:14px">${items}</ul>`,
  );
}

// ---------- what changed since the last run ----------

function changesCard(changes) {
  if (!changes || !changes.changes || !changes.changes.length) return '';
  const rows = changes.changes
    .map(
      (c) => `<tr><td><strong>${esc(c.field)}</strong></td>
        <td style="color:var(--mut)">${c.from ? esc(c.from) : '—'}</td>
        <td>${c.to ? esc(c.to) : '—'}</td></tr>`,
    )
    .join('');
  return card(
    'changes',
    'What changed',
    `Differences from the previous run${changes.since ? ` (${esc(changes.since)})` : ''}`,
    `<table><thead><tr><th>Field</th><th>Was</th><th>Now</th></tr></thead><tbody>${rows}</tbody></table>`,
  );
}

// ---------- account history (CRM) ----------

function stageClass(stage) {
  if (/won/i.test(stage)) return 'won';
  if (/lost/i.test(stage)) return 'lost';
  return 'open';
}

function crmCard(crm) {
  if (!crm) return '';
  const xr = crm.crossRef || {};

  if (!crm.found) {
    return card(
      'history',
      'Account history',
      'No CRM record',
      `<div class="provenance internal">Internal data${crm.synthetic ? ' · sample' : ''}</div>
       <ul class="plain" style="margin-top:12px">${(xr.readout || [])
         .map((r) => `<li><span class="t">${esc(r)}</span></li>`)
         .join('')}</ul>`,
    );
  }

  const a = crm.account;
  const opps = (a.opportunities || []).length
    ? `<table><thead><tr><th>Opportunity</th><th>Stage</th><th>Amount</th><th>Close</th><th>Outcome / next step</th></tr></thead><tbody>
       ${a.opportunities
         .map(
           (o) => `<tr>
             <td><strong>${esc(o.name)}</strong>${o.primaryContact ? `<div class="e" style="font-size:12px;color:var(--mut);margin-top:2px">contact: ${esc(o.primaryContact)}</div>` : ''}</td>
             <td><span class="stage ${stageClass(o.stageName)}">${esc(o.stageName)}</span></td>
             <td>${esc(o.amount || '—')}</td>
             <td style="white-space:nowrap">${esc(o.closeDate || '—')}</td>
             <td>${esc(o.lossReason || o.nextStep || '—')}${o.notes ? `<div class="e" style="font-size:12px;color:var(--mut);margin-top:4px">${esc(o.notes)}</div>` : ''}</td>
           </tr>`,
         )
         .join('')}</tbody></table>`
    : '<p class="e" style="color:var(--mut)">No opportunity has ever been created on this account.</p>';

  const contacts = (a.contacts || []).length
    ? `<table><thead><tr><th>Person</th><th>Disposition</th><th>Last touch</th><th>Note</th></tr></thead><tbody>
       ${a.contacts
         .map(
           (c) => `<tr>
             <td><strong>${esc(c.name)}</strong><div class="e" style="font-size:12px;color:var(--mut);margin-top:2px">${esc(c.title)}</div>
               ${c.stillThere === false ? '<div class="conf unconfirmed">no longer at the company</div>' : ''}</td>
             <td><span class="disp ${esc(c.disposition)}">${esc(c.disposition)}</span></td>
             <td style="white-space:nowrap">${esc(c.lastTouch || '—')}</td>
             <td style="color:var(--mut)">${esc(c.note || '')}</td>
           </tr>`,
         )
         .join('')}</tbody></table>`
    : '';

  const overlap = (xr.functionMatches || []).length || (xr.nameMatches || []).length
    ? `<h4 class="sub-head">Who you know versus who matters now</h4>
       <ul class="plain">
         ${(xr.nameMatches || [])
           .map(
             (m) => `<li><span class="t">${esc(m.contact)} is target #${esc(m.targetRank)} (${esc(m.targetRole)})</span>
               <div class="e">Same person. You have already spoken to them.</div></li>`,
           )
           .join('')}
         ${(xr.functionMatches || [])
           .map(
             (m) => `<li><span class="t">${esc(m.contact)} → ${esc(m.targetName)}</span>
               <div class="e">${esc(m.contactTitle)} overlaps with ${esc(m.targetTitle)} on ${esc((m.sharedTerms || []).join(', '))}. Your prior contact sits in the same function as the current ${esc(m.targetRole)}.</div></li>`,
           )
           .join('')}
       </ul>`
    : '';

  const stats = `<div class="stats">
      <div class="stat"><div class="v">${esc(xr.state || '—')}</div><div class="l">Relationship state</div></div>
      <div class="stat"><div class="v">${esc(a.currentArr || '—')}</div><div class="l">Current ARR</div></div>
      <div class="stat"><div class="v">${xr.daysSinceLastActivity !== null && xr.daysSinceLastActivity !== undefined ? esc(xr.daysSinceLastActivity) + ' days' : '—'}</div><div class="l">Since last activity</div></div>
      <div class="stat"><div class="v">${esc((xr.counts || {}).lost ?? 0)} lost · ${esc((xr.counts || {}).open ?? 0)} open</div><div class="l">Opportunity history</div></div>
    </div>`;

  return card(
    'history',
    'Account history',
    `What we already know internally${a.accountOwner ? ` · owner ${esc(a.accountOwner)}` : ''}`,
    `<div class="provenance internal">Internal data${crm.synthetic ? ' · SAMPLE, not a live CRM connection' : ''}</div>
     ${crm.synthetic ? `<div class="banner sample">Synthetic sample data. Every person named below is fictional and the deal history is invented, to show the shape of a Salesforce integration. Never quote this to a customer.</div>` : ''}
     ${stats}
     <h4 class="sub-head">What this means</h4>
     <ul class="plain">${(xr.readout || []).map((r) => `<li><span class="t">${esc(r)}</span></li>`).join('')}</ul>
     <h4 class="sub-head">Opportunity history</h4>
     ${opps}
     ${contacts ? `<h4 class="sub-head">People we have touched</h4>${contacts}` : ''}
     ${overlap}`,
  );
}

// ---------- point of view ----------

function pillar(kicker, p) {
  if (!p) return '';
  const ev = (p.evidence || [])
    .map((e) => `<li>${esc(e.point)}${cite(e.sourceId)}</li>`)
    .join('');
  const versus = (p.versus || []).length
    ? `<div class="versus">Competing against: ${p.versus.map((v) => `<span class="chip">${esc(v)}</span>`).join(' ')}</div>`
    : '';
  return `<div class="pillar">
      <h4>${esc(kicker)}</h4>
      <p class="claim">${esc(p.claim)}</p>
      ${ev ? `<ul class="ev">${ev}</ul>` : ''}
      ${versus}
      ${p.expiresOn ? `<div class="expires">Window closes: ${esc(p.expiresOn)}</div>` : ''}
      ${p.risk ? `<div class="risk"><span>How this gets pushed back on</span>${esc(p.risk)}</div>` : ''}
    </div>`;
}

function povCard(povWrap, slug) {
  if (!povWrap || !povWrap.pov) {
    return card(
      'pov',
      'Point of view',
      'Not generated yet',
      `<p style="margin:0 0 14px;color:var(--mut)">The dossier holds the evidence. This turns it into the argument: why anything, why Factory, why now, and what to ask for. It reads the saved dossier, so it does not re-run research.</p>
       <button class="primary-btn" id="gen-pov" data-slug="${esc(slug)}">Generate point of view</button>
       <div class="verify-out hidden" id="pov-log"></div>`,
    );
  }

  const p = povWrap.pov.pointOfView || {};
  const problems = [...(povWrap.validation?.errors || []), ...(povWrap.validation?.dangling || [])];
  const banner = problems.length
    ? `<div class="banner"><strong>${problems.length} problem(s) in the argument layer:</strong>
       <ul>${problems.slice(0, 6).map((e) => `<li>${esc(e)}</li>`).join('')}</ul></div>`
    : '';
  const staleWarn = povWrap.stale
    ? `<div class="banner sample">This was built from an earlier version of the dossier. Regenerate it so the argument matches the current facts.</div>`
    : '';

  const dns = (p.doNotSay || []).length
    ? `<div class="donotsay">
         <h4>Do not say</h4>
         <ul>${p.doNotSay.map((d) => `<li><strong>${esc(d.claim)}</strong><span>${esc(d.reason)}</span></li>`).join('')}</ul>
       </div>`
    : '';

  return card(
    'pov',
    'Point of view',
    'Why anything, why Factory, why now',
    `${banner}${staleWarn}
     ${p.soundbite ? `<div class="soundbite">${esc(p.soundbite)}</div>` : ''}
     <div class="pillars">
       ${pillar('Why anything', p.whyAnything)}
       ${pillar('Why Factory', p.whyFactory)}
       ${pillar('Why now', p.whyNow)}
     </div>
     ${
       p.theAsk
         ? `<div class="ask">
              <h4>The ask</h4>
              <p class="claim">${esc(p.theAsk.ask)}</p>
              ${p.theAsk.why ? `<div class="e">${esc(p.theAsk.why)}</div>` : ''}
              ${p.theAsk.fallback ? `<div class="fallback">If declined: ${esc(p.theAsk.fallback)}</div>` : ''}
            </div>`
         : ''
     }
     ${dns}
     <div style="margin-top:16px"><button class="verify-btn" id="gen-pov" data-slug="${esc(slug)}">Regenerate</button>
     <div class="verify-out hidden" id="pov-log"></div></div>`,
  );
}

// ---------- warm paths (internal + public, labeled separately) ----------

function warmPathsCard(crm, povWrap) {
  const internal = [];
  if (crm && crm.found && crm.account) {
    for (const c of crm.account.contacts || []) {
      if (c.stillThere === false) continue;
      if (c.disposition === 'blocker') continue;
      internal.push({
        kind: 'prior relationship',
        path: `${c.name}, ${c.title}`,
        evidence: c.note || '',
        confidence: c.disposition === 'champion' ? 'confirmed' : 'likely',
        action:
          c.disposition === 'champion'
            ? 'Re-open with them first and ask who now owns the budget.'
            : 'Reconnect and ask what changed since the last conversation.',
        provenance: 'internal',
      });
    }
  }

  const public_ = ((povWrap && povWrap.pov && povWrap.pov.warmPaths) || []).map((w) => ({ ...w, provenance: 'public' }));
  const all = [...internal, ...public_];
  if (!all.length) return '';

  const rows = all
    .map(
      (w) => `<tr>
        <td><span class="provenance ${esc(w.provenance)} inline">${w.provenance === 'internal' ? 'CRM' : 'public'}</span></td>
        <td><strong>${esc(w.path)}</strong><div class="e" style="font-size:12px;color:var(--mut);margin-top:3px">${esc(w.kind)}</div></td>
        <td>${esc(w.evidence || '—')}${cite(w.sourceId)}</td>
        <td>${esc(w.action || '—')}</td>
        <td><span class="conf ${esc(w.confidence || '')}">${esc(w.confidence || '')}</span></td>
      </tr>`,
    )
    .join('');

  return card(
    'warm',
    'Warm paths',
    'Routes in that beat a cold email',
    `<table><thead><tr><th>From</th><th>Path</th><th>Evidence</th><th>Action</th><th>Confidence</th></tr></thead><tbody>${rows}</tbody></table>`,
  );
}

// ---------- outreach sequence ----------

function outreachCard(povWrap) {
  const seqs = (povWrap && povWrap.pov && povWrap.pov.outreach) || [];
  if (!seqs.length) return '';

  const blocks = seqs
    .map(
      (s) => `<div class="sequence">
        <div class="seq-head">
          <strong>${esc(s.targetName)}</strong>
          ${s.targetTitle ? `<span class="e">${esc(s.targetTitle)}</span>` : ''}
          ${s.angle ? `<div class="angle">Angle: ${esc(s.angle)}</div>` : ''}
        </div>
        ${(s.touches || [])
          .slice()
          .sort((a, b) => a.order - b.order)
          .map(
            (t) => `<div class="touch">
              <div class="touch-meta">
                <span class="channel ${esc(t.channel)}">${esc(t.channel)}</span>
                <span class="timing">${esc(t.timing)}</span>
                ${(t.sourceIds || []).map((id) => cite(id)).join('')}
              </div>
              ${t.subject ? `<div class="subject">${esc(t.subject)}</div>` : ''}
              <div class="body">${esc(t.body)}</div>
              ${t.why ? `<div class="why">${esc(t.why)}</div>` : ''}
            </div>`,
          )
          .join('')}
      </div>`,
    )
    .join('');

  return card('outreach', 'Outreach', 'Send-ready sequence for the top targets', blocks);
}

// ---------- render ----------

function render(payload) {
  const { dossier, validation, freshness, crm, pov, changes } = payload;
  sourceIndex = {};
  for (const s of dossier.sources || []) sourceIndex[s.id] = s;

  const c = dossier.company || {};
  // Headcount arrives as prose ("Approximately 167,000 full-time associates..."), so the
  // unit word is only safe to append when the value is a bare figure.
  const bareCount = /^[^A-Za-z]*$/.test(String(c.employees || '').replace(/\[s\d+\]/g, ''));
  const headcount = bareCount ? `${esc(c.employees)} employees` : esc(c.employees);
  const chip = (text) => `<span class="chip" title="${esc(String(text).replace(/\s*\[s\d+\]/g, ''))}">${esc(text)}</span>`;
  const chips = [
    c.ticker && chip(c.ticker),
    c.industry && chip(c.industry),
    c.headquarters && chip(c.headquarters),
    c.employees && `<span class="chip">${headcount}</span>`,
    c.fiscalYearEnd && `<span class="chip">FY ends ${esc(c.fiscalYearEnd)}</span>`,
    dossier.confidence && `<span class="chip accent">${esc(dossier.confidence)}</span>`,
    dossier.generatedAt && `<span class="chip">generated ${esc(String(dossier.generatedAt).slice(0, 10))}</span>`,
    freshness && `<span class="chip fresh-${esc(freshness.state)}" title="${esc(freshness.note)}">${esc(freshness.state)}</span>`,
    crm && `<span class="chip ${crm.found ? '' : 'muted'}" title="Internal CRM context">${crm.found ? esc(crm.crossRef.state) : 'no CRM record'}</span>`,
  ]
    .filter(Boolean)
    .join('');

  const problems = [...(validation?.errors || []), ...(validation?.dangling || [])];
  const banner = problems.length
    ? `<div class="banner"><strong>${problems.length} data problem(s) in this dossier:</strong>
       <ul>${problems.slice(0, 8).map((e) => `<li>${esc(e)}</li>`).join('')}</ul>
       ${problems.length > 8 ? `<div>…and ${problems.length - 8} more</div>` : ''}</div>`
    : '';

  const body = [
    changesCard(changes),
    povCard(pov, currentSlug),
    crmCard(crm),
    warmPathsCard(crm, pov),
    outreachCard(pov),
    overviewCard(dossier),
    trendsCard(dossier),
    catalystCard(dossier),
    estateCard(dossier),
    fitCard(dossier),
    targetsCard(dossier),
    competitionCard(dossier),
    dealCard(dossier),
    objectionsCard(dossier),
    unknownsCard(dossier),
    sourcesCard(dossier),
  ].join('');

  // Optional sections render empty when the research found nothing, so only
  // link to anchors that exist.
  const nav = `<nav class="nav-pills">
      ${[
        ['changes', 'What changed'],
        ['pov', 'Point of view'],
        ['history', 'Account history'],
        ['warm', 'Warm paths'],
        ['outreach', 'Outreach'],
        ['overview', 'Overview'],
        ['trends', 'Trends'],
        ['catalysts', 'Timing'],
        ['estate', 'Estate'],
        ['fit', 'Fit'],
        ['targets', 'Who to contact'],
        ['competition', 'Competition'],
        ['deal', 'Deal shape'],
        ['objections', 'Objections'],
        ['unknowns', 'Unknowns'],
        ['sources', 'Sources'],
      ]
        .filter(([id]) => body.includes(`id="${id}"`))
        .map(([id, label]) => `<a href="#${id}">${label}</a>`)
        .join('')}
    </nav>`;

  $('dossier').innerHTML = `
    <div class="dossier-head">
      <h2>${esc(c.name || 'Unknown company')}</h2>
      <p class="sub">${esc(c.summary || '')}</p>
      <div class="chips">${chips}</div>
      ${banner}
      ${nav}
    </div>
    ${body}
  `;

  linkInlineCites($('dossier'));

  $('empty').classList.add('hidden');
  $('progress').classList.add('hidden');
  $('dossier').classList.remove('hidden');

  const btn = $('verify');
  if (btn) btn.addEventListener('click', () => verifySources(currentSlug, btn));

  const povBtn = $('gen-pov');
  if (povBtn) povBtn.addEventListener('click', () => generatePov(povBtn.dataset.slug, povBtn));
}

// ---------- point of view generation ----------

async function generatePov(slug, btn) {
  const log = $('pov-log');
  btn.disabled = true;
  btn.textContent = 'Generating…';
  log.classList.remove('hidden');
  log.textContent = 'Reading the saved dossier and building the argument…';

  const res = await fetch(`/api/pov/${encodeURIComponent(slug)}`, { method: 'POST' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    log.textContent = `Could not start: ${err.error || res.status}`;
    btn.disabled = false;
    btn.textContent = 'Generate point of view';
    return;
  }

  const timer = setInterval(async () => {
    const jr = await fetch(`/api/job/${encodeURIComponent(slug)}?kind=pov`);
    if (!jr.ok) return;
    const job = await jr.json();
    log.textContent = job.log.join('\n') || 'Working…';
    if (job.status === 'running') return;
    clearInterval(timer);
    if (job.status === 'done' || job.status === 'invalid') {
      await openDossier(slug);
    } else {
      log.textContent = `Failed: ${job.error || 'unknown error'}`;
      btn.disabled = false;
      btn.textContent = 'Generate point of view';
    }
  }, 3000);
}

async function verifySources(slug, btn) {
  const out = $('verify-out');
  btn.disabled = true;
  btn.textContent = 'Checking…';
  out.classList.remove('hidden');
  out.textContent = 'Resolving every cited URL…';
  try {
    const res = await fetch(`/api/verify/${encodeURIComponent(slug)}`, { method: 'POST' });
    const data = await res.json();
    out.textContent = data.available ? data.output.trim() : `Verifier unavailable: ${data.output}`;
  } catch (err) {
    out.textContent = `Verification failed: ${err.message}`;
  }
  btn.disabled = false;
  btn.textContent = 'Check every link resolves';
}

// ---------- data loading ----------

async function loadList(activeSlug) {
  const res = await fetch('/api/dossiers');
  const { items } = await res.json();
  $('dossier-list').innerHTML = items.length
    ? items
        .map(
          (i) => `<li><button data-slug="${esc(i.slug)}" class="${i.slug === activeSlug ? 'active' : ''}">
            ${esc(i.name)}<span class="meta">${
              i.broken
                ? 'unreadable'
                : `${esc(i.verdict || 'unscored')} · ${i.sources} sources${i.hasPov ? ' · POV' : ''}` +
                  (i.freshness && i.freshness !== 'fresh' ? ` · <span class="fresh-${esc(i.freshness)}">${esc(i.freshness)}</span>` : '')
            }</span>
          </button></li>`,
        )
        .join('')
    : '<li class="sidebar-note" style="margin:0;border:0;padding:0">Nothing yet.</li>';

  document.querySelectorAll('#dossier-list button').forEach((b) =>
    b.addEventListener('click', () => openDossier(b.dataset.slug)),
  );
}

async function openDossier(slug) {
  const res = await fetch(`/api/dossier/${encodeURIComponent(slug)}`);
  if (!res.ok) return;
  const payload = await res.json();
  currentSlug = slug; // povCard reads this, so it must be set before render
  render(payload);
  loadList(slug);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showProgress(company) {
  $('empty').classList.add('hidden');
  $('dossier').classList.add('hidden');
  $('progress').classList.remove('hidden');
  $('progress-title').textContent = `Researching ${company}…`;
  $('progress-sub').textContent = 'Six parallel researchers reading the public record. This takes a few minutes.';
  $('progress-log').textContent = 'Starting…';
}

async function poll(slug) {
  const res = await fetch(`/api/job/${encodeURIComponent(slug)}`);
  if (!res.ok) return;
  const job = await res.json();
  $('progress-log').textContent = job.log.join('\n') || 'Working…';

  if (job.status === 'running') return;
  clearInterval(pollTimer);
  pollTimer = null;
  $('go').disabled = false;

  if (job.status === 'done' || job.status === 'invalid') {
    await openDossier(slug);
  } else {
    $('progress-sub').textContent = `Failed: ${job.error || 'unknown error'}`;
    $('progress').querySelector('.spinner').style.animation = 'none';
  }
}

$('search').addEventListener('submit', async (e) => {
  e.preventDefault();
  const company = $('company').value.trim();
  if (!company) return;
  $('go').disabled = true;
  showProgress(company);
  const res = await fetch('/api/research', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ company }),
  });
  const data = await res.json();
  if (!res.ok) {
    $('progress-sub').textContent = data.error || 'could not start';
    $('go').disabled = false;
    return;
  }
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(() => poll(data.slug), 3000);
  poll(data.slug);
});

loadList();
