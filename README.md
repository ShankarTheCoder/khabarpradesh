# खबर प्रदेश (Khabar Pradesh) — Nepali News Website

A full-stack Nepali-language news website with a public site and a protected
admin panel for publishing, editing, and deleting news articles. "प्रदेश"
(Pradesh/Province) content is themed around Nepal's provinces and national
news.

```
khabarpradesh/
├── backend/     Express API (JWT auth + JSON file data store)
└── frontend/    React (Vite) + Tailwind CSS
```

## Design

- **Masthead + breaking-news ticker** in the header, styled after Indian
  regional news channels/portals.
- **Palette**: ink navy (#12213B), turmeric gold (#E8A33D), sindoor red
  (#C22E2E), warm paper background (#FAF7F0).
- **Type**: Tiro Devanagari Hindi (headlines), Noto Sans Devanagari (body),
  Rajdhani (labels/eyebrows).
- Fully responsive, keyboard-focus visible, respects reduced-motion.

## 1. Backend setup

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Data is stored in
`backend/data/news.json` and `backend/data/admin.json` (plain JSON files —
no external database needed).

### Admin login credentials

| Field    | Value              |
|----------|--------------------|
| Username | `admin`            |
| Password | `KhabarAdmin@123`  |

Change these any time by editing `backend/data/admin.json` — see
"Changing the admin password" below.

## 2. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The site runs at `http://localhost:5173` and talks to the backend via
`frontend/.env` (`VITE_API_URL=http://localhost:5000/api`). Update that value
if you deploy the backend elsewhere.

## 3. Using the site

- **Public site**: home page, category pages, search, and article pages.
- **Admin panel**: go to `/admin/login`, sign in with the credentials above,
  then from `/admin/dashboard` you can add, edit, or delete news articles,
  mark a story "breaking" or "featured", and see quick stats (total
  articles, breaking count, featured count, total views). A floating **+**
  button (bottom-right) and a top "+ नयाँ समाचार थप्नुहोस्" button both open
  the new-article form for quick posting.

## Deploying to production (so the admin can post from anywhere)

Once both pieces are deployed with the right settings, the admin panel works
from any browser/device — it's just a normal website talking to your API.

### ⚠️ Data persistence — read this first

Articles are stored in a plain JSON file (`backend/data/news.json`). This is
simple and needs no database setup, but on hosting platforms with an
**ephemeral filesystem** (most serverless platforms, and some free tiers),
that file gets reset on every redeploy/restart — **posted news would
disappear**. Before going live with a real client, do one of:

1. **Deploy the backend somewhere with a persistent disk** — a small VPS
   (DigitalOcean, Hetzner, Linode), or a platform that offers a persistent
   volume (Render "Persistent Disk", Railway "Volumes"). Mount it so
   `backend/data/` survives restarts. Simplest option, no code changes.
2. **Move to a real database** (recommended for anything beyond a small
   client site) — swap `backend/utils/store.js` for a MongoDB (Mongoose) or
   PostgreSQL-backed version. Ask me if you'd like this done — it's a
   contained change since all reads/writes already go through that one file.

### 1. Deploy the backend

Deploy the `backend/` folder to any Node host (Render, Railway, Fly.io, a
VPS, etc). Set these environment variables on the host (see
`backend/.env.example`):

- `PORT` — usually set automatically by the platform
- `JWT_SECRET` — a long random string (**do not** use the default dev value)
- `CORS_ORIGIN` — optional; your frontend's domain(s), comma-separated

The server already binds to `0.0.0.0`, which is what these platforms expect.

### 2. Deploy the frontend

Set `VITE_API_URL` to your backend's public URL (e.g.
`https://api.khabarpradesh.com/api`) as a build-time environment variable on
your host (Vercel, Netlify, Cloudflare Pages all support this), then:

```bash
cd frontend
npm run build
```

Deploy the resulting `frontend/dist/` folder. If `VITE_API_URL` isn't set,
the app falls back to `<your-frontend-domain>/api` — only correct if you're
proxying the backend under `/api` on the same domain (e.g. via Nginx or a
platform rewrite rule). Setting it explicitly is safer.

### 3. Log in from anywhere

Once both are live, go to `https://your-frontend-domain/admin/login` from
any device and sign in with the admin credentials. Posting, editing, and
deleting news all work the same as local dev — the admin panel is just
hitting your live API.

### Changing the admin password in production

Same as local dev — generate a new hash and update
`backend/data/admin.json` (or the equivalent in your database if you've
migrated off JSON files):

```bash
node -e "console.log(require('bcryptjs').hashSync('YourNewPassword', 10))"
```

## Changing the admin password (local dev)

Generate a new bcrypt hash and paste it into `backend/data/admin.json`:

```bash
cd backend
node -e "console.log(require('bcryptjs').hashSync('YourNewPassword', 10))"
```

Replace the `passwordHash` field in `backend/data/admin.json` with the
printed value.

## API overview

| Method | Route                  | Auth | Description                     |
|--------|-------------------------|------|----------------------------------|
| GET    | `/api/news`             | No   | List news (filters: category, search, featured, breaking, limit) |
| GET    | `/api/news/categories`  | No   | Distinct category list          |
| GET    | `/api/news/:slug`       | No   | Single article by slug or id    |
| POST   | `/api/news/:id/view`    | No   | Increment article view count    |
| POST   | `/api/news`             | Yes  | Create article                  |
| PUT    | `/api/news/:id`         | Yes  | Update article                  |
| DELETE | `/api/news/:id`         | Yes  | Delete article                  |
| POST   | `/api/auth/login`       | No   | Admin login → returns JWT       |
| GET    | `/api/auth/me`          | Yes  | Current admin info              |

Protected routes require `Authorization: Bearer <token>`.
