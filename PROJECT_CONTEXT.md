Project: CampusFound

CampusFound is a web application that acts as a discovery layer for campus lost-and-found systems.

Users can:

- Browse found items
- Upload found items
- Filter by building

Users do NOT need accounts.

The platform does NOT handle claims.

The platform does NOT provide messaging.

The platform does NOT provide notifications.

The goal is minimizing friction for uploading found items.

Tech stack:

- Next.js App Router
- TypeScript
- Tailwind
- Supabase
- PostHog
- Vercel

Core upload fields:

- Image
- Building
- Location Type
- Location Details (optional)
- Description (optional)

Location Type values:

- Lost & Found
- Campus Safety
- Other

Listings automatically expire after 60 days.

Internal moderation status:

- active
- removed