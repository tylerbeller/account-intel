---
name: account-dossier
description: Research a prospect company and emit a structured JSON dossier covering overview, trends, catalysts, tech estate, fit assessment, top ten people to contact, competition, objections, and unknowns. Use when the web app or a caller asks for a dossier, a prospect profile, or structured (JSON) account research.
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

# Account dossier (JSON)

Same research discipline as `account-brief`, different output: one machine-readable file that a UI renders into sections. The schema is the contract.

**Read first:** `dossier.schema.json` in this folder, and `../account-brief/evidence-rules.md`. The evidence rules are not negotiable just because the output is JSON.

## Inputs

A company name, and an output path (default `web/data/<slug>.json`).

## Step 1 — Reuse before researching

If `briefs/<slug>/brief.md` or `briefs/<slug>/deal-model.md` already exist, read them and carry their sourced facts straight into the dossier. Re-researching a fact you already sourced wastes a run and risks contradicting yourself. Only fill genuine gaps with new research.

## Step 2 — Research fan-out (parallel)

Launch **six concurrent `account-researcher` subagents in one message**, one per slice. Do not research serially.

1. **Company and financials** — what they do, scale, segments, the last two reported quarters, guidance, and margin pressure. Reported figures only.
2. **Catalyst window** — dated leadership changes, reorganizations, new functions, acquisitions, and investment commitments in the last 12-18 months.
3. **Engineering estate** — engineering blog, open-source repositories, conference talks, job postings. Named legacy systems, migrations in flight, languages and frameworks, cloud providers.
4. **People** — who owns engineering, product, data, AI, and security, with exact titles, scope, and tenure. This feeds the target list, so precision on titles matters more than volume.
5. **Competition and incumbents** — existing AI or developer tooling if public, primary cloud provider, and any published vendor relationships.
6. **Industry and macro** — sector forces affecting their spend, with the implication for engineering investment rather than a generic market summary.

## Step 3 — Score the fit honestly

Score each of the six rubric dimensions 0-5 and record the evidence for each score. Sum to a score out of 30 and map it:

| Score | Verdict |
|---|---|
| 24-30 | strong fit |
| 17-23 | moderate fit |
| 10-16 | weak fit |
| 0-9 | not a fit |

Rubric dimensions, and what a 5 looks like:

- **Engineering scale** — large published engineering headcount or an obviously large software estate.
- **Legacy and modernization pressure** — named legacy systems, a public migration program, or an acquisition needing integration.
- **Regulated or risk scope** — PCI, HIPAA, SOX, GDPR, or data-residency obligations that make patching and audit evidence expensive.
- **AI mandate and executive sponsor** — a named executive who owns AI outcomes, ideally recently appointed.
- **Budget and catalyst timing** — a dated investment commitment or a fiscal window that opens soon.
- **Access and security posture** — evidence they can actually adopt an outside tool, such as published vendor partnerships or existing AI deployments.

`reasonsAgainst` is a required array and must not be empty. If you cannot find a reason against, you have not looked hard enough: budget freezes, hiring cuts, a competing in-house platform, a dominant cloud partnership, or a recent security incident all qualify. A dossier that only argues for the deal is useless to the person who has to pursue it.

## Step 4 — Build the target list

Up to ten people, ranked by contact order, not seniority. Each needs a role label (economic buyer, champion, gatekeeper, practitioner, influencer), their scope, why you would start there, and a one-sentence opener you would actually send.

Rules:

- **Public role information only.** Name, title, scope, tenure, and public statements. Never include personal contact details, and never infer an email address.
- When a role clearly exists but no name is public, set `name` to `"Unknown by name"`, describe the role in `title`, and set `confidence` to `"unconfirmed"`. Do not invent a person.
- Set `confidence` per person: `confirmed` when a filing or company page names them in that role, `likely` when a credible secondary source does, `unconfirmed` otherwise.
- Rank a newly appointed leader who needs a visible win above a more senior executive with no stated mandate.

## Step 5 — Write the JSON

Write the file to the requested path. Requirements:

- Valid JSON. No comments, no trailing commas, no markdown fence around it.
- Every required field present, every enum exactly as spelled in the schema.
- Every `sourceId` resolves to an `id` in `sources`. Every source has a real URL and a publication date.
- `unknowns` must be non-empty.
- Do not pad. An empty optional array is better than an invented entry.

## Step 6 — Verify before reporting done

1. Re-read your JSON and confirm it parses and matches the schema.
2. Confirm every `sourceId` resolves.
3. Run `powershell -File scripts/verify-sources.ps1 -Path <output path> -Quiet` and report what it flags. Dead links must be fixed or removed, not left in place.

Report: the output path, the fit verdict and score, how many sources were cited, how many targets were named with `confirmed` confidence, and the top three unknowns.
