# Evidence rules

These apply to every artifact this repository produces. They exist because a single fabricated number costs more credibility than ten missing ones.

## Sourcing

1. Every factual claim gets an inline source: a URL plus the publication date.
2. Primary sources beat secondary ones. Order of preference: company investor relations and SEC filings, company press releases, company engineering blog, named-reporter trade press, analyst commentary.
3. Flag any source older than 24 months as potentially stale, and flag leadership facts older than 12 months for re-verification. Executives move.
4. Quote figures exactly as published. Do not annualize a quarter, convert a currency, or turn two differently-measured numbers into a ratio.

## The man-days trap

If a source gives effort in one unit and elapsed time in another (for example "scoped at 10,000 man-days, delivered in 45 days"), quote the pair and stop. Dividing one by the other produces a meaningless multiple, and any finance-literate buyer will catch it. Let them do their own arithmetic.

## Links rot, so cite for durability

Verified against a real run:

- **Job postings expire.** A posting is good evidence of a stack, but its URL returns 410 within months. Capture the quoted requirement and the access date in the brief itself, so the claim survives the link.
- **Some hosts answer non-browser clients with 404 or 403** even for pages that exist. A failed automated check is a prompt to confirm in a browser, not proof the citation is wrong.
- **Corporate newsrooms often return HTTP 200 with a "page not found" body.** A status code alone never proves a page exists.

Run `scripts/verify-sources.ps1` against any artifact before it reaches a customer conversation, and resolve everything it flags.

## Estimates

An estimate is allowed when it is:

1. labeled as an estimate in the text, not just in a footnote,
2. shown with its inputs so the buyer can substitute their own, and
3. built bottom-up from a unit you can defend, rather than top-down from a total.

Top-down models ("40,000 engineers times $150K times 10 percent") get discounted on contact, because the percentage is yours and the buyer knows it. Bottom-up models survive interrogation because every input is checkable and the arithmetic is small.

## Unknowns

A brief with a populated unknowns section is more useful than one without, and it converts directly into first-call questions. For each unknown, record what you searched so nobody repeats the work.

Never let the absence of a fact become an assumed fact.

## Customer references

Only cite published customer results, quoted as published, with the source and date. Name the industry gap out loud when the reference is from a different vertical than the account. An unnamed reference, or one you are not cleared to use, belongs in an internal ask, not in a customer conversation.

## Confidence labels

Tag each major section:

- **Sourced** — every claim has a primary or named-reporter source
- **Partially sourced** — key claims sourced, some gaps marked
- **Hypothesis** — reasoned from evidence but not directly confirmed; must say so in the room
