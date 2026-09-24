# AGENTS.md

Account research kit for enterprise sales. Turns an account name into a sourced strategy brief and a deal model.

## Commands

```powershell
# brief only (default)
.\scripts\new-account.ps1 -Account "Lowe's"

# brief + deal model
.\scripts\new-account.ps1 -Account "Delta Air Lines" -Mode both

# see the prompt without spending a run
.\scripts\new-account.ps1 -Account "Kroger" -DryRun
```

The runner resolves the Droid CLI from `DROID_BIN`, then `~/bin/droid.exe`, then PATH.

## Layout

- `.factory/skills/account-brief/` — research workflow, evidence rules, output template
- `.factory/skills/deal-model/` — qualification scorecard, bottom-up value model, seat and ARR ladder
- `.factory/droids/account-researcher.md` — read-only research subagent, used six at a time in parallel
- `briefs/<account-slug>/` — generated artifacts
- `logs/` — one log per run

## Non-negotiables

1. **Every number carries a source URL and a publication date.** No exceptions.
2. **Never invent a fact to fill a gap.** An unknown is an asset because it becomes a first-call question. A fabrication loses the account.
3. **Value models are built bottom-up** from a defensible unit. Top-down (headcount times cost times a guessed percentage) may appear as context, never as the headline.
4. **Label every estimate as an estimate**, in the text and not just a footnote, and show its inputs so a buyer can substitute their own.
5. **Say what is not public.** State what was searched. That is stronger than implying knowledge.
6. **Customer references are quoted as published**, with the source, and with the vertical gap named out loud.

Full reasoning behind these: `.factory/skills/account-brief/evidence-rules.md`.

## Definition of done

The runner enforces a gate: an artifact must exist, carry at least `-MinSources` source links (default 10), and contain an unknowns section. A run that produces prose without sources exits non-zero. Treat that gate as the contract, not as a lint step.

## Conventions

- Generated artifacts are committed, so briefs are reviewable and diffable over time. Re-running an account should produce a readable diff, not a rewrite.
- Do not put customer-confidential material, pricing quotes, or anything from a CRM in this repo. Public sources and clearly-labeled assumptions only.
