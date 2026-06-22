# CampusFound — Stakeholder Presentation (Luther College)

**Audience:** Dean of Students, Student Life, Campus Safety, Residential Life, Student Activities  
**Format:** 10-minute presentation + discussion (discussion is the priority)  
**Tone:** Operational feasibility, student experience, trust, low-risk pilot — not a software sales pitch.

> **Important:** This deck reflects the **current pilot product**. Some capabilities (student Luther login, in-app messaging, automated matching) are **future enhancements**, not pilot promises. Speaker notes call out what to say vs. what to defer.

---

## Slide 1 — Title

**CampusFound**  
*Modernizing lost & found for Luther College*

Subtitle: A centralized found-item board connecting students, staff, and campus departments.

**Visual:** CampusFound logo (`public/brand/logo-full.svg`) centered or top-left; optional Luther campus photo (Communications-approved only). For social posts, use `public/brand/social-announcement.svg` and replace the URL placeholder.

**Speaker notes:**
- Brief introduction: who you are and your connection to Luther.
- One sentence on motivation: students and staff both lose time when found items are scattered across offices and informal channels.
- Frame the meeting: “I’m not asking for a large IT project — I’m proposing a small, measurable pilot.”
- Set expectation: slides are short; you want their input on how lost-and-found actually works today.

---

## Slide 2 — The problem

**Current challenges**

- Found items are reported through **multiple disconnected channels** (offices, email, social media, word of mouth).
- Students often **don’t know where to look** when something is lost.
- Different departments may maintain **separate informal processes**.
- Items can sit **unclaimed** even when someone is actively searching.
- Staff spend time on **repetitive “did anyone turn in…?”** questions.

**Visual:** Simple “spaghetti” diagram — Student → ? → Safety / Res Life / Union / Department office (fragmented arrows).

**Speaker notes:**
- Lead with empathy: offices are already doing good work with limited tools.
- Use one concrete example (wallet, AirPods, Luther ID) without blaming any office.
- Ask quietly: “Does this match your experience?” (save full answers for discussion).
- Avoid criticizing current staff; emphasize **coordination**, not failure.

---

## Slide 3 — The solution (pilot scope)

**CampusFound provides a single campus found-item board**

| Capability | Pilot |
|------------|-------|
| Centralized **found-item** listings with photo | Yes |
| Browse by **building** and **location type** | Yes |
| **Search** descriptions and location details | Yes |
| **Report** inappropriate listings | Yes |
| **Staff moderation** dashboard | Yes |
| Student Luther login / accounts | Future |
| In-app messaging or automated matching | Future |

**Visual:** Linear workflow (keep simple):

```
Item found → Posted on CampusFound → Student browses & identifies → 
Returns to listed location / contacts office → Item reunited
```

**Speaker notes:**
- Be explicit: this is a **found-item board**, not a full case-management system (yet).
- Ownership verification and handoff happen through **existing campus processes** (desk, office, ID check) — the platform makes discovery easier.
- Do not dive into Vercel, Supabase, or APIs.
- If asked “is it built?” — yes, pilot is live; you can demo on your phone.

---

## Slide 4 — Student experience

**How students use CampusFound (today)**

1. **Browse** recent found items (`/browse`) — filter by building or search keywords.
2. **Open a listing** — photo, building, where it was found, optional details.
3. **Go to the location** listed (lost & found desk, campus safety, etc.) to claim the item.
4. **Report a found item** (`/upload`) — photo, building, location type, optional notes (no account required for pilot).
5. **Report a problem** on any listing (spam, personal info, etc.).

**Visual:** 2–3 screenshots — Homepage, Browse (with filters), Item detail. **Use real listings with real photos in the demo.**

**Speaker notes:**
- Emphasize **low friction**: no app install, works in the browser, mobile-friendly.
- Pilot does **not** require student login — lowers adoption barrier; moderation handles abuse.
- Walk through in &lt; 60 seconds if demoing live.
- If something fails technically, go to backup screenshots.

---

## Slide 5 — Administrative experience

**How staff use CampusFound**

- **Moderation dashboard** (`/admin`) — recent listings, remove/restore, stats.
- **Reports queue** — students flag listings; staff resolve or dismiss.
- **Moderation activity log** — audit trail of actions.
- **Automatic expiry** — listings age off after 60 days (configurable policy).

**Potential pilot partners**

- Campus Safety  
- Residential Life  
- Student Life / Union lost & found  
- Dean of Students office (oversight)

**Visual:** Admin dashboard screenshot (stats cards + one listing + reports panel).

**Speaker notes:**
- Message: **“This supports your workflow; it doesn’t replace your judgment.”**
- Estimated workload: minutes per week at pilot scale, not a new full-time role.
- Staff log in with **authorized campus email** (or controlled shared access during pilot).
- Invite: “Which office should be the primary moderation contact on `/about`?”

---

## Slide 6 — Trust, safety, and moderation

**Built-in safeguards (pilot)**

- **Terms, privacy, and about** pages with clear use guidelines.
- **User reporting** on every listing.
- **Staff moderation** — remove listings, resolve reports.
- **Rate limiting** on uploads and reports.
- **Listing expiry** (60-day default).
- **Guidance** not to post IDs, cards, or sensitive personal information.

**Operational safeguards (campus process)**

- High-value or sensitive items → **office holds item**; listing shows location, not owner details.
- Ownership verified **in person** at existing lost-and-found procedures.
- Escalation path via `NEXT_PUBLIC_MODERATION_CONTACT`.

**Future enhancements (post-pilot, if successful)**

- Luther student SSO for uploads  
- Department-specific queues  
- Formal “lost item” reports (not only found items)  
- In-app messaging with privacy controls  

**Visual:** Shield icon + three bullets: Report → Moderate → Expire.

**Speaker notes:**
- Acknowledge honestly: **no student authentication in pilot** — trade-off for speed of adoption; moderation compensates.
- Images are stored for listing display; discuss **public vs. signed URLs** only if asked (keep high level).
- This slide answers Dean of Students and Campus Safety concerns — pause for questions.

---

## Slide 7 — Cost and resource requirements

**Financial cost**

- **$0 software licensing** during pilot (open-source stack, free-tier hosting).

**Technical cost**

- **Minimal** — hosted on Vercel; database on Supabase; no Luther IT servers required for pilot.
- Optional: Luther IT review of privacy/data handling (recommended).

**Administrative cost**

- **Light moderation** — 1–2 designated staff moderators.
- Occasional review of reported listings.
- Monthly 15-minute check-in during pilot (suggested).

**Visual:** Simple table — Cost type | Pilot estimate.

**Speaker notes:**
- Compare to status quo: staff time spent answering duplicate inquiries (qualitative, not dollarized).
- Sustainability after graduation: document in runbook; can transfer admin accounts to Luther staff or IT.
- Not asking for budget line item — asking for **endorsement and a link**.

---

## Slide 8 — Pilot proposal

**Duration:** Fall semester (or 8–10 weeks — adjust to your calendar)

**Scope**

- Luther College only (`NEXT_PUBLIC_CAMPUS_SLUG=luther`).
- Promote via one official webpage link + partner offices.
- 1–2 staff moderators identified before launch.

**Success metrics (measurable)**

| Metric | How measured |
|--------|----------------|
| Listings posted | Admin stats / analytics |
| Browse visits | Analytics |
| Items reunited (qualitative) | Moderator / office log (simple spreadsheet) |
| Reports handled | Admin reports queue |
| Student/staff feedback | Short survey after 4–6 weeks |

**Visual:** Timeline bar — Week 1–2 soft launch → Week 3–8 expand → Week 9–10 review.

**Speaker notes:**
- Frame as **experiment with an exit** — if metrics or feedback are weak, pilot ends cleanly.
- Success ≠ viral adoption; success = **proof that centralization helps** even at modest scale.
- Offer to share a one-page summary after 30 days.

---

## Slide 9 — The ask

**What I’m requesting (small and low-risk)**

1. **Official endorsement** of a limited pilot (not campus-wide mandate).
2. **One link** from the college lost-and-found or student-life webpage.
3. **1–2 staff moderators** (names + emails for admin access).
4. **30 minutes of feedback** on operational requirements (this meeting + one follow-up).
5. **Agreement on how we’ll evaluate** success at end of semester.

**Visual:** Checklist with five items — minimal text.

**Speaker notes:**
- Emphasize you are **not** asking for procurement, RFP, or dedicated budget.
- Offer to handle technical operation through the pilot; transition plan can be discussed later.
- If they hesitate: propose **even smaller** pilot — one building cluster or one department for 4 weeks.

---

## Slide 10 — Questions & discussion

**Discussion prompts**

- How is lost-and-found **actually managed** today across your areas?
- Where do students **look first** when they lose something?
- What would make you **comfortable** endorsing a pilot?
- Which department should be the **primary moderation** contact?
- What **concerns** should we address before any public promotion?

**Visual:** “Discussion” slide — `public/brand/logo-mark.svg` centered, minimal text.

**Speaker notes:**
- **Stop presenting.** Put laptop away if helpful.
- Take notes visibly.
- Close with: “What would you need to see in 8 weeks to recommend continuing?”
- Thank them for time; offer to send Q&A doc and demo link after meeting.

---

## Demo checklist (before the meeting)

- [ ] Browse shows real listings (not empty; no test/E2E items).
- [ ] Upload a **real photo** demo item beforehand or live.
- [ ] Admin login tested (Staff email tab).
- [ ] `/about` shows correct moderation contact.
- [ ] Phone charged; mobile browser ready (primary student use case).
- [ ] Backup screenshots if Wi‑Fi fails.
- [ ] Do **not** claim features that are not built (login, messaging, auto-match).

See `docs/DEMO_READINESS.md` for full risk list.
