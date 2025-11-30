# PerkPal Frontend

This is the SvelteKit/Tailwind front-end for the PerkPal experience. It roams through public landing pages, the perks/journal catalog, legal/partner content, and a secure admin portal that mirrors the Laravel backend via REST calls and cookie-based Sanctum auth.

## Stack at a glance

- **Framework:** SvelteKit + Vite
- **Styling:** Tailwind CSS (configured via `tailwind.config.js` and `postcss.config.cjs`)
- **Rich text:** tiptap extensions for CMS previews and perks descriptions
- **Data layer:** `src/lib/api/*` exposes typed Axios/fetch wrappers so routes can call the Laravel API and stay consistent with the token stored in `hooks.server.ts`
- **Assets:** static images under `static/`, shared helpers under `src/lib/utils`, and centralized metadata in `src/lib/config.ts`

## Prerequisites

- Node.js **20.x**
- Valid backend API URL (see environment vars below)

## Local setup

```
npm install
```

Create a `.env` file (or `env.local` if preferred) and provide at least:

- `PUBLIC_API_BASE` – the public-facing backend URL
- `PRIVATE_API_BASE` – optional internal API base used when server routes need to proxy (falls back to `PUBLIC_API_BASE`)
- `PUBLIC_SITE_NAME`, `PUBLIC_CONTACT_EMAIL`, `PUBLIC_HERO_IMAGE`, `PUBLIC_CTA_BROWSE_LABEL`, `PUBLIC_PERK_PLACEHOLDER` – optional branding overrides consumed from `src/lib/config.ts`

## Running

- `npm run dev -- --host` – start Vite in dev mode with hot module replacement (hooks fetch layout data and auth state via the backend)
- `npm run build` – production bundle
- `npm run preview` – preview the `build/` output
- `npm run start` – run the built Node server (uses `build/index.js`)
- `npm run check` – run `svelte-check` for type safety

## Routes overview

- Top-level pages: home (`+page.svelte`), perks, journal, contact, partner, categories, privacy, terms, reset password, sitemap/robots, and about/terms
- Admin console: full admin area under `src/routes/admin/` handling login, perks, categories, subcategories, locations, leads, inbox, content sections, journal management, settings, password resets, and analytics clips
- API endpoints mirror Laravel’s `v1` and `v1/admin` namespaces via helpers in `src/lib/api`

## Runtime behavior

- Global layout (`+layout.server.ts`) fetches topbar/footer content via `/page-content/topbar` and `/page-content/footer`
- `hooks.server.ts` reads the `auth_token` cookie and, if present, populates `event.locals.user` by hitting `/auth/me`
- The `src/lib/stores` expose UI state (loading indicators, snackbars, etc.) and keep the admin pages reactive
- TipTap editors are wired through `src/lib/components` so CMS content editors can preview structured blocks before saving to the backend

## Deployment notes

- Make sure `PUBLIC_API_BASE`/`PRIVATE_API_BASE` point to the deployed Laravel API
- Run `npm run build` before shipping; the `build/` directory is fully static aside from the Node preview server
