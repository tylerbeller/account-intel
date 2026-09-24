# Lowe's — Factory account brief

**Prepared:** 2026-09-24 · **Confidence:** partially sourced

## 1. The play in five lines

- **Account:** Lowe's is a large omnichannel home-improvement retailer integrating stores, digital commerce, Pro services, acquired businesses, and AI on a Google Cloud-centered estate; fiscal 2025 sales were $86.3 billion ([2026 proxy, Apr. 16, 2026](https://www.sec.gov/Archives/edgar/data/60667/000006066726000056/a2026lowescompaniesinc.htm)).
- **Window:** On Sept. 1, 2026, Lowe's made Seemantini Godbole its EVP and chief information and AI officer while changing four other EVP remits, immediately after its former AI leader left and while the company integrates Foundation Building Materials (FBM) ([Lowe's 8-K, Sept. 2, 2026](https://www.sec.gov/Archives/edgar/data/60667/000006066726000119/low-20260828.htm); [CNBC, Aug. 11, 2026](https://www.cnbc.com/2026/08/11/target-appoints-chief-ai-officer-chandhu-nair.html)).
- **Thesis:** Help Godbole turn the new AI mandate into controlled engineering throughput on one named integration or modernization backlog, without adding review and security risk.
- **Entry:** A read-only assessment of one Java/Spring Boot service or one FBM-to-Lowe's integration workflow, ending in a buyer-owned baseline, control map, and pilot plan.
- **Ladder:** One team and repository, then the related service group, then repeatable SDLC, migration, and remediation workflows across the approved portfolio.

## 2. Position and pressure

**Momentum — Sourced.** Second-quarter fiscal 2026 sales reached $26.0 billion, comparable sales rose 0.2%, and management cited strength in Pro, online, and home services. Lowe's also launched AI-generated material lists for Pro quotes, expanded Pro digital tools, and continues to deploy customer and associate AI products ([Q2 results, Aug. 19, 2026](https://corporate.lowes.com/newsroom/press-releases/lowes-reports-second-quarter-2026-sales-and-earnings-results); [AI material lists, May 21, 2026](https://corporate.lowes.com/newsroom/press-releases/lowes-boosts-pro-efficiency-ai-driven-material-lists-new-tool-delivers-product-quotes-minutes); [Pro experience, Feb. 17, 2026](https://corporate.lowes.com/newsroom/press-releases/lowes-strengthens-pro-experience-small-medium-size-pro)).

**Pressure — Sourced.** Lowe's set its fiscal 2026 outlook at approximately $92 billion of sales and flat comparable sales after citing persistent softness in discretionary DIY demand. In February it also eliminated about 600 corporate and support roles, less than 1% of its workforce, to redirect resources toward stores ([Q2 results, Aug. 19, 2026](https://corporate.lowes.com/newsroom/press-releases/lowes-reports-second-quarter-2026-sales-and-earnings-results); [Reuters, Feb. 13, 2026](https://www.reuters.com/business/lowes-cuts-600-corporate-support-roles-wsj-reports-2026-02-13/)).

**Why this is a software problem, not just a cost problem.** Growth now depends on joining acquired Pro capabilities, Lowe's digital channels, associate tools, AI services, cloud platforms, and security controls. Cutting spend does not remove that integration and maintenance work.

## 3. Catalyst window

**Confidence: Sourced for the events below; not claimed as an exhaustive internal reorganization record.**

- **Oct. 9, 2025 — URGENT:** Lowe's completed its $8.8 billion acquisition of FBM, adding 370 locations and a separate Pro distribution and digital estate that now must operate with Lowe's channels ([Lowe's, Oct. 9, 2025](https://corporate.lowes.com/newsroom/press-releases/lowes-completes-acquisition-foundation-building-materials)).
- **Feb. 13, 2026:** Lowe's announced the elimination of about 600 corporate and support roles, creating pressure to deliver the same or greater change with fewer central resources ([Reuters, Feb. 13, 2026](https://www.reuters.com/business/lowes-cuts-600-corporate-support-roles-wsj-reports-2026-02-13/)).
- **Feb. 17, 2026:** Lowe's expanded Pro Extended Aisle and Pro digital workflows, increasing the importance of reliable product, quote, purchase, and fulfillment integrations ([Lowe's, Feb. 17, 2026](https://corporate.lowes.com/newsroom/press-releases/lowes-strengthens-pro-experience-small-medium-size-pro)).
- **May 21, 2026:** Lowe's launched AI-driven material lists that convert project descriptions into product lists and quotes, putting generative AI directly into a revenue workflow ([Lowe's, May 21, 2026](https://corporate.lowes.com/newsroom/press-releases/lowes-boosts-pro-efficiency-ai-driven-material-lists-new-tool-delivers-product-quotes-minutes)).
- **Aug. 3, 2026:** Lowe's held another company-wide AI Day, showing that adoption is moving beyond a single AI team ([Lowe's, Aug. 3, 2026](https://corporate.lowes.com/newsroom/stories/fresh-thinking/ai-day-highlights-how-lowes-associates-are-putting-ai-work)).
- **Aug. 11, 2026 — URGENT:** Target announced that Lowe's SVP of data, AI, and innovation, Chandhu Nair, would leave to become Target's first chief AI officer on Aug. 24 ([CNBC, Aug. 11, 2026](https://www.cnbc.com/2026/08/11/target-appoints-chief-ai-officer-chandhu-nair.html)).
- **Aug. 19, 2026:** Lowe's moved its annual outlook to the low end of its prior range while saying Pro, online, and home services were offsetting softer discretionary DIY demand ([Lowe's, Aug. 19, 2026](https://corporate.lowes.com/newsroom/press-releases/lowes-reports-second-quarter-2026-sales-and-earnings-results)).
- **Sept. 1, 2026 — URGENT:** Five EVP appointments took effect. Godbole added AI to her information remit; Joseph McFarland moved to Pro and home services; Quonta Vance moved to stores; Adam Filipponi took strategy and business development; and Jennifer Wilson added digital commerce to marketing ([Lowe's 8-K, Sept. 2, 2026](https://www.sec.gov/Archives/edgar/data/60667/000006066726000119/low-20260828.htm)).

## 4. Where Factory lands

**Confidence: Partially sourced.**

| Pattern | Their specific estate | Evidence |
|---|---|---|
| SDLC / PDLC maintenance | Lowe's publicly recruits for Java/Spring Boot services; its GitHub organization exposes JVM audit tooling, a Kafka MirrorMaker lag exporter, a virtual-file-system library, and a Backstage fork. The scale, ownership, review queue, and age of the private repository fleet are **not public**. | [Lowe's Java/Spring Boot role, Sept. 25, 2025](https://talent.lowes.com/us/en/job/JR-02158555/Software-Engineer-Java-Spring-Boot); [Lowe's GitHub organization, undated, accessed Sept. 24, 2026](https://github.com/lowes) |
| Modernization / migration | Lowe's has used Google Cloud since 2018 to replace a legacy technology stack and build an engineering platform supporting Lowes.com and broader software delivery. Public reporting in 2025 said that transformation was still in progress. FBM integration adds a current, high-value boundary, but its applications and migration plan are not public. | [Google Cloud, Mar. 11, 2022, potentially stale](https://cloud.google.com/blog/topics/retail/how-google-cloud-services-helped-lowes-transform-ecommerce); [Diginomica, Apr. 9, 2025](https://diginomica.com/google-cloud-next-25-how-lowes-retail-re-invention-partnership-continues-evolve); [Lowe's, Oct. 9, 2025](https://corporate.lowes.com/newsroom/press-releases/lowes-completes-acquisition-foundation-building-materials) |
| Patching, vulnerabilities, risk | **Unsupported for a code or dependency backlog:** no public source identifies Lowe's CVE volume, patch SLA, dependency scanner, or remediation queue. The risk envelope is clear: Lowe's handles personal and payment-card information, runs a global security program under CISO Marc Varner, and uses ReliaQuest GreyMatter for security operations. | [2025 Form 10-K, filed Mar. 23, 2026](https://www.sec.gov/Archives/edgar/data/60667/000006066726000029/low-20260130.htm); [Marc Varner bio, undated, accessed Sept. 24, 2026](https://corporate.lowes.com/who-we-are/lowes-leadership/senior-leadership/marc-h-varner); [ReliaQuest customer story, Dec. 23, 2025](https://reliaquest.com/resources/customer-stories/lowes-accelerates-threat-detection-and-response-by-70/) |

## 5. Buying center

**Confidence: Partially sourced. Leadership titles are current as of the cited filing or access date.**

| Role | Person | Title and scope | Why them | Source |
|---|---|---|---|---|
| Economic buyer | Seemantini Godbole | EVP, chief information and AI officer; enterprise technology, engineering, product, data, analytics, innovation, and AI | Her newly enlarged remit spans the three Factory patterns and the platform choices that govern them. | [Lowe's 8-K, Sept. 2, 2026](https://www.sec.gov/Archives/edgar/data/60667/000006066726000119/low-20260828.htm); [Lowe's bio, undated, accessed Sept. 24, 2026](https://corporate.lowes.com/who-we-are/lowes-leadership/executive-leadership/seemantini-godbole) |
| Champion | Joseph M. McFarland III | EVP, Pro and home services | He has a new remit tied to the growth segment, FBM integration, and digital Pro workflows. A contained integration win is visible to both technology and revenue leaders. | [Lowe's 8-K, Sept. 2, 2026](https://www.sec.gov/Archives/edgar/data/60667/000006066726000119/low-20260828.htm) |
| Gatekeeper | Marc H. Varner | SVP, chief information security officer; global cybersecurity strategy and protection of Lowe's information assets and technology | He owns the security program and should define code-access, model-data, audit, and deployment controls before a pilot. | [Lowe's bio, undated, accessed Sept. 24, 2026](https://corporate.lowes.com/who-we-are/lowes-leadership/senior-leadership/marc-h-varner) |
| Practitioner | **Unknown by name** | Public Lowe's open-source maintainers and Java/Spring Boot engineers | Lowe's publishes repositories, but the public organization does not establish which maintainers still work there or who owns the target private systems. Do not guess. | [Lowe's GitHub organization, undated, accessed Sept. 24, 2026](https://github.com/lowes); [Lowe's software-engineering jobs, Sept. 25, 2025](https://talent.lowes.com/us/en/software-engineering-jobs) |

Juliette Pryor is a second gatekeeper for procurement, privacy, and enterprise-risk review because her remit includes legal, compliance, enterprise risk management, and privacy ([Lowe's bio, undated, accessed Sept. 24, 2026](https://corporate.lowes.com/who-we-are/lowes-leadership/executive-leadership/juliette-w-pryor)).

## 6. Competitive field

**Confidence: Partially sourced.**

Public incumbents are strong and multi-vendor:

- **Google Cloud** is the clearest platform incumbent. Lowe's uses its engineering platform and Google says Lowe's uses Vertex AI Vector Search and visual AI for ecommerce recommendations; Google also identified Lowe's as a Gemini Enterprise for Customer Experience user ([Google Cloud, Mar. 11, 2022, potentially stale](https://cloud.google.com/blog/topics/retail/how-google-cloud-services-helped-lowes-transform-ecommerce); [Google Cloud, Apr. 29, 2025](https://cloud.google.com/blog/topics/retail/how-vertex-ai-vector-search-helps-create-interactive-shopping-experiences); [Google Cloud, Jan. 11, 2026](https://cloud.google.com/transform/a-new-era-agentic-commerce-retail-ai)).
- **OpenAI** is a product-AI incumbent: Lowe's built Mylow and Mylow Companion with OpenAI ([Lowe's, May 5, 2025](https://corporate.lowes.com/newsroom/press-releases/lowes-deploys-first-scale-ai-assistant-retail-associates)).
- **NVIDIA Omniverse Enterprise** supports Lowe's store digital-twin work ([NVIDIA, Dec. 12, 2024](https://blogs.nvidia.com/blog/lowes-retail-digital-twins-omniverse/)).
- **Mirakl** supplies the marketplace platform, and **ReliaQuest GreyMatter** supports security operations ([Lowe's, May 21, 2025](https://corporate.lowes.com/newsroom/press-releases/lowes-accelerates-its-online-marketplace-announces-partnership-mirakl); [ReliaQuest, Dec. 23, 2025](https://reliaquest.com/resources/customer-stories/lowes-accelerates-threat-detection-and-response-by-70/)).

**What is not public.** Searches of Lowe's corporate news, careers pages, GitHub organization, engineering content, conference material, and job postings did not establish its enterprise coding assistant, source-code host for private repositories, CI/CD system, code-review queue, dependency scanner, application-security testing stack, model gateway, or AI procurement standard. Confirm these before positioning against GitHub Copilot, Gemini Code Assist, Amazon Q Developer, Cursor, or any other coding tool.

**Trade-offs.**

- **Integrations:** Google is better positioned where work already lives in Google Cloud and Vertex AI. OpenAI is better positioned where Lowe's has already built product experiences. Factory must prove compatibility with Lowe's actual repositories, tickets, CI, and cloud controls.
- **Security and deployment:** Existing vendors have approved relationships and known data paths. Factory must earn access with a read-only start, explicit retention boundaries, model and code-flow documentation, and Varner's controls.
- **Governance:** Lowe's already operates customer and associate AI. Factory should not sell another chatbot; it should show policy-bound software work with review evidence and named human owners.
- **Scalability:** Hyperscalers can bundle infrastructure, models, identity, and procurement. Factory's case must rest on measurable completion of multi-step engineering work across the tools Lowe's already owns, not on model access alone.

## 7. Reach plan

| Track | Persona | Opening | Asset | Ask |
|---|---|---|---|---|
| Technology / economic | Seemantini Godbole | “You have just added AI to an estate already spanning Google Cloud, digital commerce, store systems, and acquired Pro platforms. Where is engineering coordination now limiting the mandate?” | One-page map of a single workflow from ticket to reviewed change, with proposed controls and baseline measures | A 45-minute working session with the owner of one Java/Spring Boot or acquisition-integration backlog |
| Pro / champion | Joseph McFarland | “FBM and new Pro tools create a customer-facing integration deadline, not a generic productivity project.” | FBM integration discovery canvas covering one quote, catalog, credit, or fulfillment flow | Name one delayed integration and sponsor a bounded technical assessment with Godbole's team |
| Security | Marc Varner and Juliette Pryor | “Set the code, model, identity, logging, privacy, and retention boundaries before any repository is connected.” | Threat model, data-flow diagram, control matrix, and audit-evidence sample | A 30-minute pre-pilot control review and named security approver |
| Practitioner | Target service owner, name unknown | “Use your service, tests, standards, and review path; no synthetic demo.” | Read-only repository map plus a buyer-selected issue benchmark | Select one representative issue and agree acceptance tests, prohibited actions, and rollback |

**Timing.** Lowe's fiscal year ends on the Friday nearest Jan. 31; its fiscal 2025 year ended Jan. 30, 2026 ([2025 Form 10-K, filed Mar. 23, 2026](https://www.sec.gov/Archives/edgar/data/60667/000006066726000029/low-20260130.htm)). The company describes spring as its busy season ([Q1 2025 results, May 21, 2025](https://corporate.lowes.com/newsroom/press-releases/lowes-reports-first-quarter-2025-sales-and-earnings-results)). Use October for discovery and security review, then target a contained post-holiday, pre-spring pilot while fiscal-year planning is fresh. Lowe's had not published its third-quarter fiscal 2026 earnings date on its IR events page as of Sept. 24, 2026, and neither its budget-refresh dates nor code-freeze windows are public ([IR events page, undated, accessed Sept. 24, 2026](https://corporate.lowes.com/investors/news-events/events-presentations)). Ask for those dates before fixing the pilot calendar; do not assume a retail freeze applies to the target team.

## 8. First call

**Opener:** “You have put information technology and AI under one leader while integrating FBM and expanding Pro digital workflows. Rather than propose a broad developer rollout, we want to find one engineering backlog where an agent can complete bounded work under your existing review and security controls.”

**Three questions**

1. **Locate value:** Which named Pro, FBM, Lowes.com, or platform backlog is missing a business date because engineers spend too much time finding context, coordinating changes, or clearing review?
2. **Map the estate and incumbent:** Where do the relevant code, tickets, CI checks, dependency findings, and architecture standards live, and which coding assistants are already approved?
3. **Define the gate:** What would Marc Varner's team require for read-only discovery and then write access, including model routing, retention, secrets, audit logs, human approval, and rollback?

**Close:** Book a 60-minute scoping session with the target engineering director, a staff engineer who owns the service, a security architect from Varner's organization, and McFarland's product or operations owner. Leave with one repository or workflow, one buyer-owned baseline, acceptance tests, and a security-review date.

**Do not bring to call one:** an enterprise rollout proposal; unsourced engineering-headcount claims; a top-down savings model; a generic AI demo; claims that all three Factory patterns are proven; or competitive claims about an unconfirmed coding assistant.

## 9. Objections

| They say | You say |
|---|---|
| “We already use Google and OpenAI.” | “That is the expected architecture, not a disqualifier. The question is whether those tools complete governed engineering work across your repository, ticket, CI, and review systems. We will test one workflow and stop if the incumbent already does it well.” |
| “Security will not allow source code into another model.” | “Let security set the boundary first. Start read-only, document every data path and retention rule, prohibit secrets and production actions, and require human approval. If the approved deployment cannot meet those controls, do not proceed.” |
| “FBM integration is too important for a pilot.” | “Do not start on a critical cutover. Select a representative low-blast-radius issue with production-like standards, explicit acceptance tests, and rollback. The pilot should reduce uncertainty before touching the critical path.” |
| “We just reduced corporate roles; there is no capacity for another tool.” | “That is why the entry is one owned backlog and one measurement plan, not a rollout. If the tool adds setup or review work without completing accepted work, end the test.” |
| “Show enterprise ROI first.” | “First establish a defensible unit: time from an accepted issue to an approved change, including review and rework. Scale economics only after Lowe's supplies its own volume and cost inputs.” |

## 10. Unknowns and first-call questions

**Confidence: Sourced gaps; no assumptions substituted.**

| Unknown | What was searched | First-call question |
|---|---|---|
| Private source-code host, CI/CD, ticketing, and approved coding assistant | Lowe's careers pages, public GitHub organization, corporate technology stories, Google Cloud material, and recent job postings | “Which source, CI, ticket, and coding-assistant systems govern the target team today?” |
| FBM integration architecture, system owners, milestones, and decommission dates | Acquisition releases, annual report, earnings releases and transcript, leadership filing, and trade coverage | “Which FBM-to-Lowe's systems are being integrated or retired, who owns them, and what dates matter?” |
| Repository count, engineering headcount, review capacity, and onboarding time | Annual report, careers sites in the U.S. and India, public GitHub, engineering content, and leadership biographies | “For the proposed scope, how many repositories and engineers are involved, and where do review or context delays show up?” |
| CVE and dependency backlog, patch SLA, and AppSec toolchain | Annual report cybersecurity disclosures, CISO material, information-security jobs, vendor case studies, and breach notices | “What queues and service levels govern dependency, SAST, DAST, secrets, and cloud findings?” |
| AI governance and model-routing standard after the September reorganization | Sept. 2 8-K, leadership pages, AI Day stories, OpenAI, Google Cloud, NVIDIA, and security material | “Who now approves AI use cases, models, data classes, and production deployment under Godbole's expanded remit?” |
| Named practitioner champions on the target systems | Public GitHub repositories, Lowe's India tech blog, conference searches, corporate stories, and job postings | “Which staff or principal engineers publish internally and can validate the pilot upward?” |
| Budget owner, procurement route, budget refresh, next earnings date, and code-freeze windows | IR events, annual report, fiscal calendar, procurement-facing pages, earnings releases, and public web searches | “Which budget and procurement path applies, and what planning, earnings, peak-season, or freeze dates constrain a decision?” |
| Material cybersecurity incidents and their remediation relevance | SEC and corporate annual reports, state breach-notice portals, named security reporting, and CISO material | “Which recent incident classes or audit findings should the pilot's controls and evidence explicitly address?” |

### Top three unknowns

1. The specific FBM or Pro integration backlog, systems, owner, and deadline.
2. The private SDLC stack and incumbent coding assistant, including source control, tickets, CI/CD, review, and security scanning.
3. The security and AI-governance conditions for repository access, model routing, data retention, audit evidence, and human approval.

## Sources

1. Lowe's, “Lowe's Reports Second Quarter 2026 Sales and Earnings Results,” Aug. 19, 2026: https://corporate.lowes.com/newsroom/press-releases/lowes-reports-second-quarter-2026-sales-and-earnings-results
2. Lowe's Companies, 2026 proxy statement, Apr. 16, 2026: https://www.sec.gov/Archives/edgar/data/60667/000006066726000056/a2026lowescompaniesinc.htm
3. Lowe's Companies, fiscal 2025 Form 10-K, filed Mar. 23, 2026: https://www.sec.gov/Archives/edgar/data/60667/000006066726000029/low-20260130.htm
4. Lowe's, “Lowe's Completes Acquisition of Foundation Building Materials,” Oct. 9, 2025: https://corporate.lowes.com/newsroom/press-releases/lowes-completes-acquisition-foundation-building-materials
5. Reuters, “Lowe's cuts 600 corporate and support roles to focus on store employees,” Feb. 13, 2026: https://www.reuters.com/business/lowes-cuts-600-corporate-support-roles-wsj-reports-2026-02-13/
6. Lowe's, “Lowe's Strengthens Pro Experience for Small to Medium-Size Pro,” Feb. 17, 2026: https://corporate.lowes.com/newsroom/press-releases/lowes-strengthens-pro-experience-small-medium-size-pro
7. Lowe's, “Lowe's Boosts Pro Efficiency with AI-Driven Material Lists,” May 21, 2026: https://corporate.lowes.com/newsroom/press-releases/lowes-boosts-pro-efficiency-ai-driven-material-lists-new-tool-delivers-product-quotes-minutes
8. Lowe's, “AI Day Highlights How Lowe's Associates are Putting AI to Work,” Aug. 3, 2026: https://corporate.lowes.com/newsroom/stories/fresh-thinking/ai-day-highlights-how-lowes-associates-are-putting-ai-work
9. CNBC, “Target appoints chief AI officer Chandhu Nair,” Aug. 11, 2026: https://www.cnbc.com/2026/08/11/target-appoints-chief-ai-officer-chandhu-nair.html
10. Lowe's Companies, Form 8-K, Sept. 2, 2026: https://www.sec.gov/Archives/edgar/data/60667/000006066726000119/low-20260828.htm
11. Lowe's, Seemantini Godbole biography, undated; accessed Sept. 24, 2026: https://corporate.lowes.com/who-we-are/lowes-leadership/executive-leadership/seemantini-godbole
12. Google Cloud, “How Google Cloud services helped Lowe's transform ecommerce,” Mar. 11, 2022, potentially stale: https://cloud.google.com/blog/topics/retail/how-google-cloud-services-helped-lowes-transform-ecommerce
13. Diginomica, “Google Cloud Next 25 — how Lowe's retail re-invention partnership continues to evolve,” Apr. 9, 2025: https://diginomica.com/google-cloud-next-25-how-lowes-retail-re-invention-partnership-continues-evolve
14. Lowe's Careers, Java/Spring Boot software engineer posting, Sept. 25, 2025: https://talent.lowes.com/us/en/job/JR-02158555/Software-Engineer-Java-Spring-Boot
15. Lowe's GitHub organization, undated; accessed Sept. 24, 2026: https://github.com/lowes
16. Lowe's Careers, software engineering jobs, Sept. 25, 2025: https://talent.lowes.com/us/en/software-engineering-jobs
17. Lowe's, Marc H. Varner biography, undated; accessed Sept. 24, 2026: https://corporate.lowes.com/who-we-are/lowes-leadership/senior-leadership/marc-h-varner
18. Lowe's, Juliette W. Pryor biography, undated; accessed Sept. 24, 2026: https://corporate.lowes.com/who-we-are/lowes-leadership/executive-leadership/juliette-w-pryor
19. ReliaQuest, “Lowe's Accelerates Threat Detection and Response by 70%,” Dec. 23, 2025: https://reliaquest.com/resources/customer-stories/lowes-accelerates-threat-detection-and-response-by-70/
20. Google Cloud, “How Vertex AI Vector Search helps create interactive shopping experiences,” Apr. 29, 2025: https://cloud.google.com/blog/topics/retail/how-vertex-ai-vector-search-helps-create-interactive-shopping-experiences
21. Google Cloud, “A new era of agentic commerce is here,” Jan. 11, 2026: https://cloud.google.com/transform/a-new-era-agentic-commerce-retail-ai
22. Lowe's, “Lowe's Deploys First At-Scale AI Assistant for Retail Associates,” May 5, 2025: https://corporate.lowes.com/newsroom/press-releases/lowes-deploys-first-scale-ai-assistant-retail-associates
23. NVIDIA, “Reinventing Retail: Lowe's Teams With NVIDIA and Magic Leap,” Dec. 12, 2024: https://blogs.nvidia.com/blog/lowes-retail-digital-twins-omniverse/
24. Lowe's, “Lowe's Accelerates Its Online Marketplace, Announces Partnership With Mirakl,” May 21, 2025: https://corporate.lowes.com/newsroom/press-releases/lowes-accelerates-its-online-marketplace-announces-partnership-mirakl
25. Lowe's, “Lowe's Reports First Quarter 2025 Sales and Earnings Results,” May 21, 2025: https://corporate.lowes.com/newsroom/press-releases/lowes-reports-first-quarter-2025-sales-and-earnings-results
26. Lowe's investor relations, events and presentations, undated; accessed Sept. 24, 2026: https://corporate.lowes.com/investors/news-events/events-presentations
