<div align="center">

# 📰 InShort Top News

**Live top headlines from around the world — fast, free, and zero-config.**

[![CI](https://github.com/AfranUsmani/Inshort-Top-News/actions/workflows/ci.yml/badge.svg)](https://github.com/AfranUsmani/Inshort-Top-News/actions/workflows/ci.yml)
[![Live](https://img.shields.io/badge/live-inshort--top--news.vercel.app-ff5436)](https://inshort-top-news.vercel.app)
[![Node](https://img.shields.io/badge/node-22.x-3c873a)](https://nodejs.org)
[![Express](https://img.shields.io/badge/express-4-000000)](https://expressjs.com)
[![Deploy](https://img.shields.io/badge/deploy-vercel-000000)](https://vercel.com/new/clone?repository-url=https://github.com/AfranUsmani/Inshort-Top-News)
[![License](https://img.shields.io/badge/license-ISC-blue)](./LICENSE)

[**Live demo →**](https://inshort-top-news.vercel.app)

</div>

---

InShort Top News pulls **real-time headlines from Google News RSS**, tags each by
category, and lets you browse the world's news by country or search — all on **free
resources with no API key, no quota, and nothing to configure**.

## ✨ Features

- ⚡ **Live** — real-time headlines via Google News RSS (no 24h delay, no key, no quota).
- 🌍 **Global** — browse worldwide or by country (India, US, UK, Canada, Australia,
  UAE, Singapore, Germany, France, Japan, China), plus keyword **search**.
- ⭐ **Featured lead story** — the top headline rendered as a bold hero card.
- 🕒 **Freshness timestamps** — every card shows `just now` / `12m ago` / `3h ago`.
- 🏷️ **Category chips** — instant client-side filtering, with color-coded cards.
- 🌗 **Light / dark theme** — one-tap toggle that's flash-free, remembers your choice,
  and defaults to your system preference.
- 🛡️ **Production-grade** — response caching, security headers (Helmet), request
  logging, `/healthz` check, graceful fallbacks, and a styled 404 page.
- ✅ **Tested & CI** — unit tests on Node's built-in runner (zero deps), run by
  GitHub Actions on every push and pull request; Dependabot keeps deps current.

## 🖼️ Preview

> **[View the live app →](https://inshort-top-news.vercel.app)**

```
┌──────────────────────────────────────────────────────────────┐
│ ▤ InShort ● Live  by Afran Usmani     [▾ 🌐 World][Search][🌙] │
├──────────────────────────────────────────────────────────────┤
│  Top stories · Worldwide                                       │
│  ● 30 live headlines · updated in real time                    │
│  [ All ][ Business ][ Technology ][ Sports ][ World ] …        │
│  ┌──────────────────── ★ TOP STORY ───────────────────────┐   │
│  │  WORLD · Reuters · 7m ago                                │   │
│  │  Big lead headline in serif                              │   │
│  │                                        Read full story → │   │
│  └──────────────────────────────────────────────────────────┘ │
│  ▎BUSINESS · CNBC     ▎TECH · The Verge   ▎SPORTS · ESPN       │
│  ▎Headline…           ▎Headline…          ▎Headline…           │
│  ▎· 22m ago           ▎· 1h ago           ▎· 2h ago            │
└──────────────────────────────────────────────────────────────┘
```

*(Google News RSS provides headlines, sources, and timestamps — no thumbnails —
so cards are clean and text-forward, color-coded by category.)*

## 🧱 Tech stack

**Node.js · Express · EJS · rss-parser · Helmet · morgan.**
No front-end framework — hand-authored CSS + vanilla JS.
Deploys to Vercel (serverless) or any Node host — a `Procfile` is included.

## 🚀 Quick start

```bash
git clone https://github.com/AfranUsmani/Inshort-Top-News.git
cd Inshort-Top-News
npm install
npm run dev            # http://localhost:5000 — no API key needed
```

| Script        | Does                                 |
| ------------- | ------------------------------------ |
| `npm run dev` | Start with live reload (nodemon)     |
| `npm start`   | Start the production server (`node`) |

## 🔐 Environment variables

**None required.** The app runs with zero configuration.

| Variable | Required | Description                     |
| -------- | -------- | ------------------------------- |
| `PORT`   | —        | Local port (default `5000`)     |

## 🗺️ Routes

| Method | Path          | Description                                  |
| ------ | ------------- | -------------------------------------------- |
| `GET`  | `/`           | Live top headlines for the default region     |
| `GET`  | `/?region=us` | A specific country's live feed                |
| `GET`  | `/?q=bitcoin` | Keyword search (takes priority over region)   |
| `GET`  | `/healthz`    | Health check → `{ "status": "ok" }`          |

## 🧪 Testing

Unit tests run on Node's built-in test runner — **no dependencies**:

```bash
npm test
```

They cover the pure logic (headline/source splitting, category tagging, relative
timestamps, region lookup). **CI** runs them on every push and pull request.

## 📁 Project structure

```
app.js                 Express app: security, logging, static, routes, 404
api/index.js           Vercel serverless entry (re-exports the app)
src/
  routes/news.js       GET / — region browse + search (shareable URLs)
  services/news.js     Google News RSS: fetch + cache + categorize + timeAgo
  views/               EJS page templates
    partials/          topbar, hero, featured, card, chips, empty, foot
public/
  css/styles.css       hand-authored theme (light + dark)
  js/theme.js          sets theme before paint (flash-free)
  js/app.js            chip filter, region switch, theme toggle
  favicon.svg          logo mark
test/                  node:test unit tests
```

## ☁️ Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AfranUsmani/Inshort-Top-News)

1. Click **Deploy** (or import the repo at [vercel.com](https://vercel.com), free Hobby tier).
2. That's it — no environment variables to set. `vercel.json` routes all traffic to
   the Express app and bundles the views; every push to `master` auto-redeploys.

Any Node host works too — just run `npm start` (the `Procfile` uses `node app.js`).

## 📌 Notes

- Headlines come from **Google News RSS** (`news.google.com/rss`) — public, real-time,
  no key, no quota. Article links open the original publisher.
- RSS provides headlines/sources/timestamps but **no images or article summaries**, so
  the UI is intentionally text-forward. To add thumbnails + summaries you'd swap in a
  keyed API (e.g. GNews / NewsData.io free tiers) — at the cost of per-request limits.

## 🤝 Contributing

Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md). In short:
branch from `master`, run `npm test`, and open a PR (the template + CI will guide you).

## 📄 License

[ISC](./LICENSE) © Afran Usmani

<div align="center">

Built with ❤️ by [Afran Usmani](https://www.linkedin.com/in/afranusmani), Software Engineer

</div>
