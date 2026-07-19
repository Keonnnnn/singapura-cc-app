# Singapura CC

Web app for Singapura Community Club — member accounts, event registration, announcements, feedback, notifications, and a rewards program.

## Stack

**Client** — React 18 (Vite), React Router, MUI, Formik + Yup, Axios. Deployed on Vercel.

**Server** — Node.js / Express, Sequelize ORM, JWT auth (`jsonwebtoken` + `bcrypt`), file uploads via Multer to Google Cloud Storage. Deployed on Google Cloud Run (`asia-southeast1`).

**Database** — PostgreSQL, hosted on Neon (`ap-southeast-1`).

## Project structure

```
client/               React SPA
  src/pages/           route-level views
  src/components/      shared components (Sidebar, Footer, ...)
  src/contexts/        UserContext (auth state)
  src/http.js           Axios instance (baseURL from VITE_API_BASE_URL)

server/                Express API
  routes/               one router per resource (user, events, post, comment, ...)
  models/               Sequelize models + models/index.js (DB connection)
  middlewares/          auth.js (JWT guard), upload.js (Multer -> GCS)
  scripts/createAdmin.js   seeds the admin user on boot
  index.js              app entrypoint, mounts all routers
  Dockerfile             Cloud Run image (node:20-alpine)
```

## Getting started

Requires Node 20+ and access to the project's Neon database / GCS bucket credentials.

```bash
# server
cd server
npm install
cp .env.example .env   # fill in the values below
npm start               # nodemon index.js, http://localhost:3001

# client
cd client
npm install
npm run dev              # http://localhost:5173
```

On boot, the server runs `sequelize.sync({ alter: true })` and seeds an admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD` — no manual migration step needed for local dev.

### Environment variables

**`server/.env`**

| Variable | Purpose |
|---|---|
| `APP_PORT` | Local port (Cloud Run overrides via `PORT`) |
| `CLIENT_URL` | Allowed CORS origin |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PWD`, `DB_NAME` | Neon Postgres connection |
| `APP_SECRET` | JWT signing secret |
| `TOKEN_EXPIRES_IN` | JWT expiry (e.g. `30d`) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Seeded admin account |
| `GMAIL_PASSWORD` | Gmail app password used for outbound mail (OTP / notifications) |
| `BUCKET_NAME`, `PROJECT_ID` | GCS bucket for uploads |

For GCS auth locally, don't use a service account key file — run `gcloud auth application-default login` so `@google-cloud/storage` picks up your gcloud credentials via Application Default Credentials.

**`client/.env`** (local) / **`client/.env.production`** (Vercel)

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL |
| `VITE_FILE_BASE_URL` | Public GCS URL prefix for uploaded files |

Actual secret values live only in the untracked `.env` files — never commit them.

## Deployment

- **Backend**: containerized (`server/Dockerfile`) and deployed to Cloud Run, service `singapura-cc-backend`, region `asia-southeast1`, GCP project `singapura-cc-app`. Runs under a bucket-scoped service account with no key file (Application Default Credentials).
- **Frontend**: Vercel, SPA rewrites via `client/vercel.json`, pointed at the Cloud Run URL through `VITE_API_BASE_URL`.
- **Database**: Neon Postgres (`ap-southeast-1`), SSL required.
- **Storage**: GCS bucket `singapura-cc-app`, public object read for uploaded files.
