# InShort Top News

A fast, lightweight news reader that fetches top headlines from [NewsAPI](https://newsapi.org),
condenses each into a short "in-short" card, and tags them by category — no paid
services, no API keys beyond the free NewsAPI one.

**Live:** https://inshort-top-news.vercel.app

## Features

- **Latest India news** on the homepage, plus keyword **search**.
- **Auto-summarized cards** — each story trimmed to a crisp snippet (local, free).
- **Category chips** — client-side filtering by Business, Technology, Sports, etc.
  (free keyword-based tagging).
- **Responsive, dark-mode-aware UI** — editorial theme, no framework.
- **Production-ready**: response caching (protects the free NewsAPI quota),
  security headers (Helmet), request logging, `/healthz` check, graceful
  fallbacks, and a 404 page.

## Tech

Node.js · Express · EJS · axios · Helmet · morgan. Deploys to Vercel (serverless)
or any Node host (Procfile included).

## Getting started

```bash
git clone https://github.com/AfranUsmani/Inshort-Top-News.git
cd Inshort-Top-News
npm install

cp .env.sample .env        # then add your free NewsAPI key
npm run dev                # http://localhost:5000
```

`npm run dev` uses nodemon; `npm start` runs the production server.

## Environment variables

| Variable  | Required | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| `API_KEY` | yes      | NewsAPI key — free at https://newsapi.org/register     |
| `PORT`    | no       | Local port (default `5000`)                            |

## Project structure

```
app.js                     Express app: security, logging, static, routes
api/index.js               Vercel serverless entry (re-exports the app)
src/
  routes/news.js           GET / (top news) and POST / (search)
  services/news.js         fetch + cache + summarize + categorize
  views/                   EJS templates + partials
public/                    css, js, favicon (served statically)
```

## Deployment (Vercel)

1. Import the repo at [vercel.com](https://vercel.com) (free Hobby tier).
2. Add the `API_KEY` environment variable.
3. Deploy. `vercel.json` routes all requests to the Express app and bundles the
   views. Every push to `master` auto-redeploys.

Health check: `GET /healthz` → `{ "status": "ok" }`.

## Notes

- NewsAPI's free "Developer" plan is intended for development and is capped at
  ~100 requests/day; the built-in 10-minute response cache keeps usage well
  under that. For heavier production use, upgrade the NewsAPI plan or swap in a
  news source whose free tier permits production traffic.
- `top-headlines?country=in` currently returns no sources on NewsAPI, so the
  homepage uses the `/everything` endpoint sorted by most recent.
