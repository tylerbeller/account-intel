---
name: account-brief
description: Research a named enterprise account and produce a sourced Factory account strategy brief covering the catalyst window, engineering estate, buying center, competitive field, and reach plan. Use when the user names a target account and wants a strategy brief, account plan, or pre-call research.
allowed-tools:
  - Task
  - WebSearch
  - FetchUrl
  - Read
  - Create
  - Edit
  - LS
version: 1.0.0
---

# Account brief

Turn an account name into a brief an AE can act on the same day. The output is only as good as its sourcing, so the evidence rules below are not optional.

Read `evidence-rules.md` in this skill folder before you start, and `brief-template.md` for the exact output shape.

## Inputs

The account name. If the user did not say where to write the output, use `briefs/<account-slug>/brief.md`.

## Phase 1 — Research fan-out (parallel)

Launch these as **six concurrent `account-researcher` subagents in a single message**. Each gets one slice and returns sourced facts only. Do not research serially; the whole point is that six contexts read the public record at once.

1. **Financial and strategic position** — most recent quarter's results, guidance changes, margin pressure, segment performance, stated corporate priorities, and any turnaround or transformation program.
2. **Catalyst window** — every executive appointment, reorganization, new function, and investment commitment in the last 12 months, each with its date. Look hardest for newly created technology or AI leadership roles, because a leader inside their first 100 days is the cheapest entry point an AE will get.
3. **Engineering estate** — the company's engineering blog, conference talks, open-source repositories, and job postings. You want the actual stack, the legacy systems named out loud, migration programs in flight, and engineering headcount if it is published.
4. **Buying center** — who owns engineering, product, data, AI, and security. Capture exact titles, scope, tenure, and any public statements about how they measure success.
5. **Competitive field** — what AI or developer tooling the company already uses, if anything is public. Also identify their primary cloud provider, since bundled first-party AI tooling is usually the cheapest competing decision available to them.
6. **Risk and compliance posture** — regulatory scope (PCI, HIPAA, SOX, GDPR, data residency), public security posture, and any published incidents.

## Phase 2 — Map evidence to Factory's three operating patterns

Every Factory enterprise conversation reduces to three patterns. Map what you found onto each, and name the specific systems you found rather than describing the pattern generically:

1. **SDLC and PDLC maintenance** — maintaining legacy and new code at once, onboarding, review capacity, time-to-context.
2. **Modernization and migration** — mainframe or monolith exits, cloud moves, language and framework migrations, decommission dates.
3. **Patching, vulnerabilities and risk** — CVE and dependency backlog across a repo fleet, audit evidence, regulated scope.

If the public record does not support one of the three patterns for this account, say so. A brief that claims all three without evidence is worthless in the room.

## Phase 3 — Build the buying center

Identify and label, by name and title:

- **Economic buyer** — controls the budget. Prefer the person whose scope covers all three patterns, because one relationship then covers the whole thesis.
- **Champion** — benefits personally from the outcome and can sell internally. A newly hired leader who needs a visible win inside their first quarter is the strongest champion profile.
- **Gatekeeper** — security, procurement, or compliance. Engage early and deliberately; a gatekeeper discovered late kills a quarter.
- **Practitioner champions** — engineers who publish publicly. They respond to substance and they validate you upward.

## Phase 4 — Competitive position, stated honestly

Name the incumbent tooling if it is public. If it is not public, **say that it is not public**, state what you searched, and make confirming it the first question on the first call. A fabricated competitive map is the fastest way to lose credibility with a technical buyer.

Cover the trade-offs, not just the wins: integrations, security, deployment model, governance, and scalability. Where a competitor is genuinely better positioned, write that down.

## Phase 5 — Reach plan

Build a multi-threaded plan, because nothing single-threaded survives a reorganized buying center. For each track give the persona, the opening, the specific asset, and the ask.

Then set timing against **their** calendar, not yours: fiscal year boundaries, budget refresh, earnings dates, and any code-freeze or peak-season window. A freeze is often an advantage, since a window where nobody can ship is a cheap window in which to prove something.

## Phase 6 — Write the brief

Follow `brief-template.md` exactly. Then run this checklist before declaring done:

- [ ] Every number has a source URL and a publication date
- [ ] Every estimate is labeled as an estimate, with its inputs shown
- [ ] The unknowns section is populated and honest
- [ ] Each of the three patterns either cites specific named systems or is explicitly marked unsupported
- [ ] The competitive section states what is not public
- [ ] Nothing in the brief is a claim you could not defend if the buyer pulled up the source

Report the output path, the number of distinct sources cited, and the top three unknowns that need a first call to resolve.

## Do not

- Do not invent figures, headcounts, or tooling. An unknown is an asset; a fabrication is a disqualifier.
- Do not use vendor superlatives. The brief is an internal working document, not marketing copy.
- Do not build a top-down value model here (headcount times cost times a guessed percentage). Deal economics belong in the `deal-model` skill, which builds them bottom-up.
