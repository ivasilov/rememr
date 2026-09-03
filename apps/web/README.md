# rememr web

The main app is built with TanStack Start and uses browser-side Supabase clients protected by Row Level Security. The OpenAI bookmark chat is the only server route.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the local or hosted Supabase project.
3. Optionally set `OPENAI_API_KEY` to enable bookmark chat.
4. Run `pnpm dev`; the app listens on `http://localhost:3001`.

`VITE_APP_BASE_PATH` is empty for local development. Set it to `/dashboard` in the Vercel Preview and Production environments.

## Vercel deployment

The Vercel project root is `apps/web`. Use Node.js 22.12 or later and configure:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_APP_BASE_PATH=/dashboard`
- `OPENAI_API_KEY`

Configure the Supabase Site URL and allowed authentication redirects with the public `/dashboard` prefix, including `/dashboard/auth/confirm`, `/dashboard/auth/update-password`, and `/dashboard/bookmarks`. The docs app continues to proxy `/dashboard` requests to this deployment.
