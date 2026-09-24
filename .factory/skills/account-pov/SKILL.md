---
name: account-pov
description: Turn an existing prospect dossier into the argument layer - a three-part point of view (why anything, why Factory, why now), warm paths into the account, and a ready-to-send outreach sequence. Use when a rep needs the pitch rather than the research, or when the web app requests a point of view for a saved dossier.
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

# Account point of view

The dossier answers *what is true*. This answers *what to say*. They are separate artifacts on purpose: the facts change quarterly, the argument changes with every conversation, and a rep should be able to regenerate the argument without paying for research again.

**Read first:** `pov.schema.json` in this folder, and `../account-brief/evidence-rules.md`.

## Inputs

A dossier path (default `web/data/<slug>.json`) and an output path (default `web/data/<slug>.pov.json`).

## Step 1 — Read the dossier, do not re-research it

Read the dossier JSON in full. It already contains sourced financials, dated catalysts, the engineering estate, a scored fit assessment with reasons against, the ranked target list, the competitive field, and the unknowns. Its `sources` array is your citation vocabulary: **every `sourceId` you write must already exist in that array.** You are not allowed to invent a new source id.

If `briefs/<slug>/brief.md` exists, read it too. It often carries reasoning that did not survive into JSON.

Research is permitted for exactly one thing: **warm paths** (step 4). Everything else is synthesis of what the dossier already proves.

## Step 2 — Build the three pillars

Each pillar needs a claim, at least one piece of cited evidence, and a stated risk.

**Why anything.** Why the status quo is unacceptable *for them*. This must be about their business: a margin line, a reliability event, a modernization backlog, a regulatory deadline. If your "why anything" mentions Factory, it is wrong. Take it from `trends.pressures`, `trends.industry`, and `techEstate`.

**Why Factory.** Why this rather than the named alternative. Look at `competition` and say what those vendors do not do, without pretending they are bad at it. Use `fit.reasonsFor`, and respect `fit.reasonsAgainst` — an argument that ignores the honest objection gets destroyed on the call. Populate `versus` with the actual alternatives, including "do nothing" and "an IDE copilot they already have," because those are the real competitors.

**Why now.** This must rest on a dated event from `catalysts`. A new CIO in month four, a fiscal year that starts in six weeks, an acquisition that needs integrating, a stated deadline. If no catalyst supports urgency, say so in the claim and set the risk accordingly. Manufactured urgency is the fastest way to lose credibility with a senior buyer. Set `expiresOn` when the window has a real end date.

**The risk field is not optional and not a formality.** Write the objection a sharp buyer would actually raise against that pillar. If you cannot think of one, you have not understood the pillar.

## Step 3 — The ask, the soundbite, and what not to say

`theAsk` is one concrete, small, scheduled thing: a 30-minute working session with two named people, a scoped pilot on one named repository. Not "explore a partnership." Include a `fallback` that is smaller.

`doNotSay` is the honesty valve. List the claims a rep would be tempted to make under pressure that the evidence does not support: a named ROI figure that came from a different industry, a headcount reduction nobody promised, a customer reference in the wrong vertical, a capability that is on a roadmap. For each, give the reason. This section protects the rep from themselves, and it is often the most valuable part of the file.

## Step 4 — Warm paths (the only step that may research)

A cold email to a ranked target is the fallback, not the plan. Find routes that are warmer:

- **Customer reference** — a published Factory customer in the same vertical or with the same estate, quotable as published.
- **Alumni** — a public figure who worked at both companies. Public record only: press, conference bios, published leadership pages.
- **Board or investor overlap** — shared board seats or investors, from proxies and filings.
- **Partner or vendor** — a systems integrator or cloud partner already inside the account.
- **Community or conference** — a named upcoming event where a target is a speaker.
- **Analyst or advisor** — an analyst who covers both.

Label `confidence` honestly and give each path a concrete `action`. **Do not write anything sourced from a personal social graph, scraped contact data, or a private database.** If you find nothing, return an empty array. An empty warm-path list is a true answer; a speculative one wastes a rep's best asset.

Prior relationships from the CRM are *not* written here. The server adds those from the CRM provider so that internal and public provenance stay visibly separate.

## Step 5 — The outreach sequence

Write a sequence for the **top two or three targets only**, taken from `targets` by rank. A ten-person sequence never gets sent.

Rules that make the difference between usable and discarded:

1. **Send-ready.** No `[placeholders]`, no "Hi {{FirstName}}", no "as you may know." If you cannot write the sentence, do not include the touch.
2. **Every factual claim in a body carries a `sourceIds` entry.** If a sentence says their gross margin fell 70 basis points, the source id for that figure belongs in the array. This is what stops a sequence from confidently misquoting a prospect's own earnings back at them.
3. **Short.** A first email over 120 words does not get read by an EVP. Aim for 60 to 90.
4. **One idea per touch,** and set the sequence `angle` so the whole thread is coherent.
5. **Earn the next touch.** Later touches add something new (a filing, an event, a reference), never "just bumping this."
6. **Respect the gatekeepers.** If `targets` marks someone a gatekeeper, the sequence for them is about risk and control, not productivity.
7. **Match the channel to the level.** An EVP gets a short email or a referral. A director gets LinkedIn. A practitioner gets something technical.

## Step 6 — Validate before writing

Check every item, then write the file:

- [ ] Every `sourceId` and every entry in every `sourceIds` array exists in the dossier's `sources`.
- [ ] All three pillars have a non-empty `risk`.
- [ ] `whyAnything.claim` does not mention Factory.
- [ ] `whyNow` traces to a dated catalyst, or openly admits there is no urgency.
- [ ] `theAsk.ask` is one scheduled thing with a `fallback`.
- [ ] `doNotSay` is non-empty. There is always something not supported.
- [ ] No outreach body contains a bracket placeholder or a merge field.
- [ ] Every factual sentence in every body has a source id behind it.
- [ ] `basedOnDossier` is set to the dossier's `generatedAt`.
- [ ] The file validates against `pov.schema.json`.

Then report the output path, the three claims in one line each, the number of warm paths by confidence, and the count of `doNotSay` entries.

## What this skill will not do

It will not invent a customer reference, a named ROI figure, a quote, or a relationship. It will not write urgency that no dated event supports. If the dossier is thin, the point of view says so plainly, because a rep who walks into a senior meeting carrying a fabricated argument does not get a second one.
