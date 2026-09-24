# Lowe's — Factory deal model

**Prepared:** September 24, 2026  
**Overall confidence:** Hypothesis. Public evidence identifies a timely account and plausible buyers, but no Lowe's buyer has confirmed the workload, baseline, budget, procurement path, security path, or commercial intent.

This model uses public facts from the [Lowe's account brief](brief.md). All prices, seat counts, durations, dates, thresholds, and productivity inputs below are explicitly labeled planning assumptions. They are not Lowe's commitments and are not Factory quotes.

## Executive deal shape

- **Lead use case:** one low-blast-radius Java/Spring Boot change stream or one FBM-to-Lowe's integration workflow. Lowe's publicly recruits for Java/Spring Boot services, while the private repository estate and FBM integration architecture are not public ([Lowe's Careers, September 25, 2025](https://talent.lowes.com/us/en/job/JR-02158555/Software-Engineer-Java-Spring-Boot); [Lowe's, October 9, 2025](https://corporate.lowes.com/newsroom/press-releases/lowes-completes-acquisition-foundation-building-materials)).
- **Executive hypothesis:** Seemantini Godbole is the likely technology sponsor because her remit includes enterprise technology, engineering, product, data, analytics, innovation, and AI. Her authority to sign the modeled deal size without further approval is not public ([Lowe's 8-K, September 2, 2026](https://www.sec.gov/Archives/edgar/data/60667/000006066726000119/low-20260828.htm); [Lowe's biography, accessed September 24, 2026](https://corporate.lowes.com/who-we-are/lowes-leadership/executive-leadership/seemantini-godbole)).
- **Commercial motion:** written technical-proof criteria, then a paid pilot deliberately kept below Lowe's applicable procurement threshold, then expansion only after Lowe's measures an agreed improvement.
- **No forecast claim:** no stage, close date, value, or probability in this document is buyer-confirmed.

## 1. Qualification scorecard

| Dimension | Status | Current evidence or hypothesis | Action that closes it |
|---|---|---|---|
| **Metrics** | **Gap** | No public source establishes the target team's baseline for accepted-issue-to-approved-change time, active engineering time, review wait, rework, throughput, or cost. | In the first working session, choose one metric and one denominator. Export the prior eight weeks of comparable issues, record median elapsed time and engineer-hours, and have the service owner approve the baseline in writing before the proof starts. |
| **Economic buyer** | **Hypothesis** | Godbole is the likely executive sponsor because her expanded remit covers technology, engineering, product, data, analytics, innovation, and AI. Public evidence does not show her delegated signing limit or whether Pro, finance, or procurement controls this budget ([Lowe's 8-K, September 2, 2026](https://www.sec.gov/Archives/edgar/data/60667/000006066726000119/low-20260828.htm); [Lowe's biography, accessed September 24, 2026](https://corporate.lowes.com/who-we-are/lowes-leadership/executive-leadership/seemantini-godbole)). | Ask who owns the budget, who can approve the paid pilot without further authorization, and who approves later platform spend. Secure a meeting with that person before the free proof. |
| **Decision criteria** | **Gap** | No buyer-authored evaluation criteria are public. Factory should not substitute generic productivity claims. | Have the engineering owner, security approver, and business owner sign a one-page scorecard covering acceptance-test pass rate, human-review requirements, prohibited actions, audit evidence, elapsed time, engineer-hours, and the minimum improvement required to proceed. |
| **Decision process** | **Gap** | The actual route from assessment to repository access, technical proof, paid pilot, expansion, and signature is not public. | Map every approval and approver in a mutual action plan: architecture, security, privacy, AI governance, service ownership, finance, sourcing, legal, vendor onboarding, purchase order, and signature. Put sequencing and target dates beside each step. |
| **Paper process** | **Gap** | Lowe's procurement threshold, competitive-bid rules, standard agreement, DPA requirements, insurance requirements, vendor onboarding steps, signing authority, and historical cycle times are not public. The brief searched Lowe's investor materials, procurement-facing pages, careers content, and public web results without finding them. | Ask sourcing for the applicable threshold and required documents before pricing the pilot. Request Lowe's standard MSA, DPA, security addendum, AI terms, insurance schedule, vendor-registration packet, purchase-order requirements, and average review times. |
| **Identified pain** | **Gap** | Public facts create a plausible pressure hypothesis, not buyer-acknowledged engineering pain: Lowe's completed its $8.8 billion FBM acquisition on October 9, 2025, is expanding Pro digital workflows, and eliminated about 600 corporate and support roles in February 2026 ([Lowe's, October 9, 2025](https://corporate.lowes.com/newsroom/press-releases/lowes-completes-acquisition-foundation-building-materials); [Lowe's, February 17, 2026](https://corporate.lowes.com/newsroom/press-releases/lowes-strengthens-pro-experience-small-medium-size-pro); [Reuters, February 13, 2026](https://www.reuters.com/business/lowes-cuts-600-corporate-support-roles-wsj-reports-2026-02-13/)). No public source says a named software backlog is late or why. | Ask McFarland's business owner and the target engineering owner to name one delayed integration or maintenance queue, its business date, the current bottleneck, and the consequence of missing it. Record their wording verbatim. |
| **Champion** | **Hypothesis** | Joseph McFarland is a plausible business sponsor because his remit includes Pro and home services, but there is no evidence that he or a named delegate will sell Factory internally. The practitioner champion is unknown ([Lowe's 8-K, September 2, 2026](https://www.sec.gov/Archives/edgar/data/60667/000006066726000119/low-20260828.htm)). | Identify a director, staff engineer, or product owner who owns the target result, has access to the data, will convene security and procurement, and benefits from hitting the business date. Test the champion by asking them to secure the baseline, approvers, and proof environment without Factory present. |
| **Competition** | **Hypothesis** | Google Cloud and OpenAI are known AI incumbents, but Lowe's private coding assistant, source host, CI/CD system, and application-security stack are not public. Internal build and doing nothing remain credible alternatives ([Google Cloud, April 29, 2025](https://cloud.google.com/blog/topics/retail/how-vertex-ai-vector-search-helps-create-interactive-shopping-experiences); [Lowe's, May 5, 2025](https://corporate.lowes.com/newsroom/press-releases/lowes-deploys-first-scale-ai-assistant-retail-associates)). | Inventory approved coding agents and platform tools, run the same buyer-selected issue against the current workflow and Factory where policy allows, and include internal build and status quo in the decision scorecard. Stop if the incumbent already clears the buyer's threshold. |

### Disqualification criteria for this quarter

Disqualify the opportunity from an active-quarter forecast if any of these conditions holds:

1. **No owned pain:** Lowe's will not name a specific backlog, business date, accountable service owner, and measurable baseline before the technical proof.
2. **No viable control path:** security or AI governance cannot approve any deployment pattern that permits useful work on representative code, or no named security approver is assigned.
3. **No committed next step:** before free work begins, Lowe's will not put the technical-proof exit criterion, the paid-pilot decision, the budget owner, and the procurement route in writing.

The opportunity may remain a nurture account after disqualification; it should not remain a current-quarter deal.

## 2. Bottom-up value model

### Chosen unit

The unit is **one comparable, buyer-accepted issue moved from ready-for-engineering to an approved change**, including implementation, tests, review, and rework. This avoids an unsupported enterprise-headcount model and can be measured from one team's own systems.

### Model assumptions

All figures in this subsection are **illustrative planning assumptions prepared September 24, 2026**, not Lowe's baselines or Factory commitments. This subsection is the source for figures marked **[Model assumption, September 24, 2026](#model-assumptions)**.

| Input | Illustrative assumption | Buyer replacement required |
|---|---:|---|
| Comparable accepted issues in one quarter | 15 issues | Export actual target-team volume and exclude incidents, epics, and incomparable work. |
| Baseline active engineering effort per issue | 24 engineer-hours | Reconstruct active implementation, test, review, and rework effort from the prior eight weeks. |
| Pilot active engineering effort per issue | 16.8 engineer-hours | Measure actual effort for pilot issues; this illustration assumes a 30% reduction. |
| Standard planning week | 40 hours | Replace with Lowe's finance or workforce-planning convention. |
| Fully loaded engineering cost | Not assumed | Lowe's finance should supply it only if it wants a dollar conversion. |

### Illustrative arithmetic

1. **Effort returned per accepted issue:** 24 baseline hours minus 16.8 pilot hours equals **7.2 engineer-hours per issue** ([Model assumption, September 24, 2026](#model-assumptions)).
2. **Quarterly effort returned on one team:** 15 comparable issues multiplied by 7.2 hours equals **108 engineer-hours per quarter** ([Model assumption, September 24, 2026](#model-assumptions)).
3. **Capacity equivalent:** 108 hours divided by a 40-hour planning week equals **2.7 engineer-weeks per quarter** ([Model assumption, September 24, 2026](#model-assumptions)).
4. **Optional finance conversion:** 108 hours multiplied by Lowe's own fully loaded hourly cost. No public cost input is substituted.

**Illustrative result:** under these assumptions, one team gets 108 engineer-hours, or 2.7 planning weeks, back per quarter. This is capacity, not booked savings. It becomes cash savings only if Lowe's finance identifies an avoided contractor cost, avoided hire, retired system cost, or another budget line.

**The pilot exists to replace every illustrative assumption above with Lowe's own baseline.**

### Pilot measurement design

Measure the baseline and pilot cohorts with the same issue rules:

- Start the clock when an issue is marked ready and its acceptance tests are agreed.
- End the clock when a human reviewer approves the change; production deployment is a separate measure unless Lowe's chooses it.
- Track median elapsed time, active engineer-hours, review-wait time, rework cycles, acceptance-test pass rate, escaped defects, and security-policy exceptions.
- Compare like with like by language, repository, issue class, and complexity band.
- Report the full cohort, including failed or abandoned attempts. Do not count generated code or suggestions as value.
- Treat a faster result as invalid if defect, security, or human-review controls worsen.

The buyer must set the improvement threshold before the proof. The **30% reduction** above is only an illustration ([Model assumption, September 24, 2026](#model-assumptions)).

### Top-down context, not the headline

Lowe's public materials do not establish engineering headcount, repository count, or addressable workflow volume. Therefore, this model does not extrapolate the one-team result to an enterprise total. Any later extrapolation must use Lowe's verified team count, qualified issue volume, adoption rate, and finance-approved cost inputs.

## 3. Seat and annual-value ladder

### Commercial assumptions

- The planning price is **$2,400 per seat per year**, created solely for this model and not a Factory quote ([Model assumption, September 24, 2026](#model-assumptions)).
- Annual value equals seats multiplied by the assumed annual per-seat price. Taxes, services, usage, implementation, and discounts are excluded.
- The paid pilot is provisionally modeled at **12 seats and $28,800 annual value** ([Model assumption, September 24, 2026](#model-assumptions)).
- Lowe's applicable procurement threshold is **unknown**. Let that threshold be **T**. The pilot may be proposed only after sourcing confirms that **T is greater than $28,800**. If it is not, reduce the pilot to at most `floor((T - $1) / $2,400)` seats or obtain the required procurement approval; never split purchases to evade policy ([Model assumption, September 24, 2026](#model-assumptions)).

| Rung | Seat count | Annual value | Gate before the next rung |
|---|---:|---:|---|
| **Technical proof** | 5 seats | $0; unpaid and not annualized ([Model assumption, September 24, 2026](#model-assumptions)) | Before access begins, Lowe's sets the exit criterion in writing, identifies a representative low-blast-radius issue, approves the data and control boundary, and writes the conditional paid-pilot decision. |
| **Paid pilot** | 12 seats | 12 × $2,400 = **$28,800** assumed annual value ([Model assumption, September 24, 2026](#model-assumptions)) | Sourcing confirms the pilot is below the applicable threshold, scope is signed, baseline is captured on the first day, and the buyer pre-agrees the minimum measured delta and control requirements. |
| **First expansion** | 50 seats | 50 × $2,400 = **$120,000** assumed annual value ([Model assumption, September 24, 2026](#model-assumptions)) | The paid-pilot readout clears the buyer's written threshold without worsening defects or security outcomes; finance accepts the economic method; a funded service group and champion are named. |
| **Platform** | 250 seats | 250 × $2,400 = **$600,000** assumed annual value ([Model assumption, September 24, 2026](#model-assumptions)) | Security, privacy, architecture, identity, logging, support, and model-routing controls are approved at scale; at least two distinct teams reproduce the result under the same measurement rules. |
| **Enterprise agreement** | 1,000 seats | 1,000 × $2,400 = **$2,400,000** assumed annual value ([Model assumption, September 24, 2026](#model-assumptions)) | Lowe's finance accepts its own bottom-up case, procurement selects an enterprise vehicle, adoption capacity is funded, and portfolio governance can stop or remediate underperforming workflows. Target no earlier than fiscal 2028 ([Model assumption, September 24, 2026](#model-assumptions)). |

No rung is committed. The next rung should not be proposed until its gate is met.

## 4. Paper process

### What is known

- Juliette Pryor's remit includes legal, compliance, enterprise risk management, and privacy, making her organization a likely policy stakeholder, not a confirmed contract approver ([Lowe's biography, accessed September 24, 2026](https://corporate.lowes.com/who-we-are/lowes-leadership/executive-leadership/juliette-w-pryor)).
- Marc Varner leads Lowe's global cybersecurity strategy and protection of information assets and technology, making his organization a likely security approver, not a confirmed signer ([Lowe's biography, accessed September 24, 2026](https://corporate.lowes.com/who-we-are/lowes-leadership/senior-leadership/marc-h-varner)).
- Lowe's fiscal year ends on the Friday nearest January 31; fiscal 2025 ended January 30, 2026 ([Lowe's fiscal 2025 Form 10-K, filed March 23, 2026](https://www.sec.gov/Archives/edgar/data/60667/000006066726000029/low-20260130.htm)).
- Lowe's describes spring as its busy season, but target-team code freezes, budget refreshes, and procurement blackout dates are not public ([Lowe's, May 21, 2025](https://corporate.lowes.com/newsroom/press-releases/lowes-reports-first-quarter-2025-sales-and-earnings-results)).

### Required paper path

| Step | Current state | Required artifact and closing action |
|---|---|---|
| Budget and authority | **Gap** | Name the cost center, budget owner, economic buyer, delegated signing limit, and fiscal-year source of funds. |
| Procurement threshold | **Gap** | Sourcing states the threshold **T**, whether annual value or total contract value controls it, and whether a competitive bid is required. Keep the pilot below **T** only through legitimate scope, never invoice splitting. |
| Security and AI review | **Gap** | Obtain the intake form and approver; provide architecture, code and model data flows, subprocessors, retention, encryption, identity, secrets handling, logging, human approval, rollback, incident response, and deployment options. |
| Privacy and data protection | **Gap** | Confirm whether personal, customer, associate, payment, or production data is prohibited; determine whether a DPA, privacy impact assessment, or AI assessment is required. |
| Legal terms | **Gap** | Request Lowe's preferred MSA, DPA, AI terms, security addendum, IP and output terms, indemnity, limitation of liability, audit rights, and governing-law position. |
| Vendor onboarding | **Gap** | Obtain registration, tax, banking, insurance, accessibility, business-continuity, and third-party-risk requirements. |
| Purchase and signature | **Gap** | Confirm requisition, purchase-order, order-form, and signature sequence; name every approver and expected service-level time. |

Historical review times are not public. Do not promise the target dates below until Lowe's supplies its actual process and owners.

## 5. Target timeline to paid-pilot signature

These are **planning dates prepared September 24, 2026**, not Lowe's commitments ([Model assumption, September 24, 2026](#model-assumptions)). Reset them in a mutual action plan as soon as Lowe's provides its holiday freeze, spring workload, fiscal planning, and procurement calendar.

| Target date | Milestone | Exit evidence |
|---|---|---|
| **October 9, 2026** | Discovery complete | Named backlog, business date, service owner, executive sponsor hypothesis, metric, and incumbent workflow. |
| **October 16, 2026** | Baseline design complete | Cohort rules, data source, prior-eight-week extraction plan, and buyer-authored success threshold. |
| **October 23, 2026** | Security and AI intake opened | Named approver, deployment path, required documents, prohibited data, and review sequence. |
| **October 30, 2026** | Commercial route mapped | Threshold **T**, budget owner, signing authority, contract vehicle, legal documents, and vendor-onboarding checklist. |
| **November 6, 2026** | Proof plan signed | Technical-proof exit criterion and conditional paid-pilot decision are in writing before free work begins. |
| **November 9–20, 2026** | Technical proof | One representative issue evaluated under Lowe's tests, review rules, and approved controls. |
| **November 23, 2026** | Proof readout | Buyer records pass or fail against its criterion; failures and control exceptions remain in the report. |
| **November 30, 2026** | Paid-pilot package submitted | Scope, seat count, price, measurement plan, security responses, MSA or order form, and implementation plan submitted through the confirmed route. |
| **December 1, 2026–January 15, 2027** | Security, legal, sourcing, and vendor review | Every issue has an owner and due date. No production or write access is assumed during review. |
| **January 22, 2027** | Target paid-pilot signature | Authorized signatures, purchase order if required, security approval, named participants, and kickoff date. |
| **February 1, 2027** | Paid-pilot baseline and kickoff | Baseline frozen on day one; repository, issues, controls, and reviewers confirmed. |
| **March 26, 2027** | Paid-pilot measurement closes | Full cohort exported, including failures, rework, defects, policy exceptions, and incumbent comparison. |
| **March 29, 2027** | Executive readout | Lowe's decides stop, extend measurement, or open first-expansion procurement. |
| **June 30, 2027** | Earliest modeled first-expansion signature | Only if the measured gate, finance review, security-at-scale approval, budget, and actual paper process are complete. |

If Lowe's freeze window conflicts with the proof or pilot, move the dates. Do not route around the freeze. The enterprise agreement belongs no earlier than fiscal 2028, after reproducible multi-team evidence and buyer-finance acceptance ([Model assumption, September 24, 2026](#model-assumptions)).

## 6. Open gaps and next-call agenda

The first call should close or assign owners to these unknowns:

1. The named backlog, business deadline, issue volume, bottleneck, and consequence of delay.
2. The buyer-owned baseline and minimum improvement threshold.
3. The economic buyer, budget owner, signing authority, and fiscal-year funding source.
4. The practitioner champion and security approver.
5. The private source host, ticketing, CI/CD, review, testing, scanning, and approved coding-assistant stack.
6. The required code, model, identity, logging, retention, privacy, and human-approval controls.
7. Procurement threshold **T**, competitive-bid rule, vendor-onboarding route, contract set, approval sequence, and historical cycle times.
8. Holiday or peak-season freezes, spring constraints, and budget-refresh dates.

### Sources searched without finding the paper-process details

The existing brief searched Lowe's investor relations and SEC filings, corporate news, leadership pages, careers pages, public GitHub organization, Google Cloud material, acquisition releases, procurement-facing pages, and public web results. Those searches did not establish a procurement threshold, delegated signing limits, standard contract set, internal approval sequence, historical cycle times, budget-refresh dates, or code-freeze windows. These remain discovery questions rather than assumptions.

## Source list

1. Lowe's Companies, Form 8-K, September 2, 2026: https://www.sec.gov/Archives/edgar/data/60667/000006066726000119/low-20260828.htm
2. Lowe's, Seemantini Godbole biography, accessed September 24, 2026: https://corporate.lowes.com/who-we-are/lowes-leadership/executive-leadership/seemantini-godbole
3. Lowe's, “Lowe's Completes Acquisition of Foundation Building Materials,” October 9, 2025: https://corporate.lowes.com/newsroom/press-releases/lowes-completes-acquisition-foundation-building-materials
4. Lowe's, “Lowe's Strengthens Pro Experience for Small to Medium-Size Pro,” February 17, 2026: https://corporate.lowes.com/newsroom/press-releases/lowes-strengthens-pro-experience-small-medium-size-pro
5. Reuters, “Lowe's cuts 600 corporate and support roles to focus on store employees,” February 13, 2026: https://www.reuters.com/business/lowes-cuts-600-corporate-support-roles-wsj-reports-2026-02-13/
6. Lowe's Careers, Java/Spring Boot software engineer posting, September 25, 2025: https://talent.lowes.com/us/en/job/JR-02158555/Software-Engineer-Java-Spring-Boot
7. Google Cloud, “How Vertex AI Vector Search helps create interactive shopping experiences,” April 29, 2025: https://cloud.google.com/blog/topics/retail/how-vertex-ai-vector-search-helps-create-interactive-shopping-experiences
8. Lowe's, “Lowe's Deploys First At-Scale AI Assistant for Retail Associates,” May 5, 2025: https://corporate.lowes.com/newsroom/press-releases/lowes-deploys-first-scale-ai-assistant-retail-associates
9. Lowe's, Juliette W. Pryor biography, accessed September 24, 2026: https://corporate.lowes.com/who-we-are/lowes-leadership/executive-leadership/juliette-w-pryor
10. Lowe's, Marc H. Varner biography, accessed September 24, 2026: https://corporate.lowes.com/who-we-are/lowes-leadership/senior-leadership/marc-h-varner
11. Lowe's Companies, fiscal 2025 Form 10-K, filed March 23, 2026: https://www.sec.gov/Archives/edgar/data/60667/000006066726000029/low-20260130.htm
12. Lowe's, “Lowe's Reports First Quarter 2025 Sales and Earnings Results,” May 21, 2025: https://corporate.lowes.com/newsroom/press-releases/lowes-reports-first-quarter-2025-sales-and-earnings-results
