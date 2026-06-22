# CampusFound — Stakeholder Rebuttals

**Purpose:** Prepare for realistic pushback in a 60-minute meeting with the Dean of Students, Campus Safety, Residential Life, and Student Activities.

**Source:** Red-team review + actual pilot product scope. Focuses on questions these offices **actually ask**, not worst-case hypotheticals.

**How to use:** Read the 30-second answer first in discussion. Use the 2-minute answer if the room stays skeptical. Check **What not to say** before you improvise.

---

## Quick reference — answer types

| Type | Meaning |
|------|---------|
| **Current capability** | Built and working in CampusFound today |
| **Current process** | Existing Luther office practice; platform does not change it |
| **Future enhancement** | Honest roadmap; not promised for pilot |
| **Pilot policy decision** | Stakeholders choose this before or during pilot |

---

## 1. “What exactly are you asking us to approve?”

**Likely askers:** Dean of Students · Student Life

### The concern behind the question
They need to know scope of commitment — policy endorsement, staff time, reputational association, and whether this becomes an official college system.

### 30-second answer
“I’m asking for a **limited pilot endorsement**, not a campus-wide mandate: one webpage link, **one or two named staff moderators**, and agreement on how we’ll evaluate success in eight to ten weeks. I’ll run the technology; you set the operational rules.”

### 2-minute answer
“This isn’t procurement or a multi-year platform decision. The ask is deliberately small:

1. **Endorse a time-bounded pilot** — fall semester or eight to ten weeks — framed as an experiment.
2. **One link** from Student Life or lost-and-found communications, with language that makes clear this supplements — not replaces — existing offices.
3. **Name a primary and backup moderator** — likely Campus Safety or Union lost-and-found, with Res Life optional for hall-related items.
4. **One follow-up meeting** to review metrics and decide continue, adjust, or sunset.

I operate hosting and fixes during the pilot. Luther contributes oversight, moderation, and honest feedback. If the pilot doesn’t show value, we stop — no sunk-cost pressure.”

### What not to say
- “We just need your blessing” — sounds vague and avoids accountability.
- “This will become Luther’s official lost-and-found system” — overclaims before pilot proof.
- “There’s basically no ask” — insults their intelligence; there is staff and reputational cost.

### Answer type
**Pilot policy decision** (endorsement scope, link placement, moderator names)

---

## 2. “How much staff time will this really take?”

**Likely askers:** Residential Life · Dean of Students · Student Activities

### The concern behind the question
Res Life and Student Life are stretched thin. “Light moderation” often becomes unpaid permanent work once a `.edu` link goes live.

### 30-second answer
“At pilot scale — dozens of listings, not hundreds — budget **about thirty minutes per week** for a primary moderator: check the dashboard, resolve any reports, skim new posts. If reports or volume spike, we **pause expansion** and reassess. I’ll track workload monthly with you.”

### 2-minute answer
“Moderation today is a simple dashboard: view listings, remove or restore, resolve student reports, and see a basic activity log. There’s no queue of messages to answer in the software.

For planning, I suggest:

- **Primary moderator:** ~30 min/week if traffic stays under roughly fifty active listings and fewer than five reports per week.
- **Backup moderator:** Campus Safety or a second Student Life contact for vacations.
- **Optional:** brief weekly glance at stats — five minutes — not a standing meeting unless you want one.

We agree upfront on **tripwires**: if moderation exceeds one hour per week for three consecutive weeks, or unresolved reports sit longer than forty-eight hours, we narrow scope — for example staff-only posting or a single-building pilot.

That keeps the burden visible and bounded. You’re not signing up for a hidden second job.”

### What not to say
- “Basically zero work” — false once you’re linked from a college page.
- “The system moderates itself” — it doesn’t; humans remove content.
- “RAs can handle it” — pushes labor to Res Life without their consent.

### Answer type
**Current capability** (dashboard exists) + **Pilot policy decision** (time budget, tripwires, who moderates)

---

## 3. “What happens when something inappropriate gets posted?”

**Likely askers:** Campus Safety · Dean of Students

### The concern behind the question
They need a credible response path — speed, responsibility, and whether the college is exposed while content is live.

### 30-second answer
“Anyone can **report a listing** from the item page. Staff **remove it from the admin dashboard**; actions are logged. Listings also **expire after sixty days**. For pilot launch, I recommend we start with **staff posting only** or a clear **business-hours removal expectation** — and Campus Safety as escalation contact on `/about`.”

### 2-minute answer
“Today the flow is post-publish, not pre-approve. That’s a real limitation I don’t minimize.

**What exists now:**
- User **report** button on every listing (spam, personal info, etc.).
- Staff **remove / restore** in admin, with a **moderation activity log**.
- **Rate limits** on uploads and reports to reduce flooding.
- Published **terms, privacy, and about** pages with posting guidelines.

**What I recommend for Luther’s pilot — policy, not code:**
- **Phase 1:** only designated staff post found items; students browse only. That removes most abuse risk while we prove value.
- **Phase 2:** open student uploads only if Safety and Student Life are comfortable.
- **SLA:** PII or harassment reports triaged within **four business hours**; other reports within forty-eight hours.
- **Escalation:** moderation contact on the site; serious incidents follow existing Safety protocols.

I won’t ask for a prominent public link until we agree which phase we’re in and who owns takedown.”

### What not to say
- “That won’t happen on our campus” — dismissive.
- “We have AI that catches bad content” — not true.
- “It comes down instantly automatically” — removal requires staff action today.

### Answer type
**Current capability** (report, remove, log, expiry) + **Pilot policy decision** (staff-only phase, SLAs, escalation)

---

## 4. “Why can anyone post without a Luther login?”

**Likely askers:** Campus Safety · Dean of Students

### The concern behind the question
Anonymous upload means no accountability, no proof of campus affiliation, and harder investigations if someone misuses the board.

### 30-second answer
“Anonymous upload lowers the barrier to post found items, but I agree it’s **not the safest default** for an endorsed pilot. My recommendation is **staff-only posting for phase one**; students browse without logging in. Luther SSO for uploads is a **future enhancement** if we expand.”

### 2-minute answer
“The product *can* accept uploads without an account — that’s a current capability. Whether we *use* that in Luther’s pilot is a policy decision.

**Trade-off:**
- **Open upload:** faster adoption, higher abuse risk, harder accountability.
- **Staff-mediated upload:** Safety, Union, or Res Life desks post what they already intake — lower risk, aligns with how high-value items are already handled.

For a Dean-linked pilot, I’d start staff-mediated. Students still benefit: **searchable photos**, **building filters**, and **one URL to check**.

If phase one works, we can discuss Luther login for uploads — that’s not built today, but it’s the right long-term trust layer. I’m not asking you to accept anonymous campus-wide posting as a condition of the pilot.”

### What not to say
- “Anonymous is safer because privacy” — Safety will disagree.
- “Luther login is already built” — false for student users.
- “Rate limiting solves this” — weak alone; they may know serverless limits aren’t ironclad.

### Answer type
**Current capability** (anonymous upload exists) + **Pilot policy decision** (staff-only vs open) + **Future enhancement** (Luther SSO)

---

## 5. “If we link from a Luther webpage, are we liable for what’s on there?”

**Likely askers:** Dean of Students · Student Life

### The concern behind the question
An `.edu` link reads as endorsement. Counsel, parents, and media will treat linked tools as college-affiliated.

### 30-second answer
“CampusFound is a **listing board**, not a custodian of property — **physical items and release decisions stay with your offices**, same as today. I recommend **counsel review** of our terms and privacy pages before any link, and link text that says **‘pilot community tool’** rather than ‘official lost-and-found system of record.’”

### 2-minute answer
“Linking creates association; I take that seriously.

**What the platform is:** a place to **advertise** that a found item exists — photo, building, where to inquire. It does **not** take custody, verify ownership, or guarantee accuracy.

**What stays unchanged:** your written lost-and-found practices, sign-in sheets, ID checks, and Safety procedures.

**What I propose before a link goes live:**
1. **Brief counsel review** of `/terms` and `/privacy` — not full RFP, but a sanity check.
2. **Clear link language**, e.g. ‘Student-led pilot — check Union and Campus Safety for all found property.’
3. **Named staff sponsor** on the Student Life side so there’s an ongoing college owner, not just a student project.

I’m not asking Luther to absorb open-ended liability. I’m asking for a **bounded pilot** with honest labeling. If counsel prefers linking to a Student Life news post *about* the pilot instead of the app directly, I’ll accept that.”

### What not to say
- “There’s no liability because it’s a student project” — counsel may disagree once the college links.
- “Terms of service cover everything” — yours are minimal; don’t oversell.
- “Other schools do this” — irrelevant to Luther’s risk tolerance.

### Answer type
**Current process** (custody/release unchanged) + **Pilot policy decision** (link language, counsel review, sponsor)

---

## 6. “What happens when you graduate?”

**Likely askers:** Dean of Students · Student Life

### The concern behind the question
They’ve seen student projects die at graduation. They won’t invest process change without a succession plan.

### 30-second answer
“Fair question — **no pilot without a named staff sponsor** and a handoff plan. I document operations in a runbook, transfer admin access to permanent staff, and Luther decides at end of semester: **continue, transfer hosting to IT, or sunset** with data export. I won’t ask for a fall link without that sponsor named.”

### 2-minute answer
“Sustainability is a valid reason to say no. Here’s what I propose:

**Before launch:**
- **Staff sponsor** identified — e.g. Director of Student Life or a Campus Safety designee.
- **Two admin accounts** on Luther emails, not mine alone.
- **Knowledge transfer session** (~45 minutes): remove listing, resolve report, read stats.
- **Written runbook** already exists for deploy, moderation, and incident basics.

**Before I graduate:**
- Transfer Vercel/Supabase project access to sponsor or IT, or **planned sunset**.
- **Continuation decision** at week eight to ten — not an automatic renewal.

**If Luther continues:** modest hosting cost (often tens of dollars monthly at pilot scale) or IT absorbs it. **If not:** export listings data, remove the link, done cleanly.

The pilot is designed to **fail closed** — if there’s no owner, we don’t continue.”

### What not to say
- “Someone else will probably pick it up” — hand-waving.
- “It’s open source so IT can figure it out” — disrespectful to IT.
- “That’s a problem for later” — exactly what they fear.

### Answer type
**Pilot policy decision** (sponsor, handoff, continue/sunset) + **Current capability** (runbook, staff admin accounts)

---

## 7. “How does a student actually get their item back?”

**Likely askers:** Campus Safety · Residential Life · Student Activities

### The concern behind the question
They need to know the platform doesn’t create peer-to-peer handoffs, desk bypass, or false confidence that clicking equals claiming.

### 30-second answer
“CampusFound doesn’t mail items or confirm identity in the app. A student **finds the listing**, goes to the **office or desk listed** — Union, Campus Safety, Res Life — and **claims in person** using **your existing verification**. The platform only makes the item easier to discover.”

### 2-minute answer
“End-to-end flow:

1. Staff or finder posts a **found item** with photo and location metadata.
2. Owner **browses or searches** by building or keyword.
3. Owner goes to the **physical location** on the listing — lost-and-found desk, campus safety, etc.
4. **Your staff** verify ownership — ID, describe case, serial, contents — and release per **current policy**.

CampusFound does not:
- Hold items
- Approve claims in software
- Facilitate dorm-room meetups (and I don’t recommend ‘other’ locations for peer exchange in pilot)

For Res Life: hall desk items can be posted with **location type** pointing students to that desk — physical custody stays in the hall. For Safety: high-value items stay in your safe; the listing can say ‘phone turned in — inquire at Campus Safety’ without showing the lock screen.”

### What not to say
- “They connect through the app” — messaging isn’t built.
- “The platform verifies ownership” — false.
- “Students arrange pickup themselves” — Safety and Res Life will push back.

### Answer type
**Current process** (in-person verification, office custody) + **Current capability** (listing shows where to go)

---

## 8. “Why not just use a Google Form or our current process?”

**Likely askers:** Dean of Students · Student Activities

### The concern behind the question
They need justification for change cost. Google Form is free, familiar, and doesn’t need a student developer.

### 30-second answer
“A Form works for intake — CampusFound is better for **discovery**: **searchable photos**, **building filters**, and **one browseable board** students can check without emailing. The pilot tests whether that actually produces **more reunions** than today — if not, you should kill it.”

### 2-minute answer
“I’m not claiming software always beats a Form.

**Where a Form is fine:** logging what an office received, internal record-keeping.

**Where CampusFound adds value:**
- **Student-facing browse** — see recent items without submitting a form or waiting for email.
- **Photo + building + location type** — ‘blue backpack in Preus’ is easier to scan visually than a spreadsheet row.
- **Moderation tools** — remove listings, handle reports, audit log — not native to a Form.
- **Multi-office visibility** — one board Safety, Union, and Res Life can all post to.

**The pilot’s job** is to measure whether those benefits matter at Luther: reunions documented, traffic, cross-office posting, staff feedback. If a Form plus a weekly email works better, I’ll tell you to stick with that. I’m asking for eight weeks to **compare**, not forever.”

### What not to say
- “Google Forms are terrible” — defensive.
- “Every campus needs an app” — generic.
- “This replaces your process” — triggers resistance.

### Answer type
**Current capability** (browse, search, photos, moderation) + **Pilot policy decision** (success = prove vs Form/status quo)

---

## 9. “Won’t students think everything lost is online — and give up on checking our desk?”

**Likely askers:** Student Life · Residential Life · Campus Safety

### The concern behind the question
Partial adoption can **worsen** outcomes: false completeness, desks still get walk-ins, students stop checking physical locations.

### 30-second answer
“That’s a real risk. Communications must say **‘Not all items are listed — always check Union and Campus Safety.’** Pilot success includes **what share of desk intakes get posted** — if it’s too low, we don’t expand. The link should **supplement** desks, not imply they’re obsolete.”

### 2-minute answer
“I’d rather you raise this than ignore it.

**Mitigations — mostly policy and communications:**
- **Link and poster language:** ‘Check offices **and** this board.’
- **Staff habit:** desks post intakes within 24 hours when participating — so the board reflects reality.
- **Metric:** track **cross-post rate** from Union/Safety — if only five percent of intakes appear online, students are right to distrust completeness; we fix posting workflow or stop.

**Pilot scope control:** start with **two or three participating locations**, not ‘everything is on CampusFound.’ Res Life halls opt in explicitly.

False completeness is a **kill criterion**, not something I’ll hand-wave. Student Life owning the comms message is as important as the software.”

### What not to say
- “Once we launch, everyone will use it” — unrealistic.
- “Students are digital natives — they’ll figure it out” — condescending.
- “That won’t be a problem” — denies their operational experience.

### Answer type
**Pilot policy decision** (messaging, cross-post metric, opt-in offices)

---

## 10. “Does this replace our sign-in sheet / physical lost-and-found log?”

**Likely askers:** Residential Life · Campus Safety

### The concern behind the question
They have audit trails, retention rules, and sometimes legal requirements for physical property logs. Duplication or replacement creates compliance gaps.

### 30-second answer
“**No.** Your physical log remains the **system of record**. CampusFound is a **public-facing index** — optional copy of what you already logged. Desks keep doing sign-in exactly as today; posting to the board is an extra step, not a substitute.”

### 2-minute answer
“I designed this assuming your log wins.

**Physical log:** authoritative for chain of custody, retention, disposal timelines, and audits.

**CampusFound:** helps students **find** that an item may exist — marketing layer, not legal record.

Workflow I suggest: item turned in → logged at desk as today → **optional** photo post to CampusFound within twenty-four hours. If posting is too burdensome, we narrow to **one office** (e.g. Union only) for the pilot.

If Res Life or Safety policy says certain items **must not** be photographed, we respect that — listing can be text-only location: ‘Item turned in — inquire at desk.’”

### What not to say
- “You won’t need the log anymore” — immediate no from Safety.
- “The moderation log replaces your audit trail” — it doesn’t for physical property.
- “Digital is always better” — ignores their compliance reality.

### Answer type
**Current process** (physical log authoritative) + **Pilot policy decision** (optional cross-post workflow)

---

## 11. “Can Campus Safety and Residential Life both have admin access?”

**Likely askers:** Campus Safety · Residential Life

### The concern behind the question
They want operational control in their lane — remove bad posts, manage hall-related listings — without bottlenecking through one Student Life person.

### 30-second answer
“**Yes.** Multiple staff can have moderator accounts with Luther email login. Actions are tied to those accounts in the moderation log. We’d agree who is **primary**, who is **backup**, and when Res Life posts vs when Safety posts.”

### 2-minute answer
“Admin access is role-based today — authorized `@luther.edu` emails in the admin user list. Campus Safety, Union, and Res Life can all have access.

**I’d suggest clarifying lanes:**
- **Campus Safety:** high-value items, policy questions, escalation takedowns.
- **Union / Student Life:** central lost-and-found postings.
- **Res Life:** hall desk items — only if Res Life wants RAs or hall coordinators posting.

Everyone with access can remove listings and resolve reports. The **activity log** shows what happened, though we should align on whether actor email is always visible for accountability — I use named staff login, not shared passwords, in production.

Thirty-minute training for anyone with access; no one goes live solo.”

### What not to say
- “Just use my shared password” — audit and Security nightmare.
- “Only I need admin” — defeats sustainability and trust.
- “Unlimited admins with no coordination” — invite chaos; propose lanes instead.

### Answer type
**Current capability** (multi-admin, email login, activity log) + **Pilot policy decision** (lanes, primary/backup)

---

## 12. “What student data do you collect? Is this a FERPA issue?”

**Likely askers:** Dean of Students · Student Life

### The concern behind the question
Any new system touching students triggers privacy review — FERPA, marketing of data practices, incident response.

### 30-second answer
“**No student accounts** in the pilot — no grades, schedules, or directory data. We store **listing content** users choose to upload — photo, building, location fields — plus basic timestamps. Reports use a **hashed IP** only to prevent duplicate spam. I’ll update the privacy page for analytics and welcome **a quick IT/privacy review** before launch.”

### 2-minute answer
“FERPA risk is low but not zero — because **user-generated photos** could include an ID if someone ignores guidelines.

**What we store:**
- Listing: image, building, location metadata, optional description, created/expiry dates.
- Reports: reason, optional details, hashed reporter IP — not published.
- Optional analytics: anonymous usage events if PostHog is enabled — should be disclosed on `/privacy`.

**What we don’t store:**
- Student login profiles, educational records, or contact info for browsers.

**Risk mitigation:**
- Posting guidelines: **no IDs, cards, or sensitive PII** in photos.
- Staff posting SOP: photograph item, not documents.
- Rapid takedown if PII appears.

I recommend Luther’s privacy officer or IT spend **thirty minutes** on a data-flow review before a `.edu` link. I’m not asking to skip that.”

### What not to say
- “FERPA doesn’t apply to anything ever” — too absolute.
- “We don’t collect any data” — false; images are data.
- “Privacy policy is fine as-is forever” — PostHog/subprocessors may need disclosure updates.

### Answer type
**Current capability** (minimal data model, no accounts) + **Pilot policy decision** (IT/privacy review, posting SOP) + **Future enhancement** (full privacy page updates for all subprocessors)

---

## 13. “What does this cost — and does IT need to be involved?”

**Likely askers:** Dean of Students · Student Life

### The concern behind the question
Hidden costs (staff time, IT security review, hosting after free tier) and whether this bypasses governance.

### 30-second answer
“**No software licensing fee** for the pilot — hosting on standard cloud free/low tiers. **No Luther servers required.** IT involvement should be **light**: optional security/privacy review and, if you continue, **project handoff**. Staff time is the real cost — about thirty minutes a week at modest scale.”

### 2-minute answer
“Breakdown:

| Cost | Pilot expectation |
|------|-------------------|
| **License** | $0 — student-built, open stack |
| **Hosting** | $0–$25/month at pilot scale; alert if usage grows |
| **Luther IT** | Not required to host; **recommended** for thirty-minute data review and graduation handoff |
| **Staff** | Primary moderator ~30 min/week — the meaningful cost |

I’m **not** bypassing governance on purpose. I’ll go through whatever **lightweight path** Student Life and IT prefer for a pilot tool — whether that’s informal review or a short security checklist.

If the college continues after pilot, budget a small annual hosting line or fold into IT — that’s a decision **after** proof of value, not a prerequisite today.”

### What not to say
- “Completely free in every way” — ignores staff time and future hosting.
- “IT isn’t your business” — alienates a key ally.
- “We’ll never need IT” — handoff requires them if this continues.

### Answer type
**Current capability** (external hosting, no Luther infra) + **Pilot policy decision** (IT review path, hosting owner if continued)

---

## 14. “How will we know if the pilot succeeded?”

**Likely askers:** Dean of Students · Student Activities

### The concern behind the question
They won’t endorse without measurable outcomes and a defined stop/continue rule.

### 30-second answer
“Agree upfront on **five measures**: active listings, browse traffic, **documented reunions** (simple office log), reports resolved within forty-eight hours, and **staff feedback** at week six. If reunions and cross-posting are weak, we **sunset** — success is proof of value, not vanity metrics.”

### 2-minute answer
“Proposed scorecard — we can edit in this room:

1. **Listings** — growth and diversity across buildings/offices (not one hall only).
2. **Browse traffic** — are students actually looking?
3. **Documented reunions** — qualitative but essential; Safety or Union logs ‘matched via CampusFound.’ Target: e.g. **five or more** stories in eight weeks, or whatever you set.
4. **Moderation health** — reports resolved within forty-eight hours; no sustained overload.
5. **Staff survey** — week six: ‘Worth continuing?’ from moderators and desk staff.

**Continue if:** reunions or clear time savings for staff, acceptable moderation load, sponsor willing to own.

**Stop or narrow if:** low cross-post rate, false-complete student confusion, moderation overload, or no staff owner.

I’ll deliver a **one-page summary at thirty days** so we’re not waiting until finals.”

### What not to say
- “We’ll know it when we see it” — no accountability.
- “Thousands of users” — wrong bar for Luther pilot.
- “Success is guaranteed” — they’ve heard that before.

### Answer type
**Pilot policy decision** (metrics, thresholds, continue/stop rules) + **Current capability** (admin stats, reports queue for moderation metrics)

---

## 15. “What about student IDs, wallets, and phones in photos?”

**Likely askers:** Campus Safety · Dean of Students · Residential Life

### The concern behind the question
Posting found IDs or lock screens creates identity theft risk, embarrassment, and cleanup burden — especially with **public image URLs** in the current build.

### 30-second answer
“**Policy first:** offices hold IDs and high-value items; listings say **where to inquire**, not show the ID. **Guidelines** on the site prohibit document photos. Staff training: **photo the item, not the wallet contents**. If PII is posted, moderators **remove immediately** — I target **four business hours** for that class of report.”

### 2-minute answer
“This is one of my highest-priority concerns too.

**Pilot SOP — process:**
- **IDs, cards, passports:** never photographed; post ‘ID card turned in — visit Campus Safety.’
- **Phones:** back of device or case only; phone stays in Safe.
- **Wallets:** without visible cards or cash display.

**Platform today:**
- `/privacy` and `/about` state what not to post.
- Anyone can **report**; staff **remove** listings.
- Listings **expire** at sixty days.

**Honest limitation:** images are **publicly accessible URLs** in the current configuration — so **prevention beats takedown**. That’s why I strongly favor **staff-only posting** at launch and Safety-approved training.

**Future enhancement:** signed image URLs and stricter storage — not required to start if policy is staff-mediated and conservative.

I won’t argue that ‘guidelines are enough’ for open anonymous upload of IDs — they aren’t.”

### What not to say
- “Students won’t post IDs” — they will, accidentally or not.
- “Blur technology handles it” — not built.
- “Removed means gone from the internet instantly” — cached URLs may linger; be honest.

### Answer type
**Current process** (office holds sensitive items, SOP) + **Current capability** (guidelines, report, remove, expiry) + **Pilot policy decision** (staff-only posting, removal SLA) + **Future enhancement** (signed URLs, storage hardening)

---

## Meeting strategy (60 minutes)

| Segment | Time | Focus |
|---------|------|--------|
| Presentation | 7–10 min | Problem → pilot scope → ask |
| Safety / Dean concerns | 15–20 min | Questions **3, 4, 5, 7, 12, 15** likely dominate |
| Res Life / Student Life operations | 15–20 min | Questions **2, 9, 10, 11** |
| Decision & next steps | 10–15 min | Questions **1, 6, 13, 14** |

**If the room turns hostile:** lead with **staff-only phase one**, **named sponsor**, **counsel review**, and **written sunset criteria** — concede product limits before they have to extract them.

**If the room is warm:** don’t over-promise — lock pilot policy decisions in writing before the link goes live.

---

*Related: red-team analysis (conversation) · `docs/STAKEHOLDER_QA.md` · `docs/STAKEHOLDER_GOOGLE_SLIDES.md` · `docs/DEMO_READINESS.md`*
