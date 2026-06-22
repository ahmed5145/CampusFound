# CampusFound — Google Slides Deck (Copy-Paste Ready)

**Audience:** Dean of Students · Student Life · Campus Safety · Residential Life · Student Activities  
**Duration:** 7–10 minutes, then discussion  
**Slide count:** 10

---

## Global design settings (apply once in Google Slides)

| Setting | Value |
|---------|--------|
| **Theme** | Simple Light or blank white |
| **Title font** | Arial or Source Sans Pro, **40 pt**, bold, color `#1B2A4A` (navy) |
| **Body font** | Arial or Source Sans Pro, **26 pt**, regular, color `#2D3748` |
| **Subtitle / labels** | **22 pt**, color `#4A5568` |
| **Accent** | `#C9A227` (gold) for lines/icons only — use sparingly |
| **Logo assets** | `public/brand/logo-full.svg` (default), `logo-mark.svg` (icon), `logo-wordmark.svg` (text), `social-announcement.svg` (1080×1080 post template) |
| **Margins** | Keep 0.75" minimum on all sides |
| **Rule** | **No more than 5 bullets per slide** · **No URLs on slides** · **No speaker notes on slides** |

**Screenshot source:** Production app (`https://campus-found-kappa.vercel.app`) or local with real data. Crop to phone width for student slides; full width for admin.

---

## SLIDE 1 — Title

### Layout
**Google Slides layout:** *Title slide* (centered)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              [Optional: Luther campus photo,                 │
│               full-bleed, 20% white overlay]                │
│                                                             │
│                      CampusFound                            │
│         Modernizing Lost & Found at Luther College          │
│                                                             │
│     A centralized found-item board for students and staff   │
│                                                             │
│              [Your name] · [Date] · Pilot proposal            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1. Slide title (layout label)
`CampusFound — Pilot Proposal`

### 2. Exact slide text
```
CampusFound

Modernizing Lost & Found at Luther College

A centralized found-item board for students and staff

[Your Name]  |  [Month Year]
```

### 3. Visuals to include
| Element | Specification |
|---------|----------------|
| **Background (optional)** | Wide Luther campus photo — library, union, or aerial; desaturated; light overlay for readability |
| **Logo** | Insert `public/brand/logo-full.svg` (icon + wordmark) or `logo-wordmark.svg` on white slides. Use `logo-mark.svg` on title/closing slides. Export PNG at 512px if Google Slides handles SVG poorly. **Do not** use unofficial Luther logo without Communications approval. |
| **Diagram** | None |

### 4. Speaker notes (~45 sec)
- Introduce yourself and your connection to Luther.
- One line on why: found items are hard to find when information is scattered.
- Frame the meeting: *“Small pilot, not an IT project — I want your input.”*
- Tell them slides are short; discussion matters more.

**Target time:** 0:00–0:45

---

## SLIDE 2 — The Problem

### Layout
**Google Slides layout:** *Title and body* — body = **3 short bullets** left column; **diagram** right column (50/50 split)

```
┌──────────────────────────┬──────────────────────────┐
│  The Problem             │   [FRAGMENTED FLOW       │
│                          │    DIAGRAM]              │
│  • Too many channels     │                          │
│  • Students don't know   │   Student ──?──► Offices │
│    where to look         │                          │
│  • Items stay unclaimed  │                          │
│                          │                          │
└──────────────────────────┴──────────────────────────┘
```

### 1. Slide title
`The Problem`

### 2. Exact slide text
```
• Too many disconnected channels

• Students don't know where to look

• Items stay unclaimed; staff answer repeat questions
```

### 3. Visuals to include
| Element | Specification |
|---------|----------------|
| **Diagram** | **Fragmented flow** (build in Slides → Insert → Diagram → Flowchart, or draw shapes): Center node **“Student lost item”** → arrows to **Campus Safety**, **Res Life**, **Union**, **Email / social**, **Department office** — dashed lines, no connecting hub. Label diagram: *“Today: no single place to look.”* Colors: gray boxes, navy text, 18 pt labels inside shapes. |
| **Screenshot** | None |

### 4. Speaker notes (~60 sec)
- Empathize: offices already do good work with limited tools.
- One brief example: wallet, earbuds, Luther ID — without blaming anyone.
- Ask: *“Does this match what you see?”* — don’t wait for long answers yet.
- Emphasize **coordination**, not failure.

**Target time:** 0:45–1:45

---

## SLIDE 3 — The Solution

### Layout
**Google Slides layout:** *Title and body* — **workflow diagram** full width below title; **one line** of text under diagram

```
┌─────────────────────────────────────────────────────────────┐
│  The Solution (Pilot)                                       │
│                                                             │
│  [LINEAR WORKFLOW DIAGRAM — 5 boxes, left to right]         │
│                                                             │
│  One searchable campus board — found items with photos      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1. Slide title
`The Solution (Pilot)`

### 2. Exact slide text
```
Found → Posted → Student browses → Claims at office → Returned

One searchable campus board for found items with photos
```

### 3. Visuals to include
| Element | Specification |
|---------|----------------|
| **Diagram** | **Linear workflow** — 5 rounded rectangles, left → right, arrows between: **(1) Item found** → **(2) Posted** → **(3) Student browses** → **(4) Claims at office** → **(5) Returned**. Use navy fill `#1B2A4A` with white 22 pt text, or white boxes with navy border. |
| **Screenshot** | None on slide (save for Slide 4) |

### 4. Speaker notes (~60 sec)
- Be explicit: **found-item board**, not a full case-management system.
- Ownership verification stays **in person** at existing desks — platform improves **discovery** only.
- Built and demo-ready; do not mention tech stack.
- Do **not** promise: student login, messaging, or auto-matching (pilot = browse + post + moderate).

**Target time:** 1:45–2:45

---

## SLIDE 4 — Student Experience

### Layout
**Google Slides layout:** *Title and body* — **3 phone screenshots** in a row; **3 numbered labels** below (minimal)

```
┌─────────────────────────────────────────────────────────────┐
│  Student Experience                                         │
│                                                             │
│  [Home]      [Browse]      [Item detail]                    │
│  screenshot  screenshot    screenshot                       │
│                                                             │
│  1. Browse    2. Search     3. Visit office to claim      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1. Slide title
`Student Experience`

### 2. Exact slide text
```
1. Browse listings

2. Search by building or keyword

3. Visit the listed office to claim
```

### 3. Visuals to include
| Element | Specification |
|---------|----------------|
| **Screenshot 1** | **Homepage** — `/` — show “Browse Listings” and “Report Item” buttons; mobile viewport (~390×844 crop) |
| **Screenshot 2** | **Browse** — `/browse` — show at least one listing card + building filter or search bar active |
| **Screenshot 3** | **Item detail** — `/items/[id]` — show photo, building name, location type (e.g. Campus Safety / Lost & Found) |
| **Diagram** | None |

**Prep:** Use real photos, not test data. Hide empty browse — seed 2+ listings before the meeting.

### 4. Speaker notes (~90 sec)
- Optional **live demo on phone** here (60 sec max).
- No app install; works in browser.
- “Report Item” = **post a found item** — say that clearly.
- Pilot: students **browse** freely; discuss with Safety whether **uploads** are student-facing or **staff-only** for first weeks.
- Backup: these screenshots if Wi‑Fi fails.

**Target time:** 2:45–4:15

---

## SLIDE 5 — Staff Experience

### Layout
**Google Slides layout:** *Title and body* — **one wide admin screenshot** top; **4 bullets** bottom (2×2 grid or single column, max 4 lines)

```
┌─────────────────────────────────────────────────────────────┐
│  Staff Experience                                           │
│                                                             │
│  [ADMIN DASHBOARD SCREENSHOT — stats + listing row]         │
│                                                             │
│  Moderate · Review reports · Audit log · Auto-expiry        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1. Slide title
`Staff Experience`

### 2. Exact slide text
```
Moderate listings

Review student reports

Audit trail of actions

Listings expire after 60 days
```

### 3. Visuals to include
| Element | Specification |
|---------|----------------|
| **Screenshot** | **Admin dashboard** — `/admin` — crop to show: stats cards (active / removed / expiring), at least one listing row, edge of Reports panel if visible. Desktop width. Blur any sensitive listing text if needed. |
| **Diagram** | None |

### 4. Speaker notes (~60 sec)
- *“Supports your workflow — doesn’t replace your judgment.”*
- Workload at pilot scale: **~30 min/week** if traffic is modest — re-evaluate if reports spike.
- Staff sign in with **authorized Luther email** (no shared passwords in production).
- Ask: *“Which office should be primary moderator?”*

**Target time:** 4:15–5:15

---

## SLIDE 6 — Trust & Safety

### Layout
**Google Slides layout:** *Title and body* — **center: 3-icon row**; **3 bullets** below (no sub-bullets)

```
┌─────────────────────────────────────────────────────────────┐
│  Trust & Safety                                             │
│                                                             │
│     [Report icon]  →  [Shield icon]  →  [Clock icon]        │
│       Report          Moderate           Expire             │
│                                                             │
│  • Staff oversight and user reporting                       │
│  • In-person verification at campus offices                 │
│  • Clear use guidelines on site                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1. Slide title
`Trust & Safety`

### 2. Exact slide text
```
Report  →  Moderate  →  Expire

• Staff oversight and user reporting

• In-person verification at campus offices

• Published terms, privacy, and moderation contact
```

### 3. Visuals to include
| Element | Specification |
|---------|----------------|
| **Diagram** | **Three-step safeguard strip** — simple icons (Google Slides → Insert → Icons): flag/report, shield, clock. Arrows between. Navy icons on white. |
| **Screenshot (optional, small)** | Corner inset: `/about` page “Safety and privacy” paragraph — only if room; otherwise skip. |

### 4. Speaker notes (~60 sec)
- Sensitive items: **office holds item**; listing shows **where to inquire**, not ID photos.
- If asked about anonymous upload: acknowledge trade-off; offer **staff-only posting** for early pilot if they prefer.
- Counsel + IT review **before** a `.edu` link — position as a gate you support.
- Pause briefly — this is where Safety and Dean engage.

**Target time:** 5:15–6:15

---

## SLIDE 7 — Cost & Resources

### Layout
**Google Slides layout:** *Title and body* — **simple 3-row table**, no borders except light horizontal lines

```
┌─────────────────────────────────────────────────────────────┐
│  Cost & Resources                                           │
│                                                             │
│  Financial     $0 software licensing (pilot)                │
│  Technical     No Luther servers required                   │
│  Staff time    1–2 moderators · light weekly review         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1. Slide title
`Cost & Resources`

### 2. Exact slide text
```
Financial        $0 software licensing (pilot)

Technical        No Luther servers required

Staff time       1–2 moderators · light weekly review
```

*(Use tab alignment or a 2-column table: labels bold 26 pt, values regular 26 pt.)*

### 3. Visuals to include
| Element | Specification |
|---------|----------------|
| **Diagram** | None — clean table only |
| **Screenshot** | None |

### 4. Speaker notes (~45 sec)
- Not asking for procurement or budget line.
- Staff time is the real cost — be honest.
- Sustainability: named **staff sponsor** + handoff plan before you graduate.
- IT privacy review: you welcome it as a pilot requirement.

**Target time:** 6:15–7:00

---

## SLIDE 8 — Pilot Plan

### Layout
**Google Slides layout:** *Title and body* — **timeline diagram** top; **3 metrics bullets** bottom

```
┌─────────────────────────────────────────────────────────────┐
│  Pilot Plan                                                 │
│                                                             │
│  Week 1–2      Week 3–8         Week 9–10                     │
│  Soft launch   Expand           Review                      │
│  [═══════════════●───────────────●]                           │
│                                                             │
│  Measure: listings · returns · staff feedback               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1. Slide title
`Pilot Plan`

### 2. Exact slide text
```
Fall semester  ·  8–10 weeks

Soft launch → Expand → Review

Measure: listings · documented returns · staff feedback
```

### 3. Visuals to include
| Element | Specification |
|---------|----------------|
| **Diagram** | **Timeline bar** — horizontal line with 3 nodes: *Week 1–2 Soft launch* | *Week 3–8 Expand* | *Week 9–10 Review*. Gold dots on navy line. |
| **Screenshot** | None |

### 4. Speaker notes (~60 sec)
- Experiment **with an exit** — weak results → clean sunset.
- Success = proof centralization helps, not viral adoption.
- Offer a **one-page summary at 30 days**.
- Kill criteria (say if pressed): low cross-posting from offices, unresolved reports, no staff sponsor.

**Target time:** 7:00–8:00

---

## SLIDE 9 — The Ask

### Layout
**Google Slides layout:** *Title and body* — **numbered list**, max 5 items, large type; optional checkbox icons

```
┌─────────────────────────────────────────────────────────────┐
│  The Ask                                                    │
│                                                             │
│  1. Endorse a limited pilot                                 │
│  2. One link from student-life / lost-and-found page        │
│  3. Name 1–2 staff moderators                               │
│  4. Feedback on operations (today + one follow-up)            │
│  5. Agree how we'll evaluate success                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1. Slide title
`The Ask`

### 2. Exact slide text
```
1. Endorse a limited pilot

2. One webpage link

3. Name 1–2 staff moderators

4. Operational feedback

5. Agree on success measures
```

### 3. Visuals to include
| Element | Specification |
|---------|----------------|
| **Diagram** | Optional: empty checkbox square before each line (Insert → Special characters or Shape) |
| **Screenshot** | None |

### 4. Speaker notes (~45 sec)
- Small and low-risk — not a campus mandate.
- If hesitation: offer **4-week micro-pilot**, one building or staff-only posting.
- You operate tech through pilot; transition discussed up front with sponsor.
- Do not rush — let silence work.

**Target time:** 8:00–8:45

---

## SLIDE 10 — Discussion

### Layout
**Google Slides layout:** *Section header* or *Title only* — maximum white space

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      Discussion                             │
│                                                             │
│              Your questions and concerns                    │
│                                                             │
│                      CampusFound                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1. Slide title
`Discussion`

### 2. Exact slide text
```
Discussion

Your questions and concerns
```

### 3. Visuals to include
| Element | Specification |
|---------|----------------|
| **Diagram** | None |
| **Screenshot** | None — optional small CampusFound wordmark footer, 18 pt, gray |

### 4. Speaker notes (transition — then stop presenting)
- **Close laptop or stand away from screen.**
- Prompts (verbal only — not on slide):
  - How is lost-and-found managed today?
  - Where do students look first?
  - What would make you comfortable endorsing a pilot?
  - Who should be primary moderation contact?
  - What concerns must we resolve before any public link?
- Close: *“What would you need to see in 8 weeks to recommend continuing?”*
- Offer to send Q&A doc and demo link after.

**Target time:** 8:45–9:00 present · **remainder = discussion**

---

## Quick copy checklist

| Slide | Title field | Body / content field |
|-------|-------------|----------------------|
| 1 | CampusFound | Subtitle + tagline + your name/date |
| 2 | The Problem | 3 bullets + diagram right |
| 3 | The Solution (Pilot) | Workflow line + one tagline |
| 4 | Student Experience | 3 screenshots + 3 short labels |
| 5 | Staff Experience | Admin screenshot + 4 bullets |
| 6 | Trust & Safety | Icon row + 3 bullets |
| 7 | Cost & Resources | 3-row table |
| 8 | Pilot Plan | Timeline + 1 metrics line |
| 9 | The Ask | 5 numbered items |
| 10 | Discussion | Subtitle only |

---

## Screenshot capture guide

| File name (suggested) | URL / action | Crop |
|----------------------|--------------|------|
| `slide4-home.png` | `/` on mobile | 390×844 |
| `slide4-browse.png` | `/browse` with filters | 390×844 |
| `slide4-item.png` | `/items/[id]` | 390×844 |
| `slide5-admin.png` | `/admin` logged in | 1280×720, crop to stats + table |

**Before capture:** Run E2E cleanup · seed 2 real listings · set moderation contact on `/about`.

---

## Timing summary (7–10 min)

| Slide | Topic | Target |
|-------|--------|--------|
| 1 | Title | 0:45 |
| 2 | Problem | 1:00 |
| 3 | Solution | 1:00 |
| 4 | Student experience | 1:30 |
| 5 | Staff experience | 1:00 |
| 6 | Trust & safety | 1:00 |
| 7 | Cost | 0:45 |
| 8 | Pilot plan | 1:00 |
| 9 | The ask | 0:45 |
| 10 | Discussion | 0:15 then stop |
| **Total** | | **~9:00** |

---

*Related: `docs/STAKEHOLDER_PRESENTATION.md` (full narrative) · `docs/STAKEHOLDER_QA.md` · `docs/DEMO_READINESS.md`*
