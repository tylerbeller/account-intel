---
name: deal-model
description: Build a qualification scorecard, a bottom-up value model, and a seat-and-ARR expansion ladder for a target account. Use when the user needs deal sizing, MEDDPICC qualification, pilot structure, a paper process, or the economic case for an account.
allowed-tools:
  - Read
  - Create
  - Edit
  - WebSearch
  - FetchUrl
  - LS
version: 1.0.0
---

# Deal model

A strategy brief says why the account is winnable. This says what it is worth, what has to be true, and how it gets signed. Most account plans stop before this part, which is why they read as research rather than as a forecast.

If a brief already exists at `briefs/<account-slug>/brief.md`, read it first and reuse its sourced facts. Follow `../account-brief/evidence-rules.md`. Write to `briefs/<account-slug>/deal-model.md`.

## Part 1 — Qualification scorecard

Score each dimension **Known**, **Hypothesis**, or **Gap**, and name the action that closes it. A dimension marked Known without a source is a Hypothesis.

| Dimension | What to establish |
|---|---|
| Metrics | The number the buyer will judge this on, and its current baseline. No baseline means no provable win. |
| Economic buyer | Who can sign this size of deal without asking anyone. |
| Decision criteria | What they will compare, and who wrote the criteria. |
| Decision process | The actual steps from pilot to signature, including security review and its sequencing. |
| Paper process | Procurement thresholds, legal review, MSA or DPA requirements, and how long each step historically takes. |
| Identified pain | The pain they have said publicly or in discovery, in their words. |
| Champion | Who sells this internally when you are not in the room, and what they personally gain. |
| Competition | Incumbents, internal build, and the status-quo option of doing nothing. |

Then state the two or three conditions that would **disqualify** the deal this quarter. An account plan without disqualification criteria is a wish.

## Part 2 — Bottom-up value model

Build up from one defensible unit. Never lead with headcount times loaded cost times a guessed percentage; that model gets discounted the moment a finance-literate buyer hears it, because the percentage is yours.

Pick the unit from what the brief actually established. Good units:

- **Review hours** — senior engineers spend N hours per week in review; automated review takes X percent off the critical path; that returns Y engineer-weeks per quarter on one team of Z.
- **Onboarding to first PR** — current time-to-first-PR times the number of engineers onboarded per quarter.
- **Migration flows** — flows per sprint now versus with agents, expressed as months pulled off a decommission date. The decommission date is usually the CFO's number, because it retires a running cost.
- **Patch backlog** — repos per CVE class, hours per repo, times classes per quarter.

Present it as: assumption, arithmetic, result, and then the sentence that matters most — **the pilot exists to replace these assumptions with their baselines.** Keep the top-down total as context underneath, never as the headline.

## Part 3 — Seat and ARR ladder

Every rung needs a seat count, an annual value, and a **gate**: the specific condition that must be true before the next rung is even proposed.

| Rung | Seats | Annual value | Gate |
|---|---|---|---|
| Technical proof | small, unpaid or nominal | — | exit criterion the customer set, in writing, before it started |
| Paid pilot | | | scope signed, baselines captured on day one |
| First expansion | | | day-90 delta clears the agreed threshold |
| Platform | | | security sign-off at scale |
| Enterprise agreement | | | economic case accepted by the buyer's own finance function |

Rules:

1. State the per-seat price as an **assumption** and show the arithmetic, so a reader can substitute real pricing. Do not present assumed pricing as a quote.
2. Size the pilot deliberately under the procurement threshold you identified. Say that out loud; it reads as experience.
3. Pre-agree the pilot in writing before the free proof runs. You are not asking for goodwill, you are asking them to commit to the next step if their own criterion is met.
4. Put the enterprise agreement in a later fiscal year than feels optimistic. A ladder that lands everything inside four quarters is not credible.

## Part 4 — Paper process and timeline

A dated path to signature: security review start, pilot scope agreement, baseline capture, readout, procurement steps, and signature, aligned to their fiscal calendar and any freeze window.

## Output checklist

- [ ] Every scorecard dimension labeled Known, Hypothesis, or Gap, each Gap with a closing action
- [ ] Disqualification criteria stated
- [ ] Value model is bottom-up, with inputs a buyer can replace
- [ ] Every ladder rung has seats, value, and a gate
- [ ] Pricing marked as assumption with arithmetic shown
- [ ] Procurement threshold named and the pilot sized under it
- [ ] Nothing presented as committed that has not been committed
