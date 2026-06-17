# CampusFound — Demo & Pilot Readiness Review

**Purpose:** Identify risks before a live stakeholder demo or public pilot.  
**Perspective:** Administrator + live demo reliability, not code quality audit.

---

## Overall verdict

**Ready for a controlled pilot demo** with honest framing. Core flows work in production. **Do not** present messaging, student SSO, or automated matching as live features.

---

## What works well (show these)

| Flow | Notes |
|------|--------|
| Homepage → Browse / Upload | Clear CTAs |
| Browse filters + search | Building, location type, keyword search |
| Upload found item | Photo, building picker, location type |
| Item detail | Image, building, location, report button |
| Report listing | User flag → admin queue |
| Admin dashboard | Stats, remove/restore, reports, activity log |
| Policies | `/terms`, `/privacy`, `/about` with contact |
| Auto-expiry | 60-day listings; daily cron |

---

## Demo risks (live meeting)

### High — address before presenting

| Risk | Mitigation |
|------|------------|
| **Over-promising features** (login, messaging, matching) | Use corrected slide deck; stick to script |
| **Empty browse page** | Pre-seed 2–3 real listings with real photos before meeting |
| **E2E / test listings visible** | Run `npm run cleanup:e2e` or verify descriptions aren’t test markers |
| **Admin login confusion** | Use **Staff email** tab; confirm moderator account works |
| **Tiny or broken images** | Demo with a normal phone photo, not test PNGs |

### Medium — mention if asked

| Risk | Detail |
|------|--------|
| **No student accounts** | By design for pilot; moderation compensates |
| **Public image URLs** | Photos are viewable by URL; policy discourages sensitive content |
| **Anonymous uploads** | Rate-limited; abuse → report + remove |
| **“Report Item” wording** | Means “post a found item,” not “report a lost item” — clarify verbally |
| **Optional description field** | Many listings show building/location only — still valid |
| **Building list length** | Picker works but is long; acceptable for Luther scale |

### Low — unlikely in demo

| Risk | Detail |
|------|--------|
| Rate limit (6 uploads/min) | Only if rapid repeated uploads in demo |
| Campus slug misconfiguration | Fixed; buildings have `campus_id` |
| Cron / expiry during demo | Irrelevant in 10-minute session |

---

## UX friction (not blockers; pilot acceptable)

- Upload building picker is modal — fine on mobile, extra tap on desktop.
- No upload progress bar — short waits on slow networks.
- Browse has no “recent on homepage” — must go to `/browse`.
- Removed listings return 404 on public detail — correct but don’t demo removed IDs.
- Report “already reported” uses browser localStorage — new device can report again (server also dedupes by IP).

---

## Missing validation (acceptable for pilot; disclose)

- No proof of Luther affiliation for uploaders.
- No automated PII detection in images (human moderation + guidelines).
- No formal ownership workflow in software.
- No lost-item intake form (found items only).

---

## Reliability

| Area | Status |
|------|--------|
| CI (lint, build, E2E) | Green when secrets configured |
| E2E cleanup | Runs after tests; uses production DB if CI secrets point there — **recommend staging DB later** |
| Error boundary | Client errors caught; PostHog `client_error` |
| Admin API auth | Protected session cookies |

---

## Recommended demo script (5 minutes)

1. **Phone** — open production URL (not localhost).
2. **Browse** — filter to a building with listings; search a keyword.
3. **Item detail** — show photo and location; point to Report Listing (for problems, not claims).
4. **Upload** — optional live upload OR show pre-uploaded item: photo → building → lost & found → submit.
5. **Admin** (laptop) — stats, one report resolve or listing remove/restore, moderation log.
6. **About** — moderation contact and safety language.

**Backup:** Screenshots in slides if network fails.

---

## Pre-meeting checklist (day before)

- [ ] 2+ real active listings on browse  
- [ ] `NEXT_PUBLIC_MODERATION_CONTACT` set to real email  
- [ ] `NEXT_PUBLIC_CAMPUS_NAME` shows Luther branding  
- [ ] Admin moderator login tested  
- [ ] No test/E2E listings in browse  
- [ ] Slides reviewed — no false feature claims  
- [ ] Q&A doc printed or on tablet  

---

## Administrator perspective summary

| Concern | Assessment |
|---------|------------|
| **Trust** | Moderation + reports + policies; no student SSO yet |
| **Safety** | Guidelines + staff removal; in-person claim unchanged |
| **Liability** | Board only; physical custody unchanged |
| **Operational burden** | Low at pilot scale |
| **Student adoption** | Low friction (no login); needs official link + desk buy-in |
| **Sustainability** | Documented handoff needed post-graduation |
| **Implementation ease** | Low — no Luther servers; small ask |

**Bottom line for stakeholders:** Low-risk pilot that centralizes **discovery** of found items without replacing office custody or verification procedures.
