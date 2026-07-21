# Contributing

Thanks for your interest in improving **InShort Top News**! Contributions of all
sizes are welcome.

## Getting set up

```bash
git clone https://github.com/AfranUsmani/Inshort-Top-News.git
cd Inshort-Top-News
npm install
npm run dev      # http://localhost:5000 — no API key needed
```

Node **22.x** is recommended (see `.nvmrc`): `nvm use`.

## Tests

Unit tests use Node's built-in test runner (no dependencies):

```bash
npm test
```

Please add or update tests for any logic change. CI runs `npm test` on every
push and pull request.

## Code style

- 4-space indentation (2 for JSON/YAML) — see `.editorconfig`.
- Keep it dependency-light and framework-free; hand-authored CSS + vanilla JS.
- The app must run with **zero configuration** (no API keys).

## Pull requests

1. Branch from `master` (`feat/…`, `fix/…`, or `chore/…`).
2. Make the change, run `npm test`, and check the Vercel preview on your PR.
3. Fill in the PR template and open the pull request.

## Reporting issues

Use the issue templates for bugs and feature requests.
