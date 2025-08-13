# Avsec Quiz – Full‑Stack Upgrade

A production‑ready starter that turns your single‑file quiz into a full‑stack site with:
- Authentication (JWT via HttpOnly cookie)
- Admin to add quizzes (Google Sheet CSV URLs)
- Quiz player (client parses CSV, server stores results)
- Stats dashboard with weak sections and wrong‑question review APIs
- Prisma ORM with SQLite (swap to Postgres easily)

## Quick start
```bash
pnpm i   # or npm i / yarn
pnpm prisma:migrate
pnpm dev
```
Set `JWT_SECRET` in `.env.local` for production. To use Postgres, set `DATABASE_URL` and change `provider` in `prisma/schema.prisma` accordingly.

## Where to look
- `app/quiz/[id]/page.tsx` – plays any quiz backed by a Google Sheet CSV (same headers as your current app)
- `app/api/attempts/submit/route.ts` – stores answers and computes score
- `app/api/stats/me` – aggregates accuracy + wrongs by section
- `app/api/stats/me/wrongs` – returns unique wrong questions (optionally filter by `?section=`)

## CSV columns
- **English Question** (string, required)
- **Option 1..4** (strings)
- **Correct** (1‑based index)
- Optional: **Section**/**Topic**/**Category** (any of these will be used for section stats)

## Security notes
- HttpOnly cookie prevents client JS from reading the token.
- Server verifies auth on all write/read of personal stats.
- Swap to Postgres for multi‑user scale.
