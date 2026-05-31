# CampusFound — Project Roadmap (V1 launch to Luther College)

Target: ship MVP to Luther College in ~2 weeks. This roadmap breaks work into phases, lists tasks with estimated effort, dependencies, and suggested owners for a small team.

## High-level Phases (in order)
1. Project Setup & Infra
2. Core Public Flows (Upload backend + UI)
3. Browse & Item Details UI
4. Admin & Moderation
5. Instrumentation, Reliability & Mobile Polish
6. QA, Staging & Launch

---

## Phase 1 — Project Setup & Infra
- Tasks:
  - Create Supabase project, enable Storage (1.0h) — Owner: DevOps/Backend
  - Create PostHog project and get API key (0.5h) — Owner: DevOps
  - Configure Vercel project and env vars (0.5h) — Owner: DevOps
  - Run DB migrations `db/migrations/001_create_buildings_and_listings.sql` and `db/migrations/002_add_other_location_type_to_listings.sql` (0.5h) — Owner: Backend
  - Seed `buildings` with Luther College canonical list (1.0h) — Owner: Backend
- Estimated effort: 3–4 hours
- Definition of Done: infra provisioned, migrations applied, seed data present, env vars set in staging.

---

## Phase 2 — Core Public Flows (Upload backend + UI)
- Tasks:
  - Implement image upload to Supabase Storage and store `image_url` in DB (6–8h) — Owner: Backend/Fullstack
  - Implement `/upload` UI (camera/file, preview, required fields, client validation) (8–12h) — Owner: Frontend
  - Implement server API route to create listing row (2–4h) — Owner: Backend
  - Implement optional `photo_hash` generation server-side (1–2h) — Owner: Backend (Nice-to-have)
- Estimated effort: 17–26 hours
- Dependencies: Phase 1 complete
- Definition of Done: Users can upload images and create listings persisted in DB with image stored in Supabase Storage.

---

## Phase 3 — Browse & Item Details UI
- Tasks:
  - Implement `/browse` list with building filter and preserve filters in URL (6–8h) — Owner: Frontend
  - Implement `ItemCard` component and listing thumbnails (3–4h) — Owner: Frontend
  - Implement `/items/[id]` detail page with removed-state handling (3–4h) — Owner: Frontend
  - Add server API to fetch listings with optional filters (2–3h) — Owner: Backend
- Estimated effort: 14–19 hours
- Dependencies: Phase 1 + Phase 2
- Definition of Done: Users can browse and filter listings, and view item details; back preserves state.

---

## Phase 4 — Admin & Moderation
- Tasks:
  - Build simple protected `/admin` UI (secret or basic auth) (2–4h) — Owner: Fullstack
  - Implement listing status toggle (removed/active) and server endpoint (3–4h) — Owner: Backend
  - Display basic counts (active/removed/expiring soon) and search by ID (2–3h) — Owner: Frontend
- Estimated effort: 8–11 hours
- Dependencies: Phase 2 + Phase 3
- Definition of Done: Admin can find listing by ID and mark removed/restore; changes reflect live.

---

## Phase 5 — Instrumentation, Reliability & Mobile Polish
- Tasks:
  - Integrate PostHog events (Must events) across flows (3–4h) — Owner: Frontend/Fullstack
  - Preserve browse scroll & filter state on navigation (2–3h) — Owner: Frontend
  - Upload error handling and retry UX; show clear errors (3–4h) — Owner: Frontend/Backend
  - Accessibility and basic a11y checks on primary flows (2–3h) — Owner: Frontend
  - Mobile camera polish and image preview behavior (2–4h) — Owner: Frontend
- Estimated effort: 12–18 hours
- Dependencies: Phases 1–4 complete
- Definition of Done: PostHog receives events; upload resilient against common network issues; mobile upload tested.

---

## Phase 6 — QA, Staging & Launch
- Tasks:
  - QA testing checklist across iOS/Android/desktop (4–6h) — Owner: QA/Frontend
  - Fix high-priority bugs (TBD) — Owner: Fullstack
  - Deploy to production, set up monitoring & alerts (2–4h) — Owner: DevOps
  - Soft launch to pilot group, collect feedback (2–4h) — Owner: Product
- Estimated effort: 8–14 hours + bug-fix buffer
- Definition of Done: Production site live; pilot group confirmed; monitoring operational; critical bugs triaged.

---

## Total Estimated Effort
- Conservative: ~62 hours
- Generous: ~92 hours
(One full-time engineer can deliver within two weeks with focused work; split between frontend, backend, and ops accelerates delivery.)

## Parallelization & Suggested Owners
- Parallelize: Frontend implements upload UI and browse UI in parallel with Backend implementing upload endpoint and storage wiring.
- Suggested small-team composition:
  - 1 Fullstack engineer (owner for integration, admin, APIs)
  - 1 Frontend engineer (owner for UX, mobile polish, A11y)
  - 1 DevOps/Backend (short-term owner to provision Supabase, PostHog, run migrations)
  - 1 QA/Product (test, pilot coordination)

## Risk & Mitigation
- Camera reliability on mobile browsers: test early in-device and fallback to file picker.
- Image sizes and upload failures: implement client-side resizing/compression if slow networks are a problem; otherwise add clear guidance and retry.
- Admin access: use a simple secret-based protection for V1; plan to improve to RLS and role-based users later.

## Definition of Done (project-level)
- All Must-Have features implemented and verified in staging.
- PostHog capturing core events.
- Supabase Storage + DB migration applied and seeded for Luther College.
- Admin can moderate listings.
- Pilot group able to use app and basic monitoring in place for first 72 hours.

---

If you want, I can now:
- create `docs/USER_FLOW.md` (done) and `docs/PROJECT_ROADMAP.md` (done),
- or generate a task-by-task kanban-ready checklist with owner and calendar dates. Which next? 
