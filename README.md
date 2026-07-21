<div align="center">

# ⚡ InShort Top News

**Top headlines, summarized into crisp cards — fast, free, and production-ready.**

[![Live](https://img.shields.io/badge/live-inshort--top--news.vercel.app-ff5436)](https://inshort-top-news.vercel.app)
[![Node](https://img.shields.io/badge/node-%3E%3D18-3c873a)](https://nodejs.org)
[![Express](https://img.shields.io/badge/express-4-000000)](https://expressjs.com)
[![Deploy](https://img.shields.io/badge/deploy-vercel-000000)](https://vercel.com/new/clone?repository-url=https://github.com/AfranUsmani/Inshort-Top-News&env=API_KEY)
[![License](https://img.shields.io/badge/license-ISC-blue)](#license)

[**Live demo →**](https://inshort-top-news.vercel.app)

</div>

---

InShort Top News fetches top headlines from [NewsAPI](https://newsapi.org), condenses
each story into a short "in-short" card, and tags them by category — all on **free
resources, no paid services, and no keys beyond a free NewsAPI one**.

## ✨ Features

- 🌍 **Global** — browse top stories worldwide or by country (India, US, UK,
  Canada, Australia, UAE, Singapore, Germany, France, Japan, China), plus
  keyword **search**.
- ✂️ **Auto-summarized cards** — each story trimmed to a crisp snippet (local, free).
- 🏷️ **Category chips** — instant client-side filtering (Business, Tech, Sports, …).
- 🌗 **Responsive + dark-mode** editorial UI, no front-end framework.
- 🛡️ **Production-grade**: response caching (protects the free NewsAPI quota),
  security headers (Helmet), request logging, `/healthz` check, graceful
  fallbacks, and a styled 404 page.

## 🖼️ Preview

> **[View the live app →](https://inshort-top-news.vercel.app)**

```
┌────────────────────────────────────────────────────────────┐
│  ⚡ InShort  ● Live            [ Search world news…  ][🔍]  │
├────────────────────────────────────────────────────────────┤
│  Top stories in India                                      │
│  ● 60 stories · auto-summarized · updated live            │
│  [ All ][ Business ][ Technology ][ Sports ][ Science ]…   │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐              │
│  │  [image]  │  │  [image]  │  │  [image]  │              │
│  │ BUSINESS  │  │ SCIENCE   │  │ SPORTS    │              │
│  │ Headline… │  │ Headline… │  │ Headline… │              │
│  │ summary…  │  │ summary…  │  │ summary…  │              │
│  │ Read →    │  │ Read →    │  │ Read →    │              │
│  └───────────┘  └───────────┘  └───────────┘              │
└────────────────────────────────────────────────────────────┘
```

## 🧱 Tech stack

**Node.js · Express · EJS · axios · Helmet · morgan.**
Deploys to Vercel (serverless) or any Node host — a `Procfile` is included.

## 🚀 Quick start

```bash
git clone https://github.com/AfranUsmani/Inshort-Top-News.git
cd Inshort-Top-News
npm install

cp .env.sample .env          # then add your free NewsAPI key
npm run dev                  # http://localhost:5000
```

Get a free key at **[newsapi.org/register](https://newsapi.org/register)**.

| Script          | Does                                    |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start with live reload (nodemon)        |
| `npm start`     | Start the production server (`node`)    |

## 🔐 Environment variables

| Variable  | Required | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| `API_KEY` | ✅       | NewsAPI key — free at newsapi.org/register          |
| `PORT`    | —        | Local port (default `5000`)                         |

## 🗺️ Routes

| Method | Path            | Description                                  |
| ------ | --------------- | -------------------------------------------- |
| `GET`  | `/`             | Top stories for the default region (world)   |
| `GET`  | `/?region=us`   | A specific country's feed                     |
| `GET`  | `/?q=bitcoin`   | Keyword search (takes priority over region)   |
| `GET`  | `/healthz`      | Health check → `{ "status": "ok" }`          |

## 📁 Project structure

```
app.js                 Express app: security, logging, static, routes
api/index.js           Vercel serverless entry (re-exports the app)
src/
  routes/news.js       GET / (top news) and POST / (search)
  services/news.js     fetch + cache + summarize + categorize
  views/               EJS templates + partials
public/                css, js, favicon (served statically)
```

## ☁️ Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AfranUsmani/Inshort-Top-News&env=API_KEY)

1. Click **Deploy** (or import the repo at [vercel.com](https://vercel.com), free Hobby tier).
2. Add the `API_KEY` environment variable.
3. Ship it. `vercel.json` routes all traffic to the Express app and bundles the
   views; every push to `master` auto-redeploys.

Any Node host works too — set `API_KEY` and run `npm start` (the `Procfile` uses
`node app.js`).

## 📌 Notes

- NewsAPI's free "Developer" plan is dev-oriented and capped at ~100 requests/day.
  The built-in **10-minute response cache** keeps usage well under that. For heavy
  production traffic, upgrade the NewsAPI plan or switch the source to RSS feeds
  (free, unlimited, no key).
- `top-headlines?country=in` currently returns no sources on NewsAPI, so the
  homepage uses the `/everything` endpoint sorted by most recent.

## 📄 License

ISC.
