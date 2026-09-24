# account-intel

An account research kit for enterprise sellers. One command turns an account name into two artifacts: a sourced strategy brief, and a deal model with qualification, bottom-up economics, and a seat-and-ARR ladder.

```powershell
.\scripts\new-account.ps1 -Account "Lowe's" -Mode both
```

There is also a web app: type a company name, get a sectioned dossier with every figure cited.

```powershell
node web\server.mjs    # then open http://localhost:4317
```

## Why this exists

Building an account strategy by hand takes a day and produces something that goes stale in a month. Most of that day is not thinking, it is retrieval: earnings, leadership changes, the engineering blog, job postings, who owns security. That work is parallelizable and it is exactly what an agent is good at.

So the kit fans out six read-only research subagents at once, each on a separate slice of the public record, then assembles their sourced findings into a brief. What stays human is the argument: which pattern to lead with, who to call first, and what to ask for.

## What makes the output usable

The risk with generated research is confident fabrication, which is worse than no research because it fails in front of the buyer. Three mechanisms push against it:

1. **The researcher subagent cannot write files and cannot draft narrative.** It returns claims with source URLs and publication dates, or it reports that it found nothing.
2. **Evidence rules are explicit and shared.** Quote figures as published; never annualize, convert, or ratio them. Label estimates as estimates and show their inputs. State what is not public, and what was searched.
3. **The runner enforces a gate.** No artifact, too few sources, or no unknowns section means a non-zero exit. The gate is the contract.

## The two artifacts

**`brief.md`** — the play in five lines, position and pressure, a dated catalyst timeline, Factory's three operating patterns mapped to their actual named systems, the buying center split into economic buyer / champion / gatekeeper / practitioner, an honest competitive read including trade-offs, a multi-threaded reach plan timed to their fiscal calendar, a first-call script, objections, and an unknowns section that converts straight into first-call questions.

**`deal-model.md`** — a qualification scorecard where every dimension is Known, Hypothesis, or Gap with a closing action; explicit disqualification criteria; a bottom-up value model built from one defensible unit; and a seat-and-ARR ladder where every rung carries a gate. Pricing appears as a labeled assumption with the arithmetic shown, never as a quote.

## What the first real run taught me

I ran the kit on Lowe's, an account nobody had prepped, and audited the output rather than admiring it. Four findings, all of which changed the tool:

**1. The gate I wrote was measuring the wrong thing.** It counted source links. 67 citations passed cleanly. But counting citations proves nothing, because a fabricated URL and a real one look identical in a word count. So I wrote `verify-sources.ps1`, which resolves every link. That is now part of the gate.

**2. Nothing was fabricated.** This was the finding I most expected to go the other way. Every citation I audited pointed to a real page that said what the brief claimed, including the SEC 8-K, which matched all five executive appointments exactly. The evidence discipline held under audit.

**3. Link checking is harder than a status code.** Three separate traps showed up in one run: corporate newsrooms return HTTP 200 with a "page not found" body; SEC and Reuters answer non-browser clients with 403 or 401; and job postings return 410 within months because postings expire. A naive checker would have called a dozen valid citations broken. The checker now separates dead from blocked from soft-404 and only fails on the first.

**4. Honest gaps are the most useful output.** The deal model marked five of eight qualification dimensions as **Gap** — metrics, decision criteria, decision process, paper process, identified pain. That is correct and it is the point: none of those are knowable from public research. They are exactly what a first call is for, and an account plan that invented them would be worse than one that admits them.

The broader lesson for selling this: an agent will produce a confident artifact whether or not it is right, so the value is in the verification you wire around it. Research is cheap now. Proof is the product.

## The web app

The markdown artifacts are for reading. The web app is for a live demo: someone names a company they care about, and a dossier assembles in front of them.

```powershell
node web\server.mjs
# Prospect dossier app  ->  http://localhost:4317
```

Type a company, press Research, and the server spawns the same headless run the CLI uses. Progress streams into the page; the dossier renders when it lands. Saved dossiers load instantly from the sidebar.

Sections: company overview with scale figures, trends (reported results, guidance, industry and macro pressure), a dated catalyst timeline, the engineering estate mapped to Factory's operating patterns, a scored fit assessment arguing both sides, the top-ten contact list ranked by who to call first, the competitive field, deal shape, objections, unknowns, and the full source list.

Three design decisions carry the weight:

**The agent writes JSON, not prose.** A dossier is validated against `dossier.schema.json` before it renders. Scraped narrative would have been faster to build and impossible to lay out honestly — you cannot put a fit score in a progress bar if the score only exists inside a paragraph. Structure is also what makes the output checkable.

**Citations are referential, not decorative.** Every claim carries a `sourceId` that must resolve against the `sources` array. The server checks for dangling references on load and the UI banners them. A citation that points at nothing is a bug, and it surfaces as one.

**Link verification is in the UI.** The Sources panel has a button that resolves all of them and reports OK / bot-blocked / soft-404 / dead. It is the same `verify-sources.ps1` the CLI gate runs. Being able to press that button in front of a buyer is the entire point.

```powershell
# zero dependencies: Node built-ins only, so it always starts
web/server.mjs        # jobs, schema validation, source-ref integrity, verifier endpoint
web/public/           # index.html, styles.css, app.js
web/data/<slug>.json  # generated dossiers
```

## Demo path

```powershell
# 1. show the inputs: two skills, one subagent, one runner
Get-ChildItem -Recurse .factory

# 2. show the prompt without spending a run
.\scripts\new-account.ps1 -Account "Kroger" -DryRun

# 3. run it live on an account nobody has prepped
.\scripts\new-account.ps1 -Account "Lowe's" -Mode both

# 4. read the artifact and the gate result
Get-Content .\briefs\lowe-s\brief.md

# 5. or do the same thing in a browser, and let them pick the company
node web\server.mjs
```

## Requirements

Droid CLI (found via `DROID_BIN`, `~/bin/droid.exe`, or PATH), PowerShell 5.1 or later, and network access for research.
