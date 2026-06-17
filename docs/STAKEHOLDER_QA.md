# CampusFound — Stakeholder Q&A (Luther College Pilot)

Use this document to prepare for administrator questions. Answers reflect the **current pilot build**, with honest notes where process or future work fills the gap.

---

## Ownership & returns

### How do you verify ownership?

**Pilot answer:** CampusFound does **not** automate ownership verification. Luther’s existing practices apply: the student goes to the listed location (lost & found desk, campus safety, etc.), describes the item, and staff verify ownership (ID, distinctive marks, serial numbers, case details) before release.

**Platform role:** Makes the item **discoverable** — photo, building, location type, optional description — so the right person can find it and initiate an in-person claim.

**Future:** Optional “claim request” workflow with staff approval; not in pilot scope.

### What happens if someone falsely claims an item?

**Pilot answer:** Physical custody stays with the **holding office**, not the platform. Staff already gate release; CampusFound does not change that control.

If abuse appears on the platform (harassment, misleading posts), any user can **report a listing**; moderators **remove** it and document the action in the moderation log.

### Who holds high-value items (phones, wallets, IDs)?

**Recommended policy:** Offices hold sensitive/high-value items; listings show **where to inquire**, not full item details or owner information. Posting guidelines on `/privacy` and `/about` discourage IDs and card numbers in photos.

---

## Moderation & administration

### Who moderates content?

**Pilot:** 1–2 designated **staff moderators** with Luther email accounts in the `admin_users` table. They access `/admin` to:

- Remove or restore listings  
- Review and resolve **user reports**  
- View **moderation activity** and dashboard stats  

A **moderation contact** (`NEXT_PUBLIC_MODERATION_CONTACT`) is published on `/about` for takedown requests.

### How are inappropriate listings removed?

1. **User report** — any visitor can report a listing (spam, personal info, etc.).  
2. **Staff action** — moderators remove listings from the admin dashboard.  
3. **Automatic expiry** — active listings expire after **60 days** (daily job marks expired items removed).  
4. **Rate limits** — reduce spam uploads and report flooding.

All report status changes and many listing actions create **moderation events** for accountability.

### Can Campus Safety have administrative privileges?

**Yes.** Add their Luther email to `admin_users` with role `moderator` or `admin`. Multiple departments can share moderation; clarify internally who is primary vs. backup.

### Can Residential Life participate?

**Yes.** Same model — authorized staff accounts and coordination on which buildings/areas they promote. Res Life can encourage RAs to post items turned in at desks **if** that fits office policy.

### What is the administrative workload?

At pilot scale (dozens of listings, not thousands): typically **minutes per week** — reviewing reports, occasional removal, checking stats. Not a full-time role.

---

## Cost & sustainability

### What does it cost Luther?

**Pilot:** **$0 software licensing.** Infrastructure uses free/low tiers (Vercel, Supabase). No Luther servers required for pilot.

Costs to watch if usage grows: hosted database/storage bandwidth, optional analytics (PostHog). Still modest compared to enterprise software.

### Who maintains the platform after the student developer graduates?

**Pilot phase:** Student operator maintains deployment with documented runbooks (`docs/OPS_RUNBOOK.md`, `docs/CAMPUS_ONBOARDING.md`).

**Transition options (discuss with IT):**

- Transfer Vercel/Supabase project ownership to Luther IT or a staff sponsor  
- Hand admin accounts to permanent staff only  
- Open-source codebase remains documentable for future student or vendor support  

**Stakeholder message:** Pilot is **time-bounded**; continuation decision is explicit at end of semester.

---

## Privacy, safety & liability

### How is user data handled?

**Pilot — minimal data collection:**

- **No student accounts** required to browse or upload.  
- Stored: listing image, building, location metadata, optional text, timestamps.  
- Reports store reason/details; reporter identified by hashed IP for duplicate prevention (not published).  
- Analytics (optional PostHog): anonymous usage events.

See `/privacy` and `/terms` for user-facing language.

### Are photos public?

**Pilot default:** Images use **public storage URLs** for simplicity. Guidance discourages posting sensitive content. **Future:** signed/private image URLs (`SUPABASE_STORAGE_MODE=signed`) for stricter control.

### Liability concerns?

CampusFound is a **listing board**, not a custodian of property. Physical items remain under existing office policies. Terms state community use and moderation rights.

**Recommendation:** Luther counsel reviews `/terms` and `/privacy` before wide promotion (light review, not full procurement).

### Is this FERPA-related?

Generally **no** for pilot scope — no educational records in the system. Avoid posting grades, student IDs, or disciplinary info in listings or descriptions.

---

## Operations & adoption

### How would adoption be encouraged?

Low-friction tactics for pilot:

- Link from official lost-and-found / student-life page  
- QR code posters at Union, Safety, Res Life desks → `campusfound` URL  
- RA / desk staff trained: “Post found items here; tell students to check here first”  
- One email from Dean of Students / Student Life at semester start  

**Not required:** Mandating use or replacing office intake overnight.

### What happens to unclaimed property?

**Unchanged from today:** CampusFound does not replace physical retention policies. Listings **expire after 60 days** on the board; offices follow existing disposal/donation timelines for held items.

### Can departments maintain official found items?

**Yes.** Staff with admin access can remove outdated listings. Departments can standardize: “We post to CampusFound within 24 hours of intake.”

### What metrics define success?

Suggested pilot metrics:

| Metric | Target (example — adjust with stakeholders) |
|--------|---------------------------------------------|
| Active listings | Growth over 8 weeks |
| Browse sessions | Steady weekly traffic |
| Uploads from multiple buildings | Not single-office only |
| Documented reunions | ≥ 5 qualitative stories |
| Reports resolved | 100% within 48 hours |
| Staff satisfaction | “Worth continuing” in survey |

Success is **proof of value**, not necessarily mass adoption in week one.

---

## Technical (only if asked)

### Does Luther IT need to host anything?

**No** for pilot. Externally hosted; optional IT security review recommended.

### Does it integrate with Luther systems?

**Not in pilot.** No Banner, email, or SSO integration yet. Future: Luther SSO for uploads and admin.

### What if the site goes down?

Hosted on Vercel with standard uptime. Runbook covers rollback and Supabase status checks. Pilot messaging: offices continue normal intake if site is briefly unavailable.

---

## Questions to ask stakeholders (turn the conversation)

- Where should students be directed **first** today?  
- Which office is **system of record** for found property?  
- Any **policy barriers** to posting photos of found items?  
- Who should appear as the **public moderation contact**?  
- Is a **4-week micro-pilot** in one building acceptable before campus-wide link?

---

## Honest “not yet” list (do not over-promise)

| Feature | Status |
|---------|--------|
| Luther student login (SSO) | Future |
| Lost-item report form (separate from found) | Future |
| In-app messaging finder ↔ owner | Future |
| Automated match notifications | Future |
| In-app ownership verification | Future — use office process |
| Department-specific approval queues | Future |
| Native mobile app | Not planned — mobile web |

Framing: *“The pilot proves the board and moderation model; integrations come after we validate demand.”*
