# Talking Agent (text-only)

Two separate personas — Aria (20F) and Kai (20M) — each with their own chat history. Switching personas never mixes their conversations.

## Files
- `index.html`, `style.css`, `app.js` — frontend
- `server/index.js` — backend proxy that holds your API key
- `.env.example` — copy to `.env` and fill in your real key (never commit `.env`)
- `.gitignore` — excludes `.env` and `node_modules` from git

## Safe for public GitHub
The frontend (`app.js`) calls `/api/chat` on your own server — it never talks to Anthropic directly and never contains a key. Your real key only ever lives in `.env` on the server, which `.gitignore` excludes from the repo.

Before pushing to GitHub:
1. Confirm `.env` is not tracked: `git status` should not list it.
2. Only `.env.example` (placeholder text, no real key) should be committed.

## Running it locally
```
cp .env.example .env
# edit .env, add your real ANTHROPIC_API_KEY
npm install
npm start
```
Then open `http://localhost:3000`.

## Deploying
Deploy `server/index.js` to any Node host (Render, Railway, Fly.io, etc.) and set `ANTHROPIC_API_KEY` as an environment variable in that host's dashboard — not in the code.
<img width="956" height="446" alt="Screenshot 2026-08-15 011329" src="https://github.com/user-attachments/assets/e7301c7a-8cf5-4f24-bba9-cce8e0c2ad2e" />

