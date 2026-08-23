# AstraNote

> Write it down. Find it whenever you need it.

AstraNote is a bilingual, responsive online notebook built with Node.js and
Express. It provides optional AES-GCM encryption, revocable read-only sharing,
strict per-account storage limits, and server-verified CAPTCHA protection for
security-sensitive actions.

## Highlights

- English and Traditional Chinese across the complete interface
- Animated, scroll-reactive starfield landing page
- Dark and light themes synchronized to signed-in accounts
- Plain-text lined note reader and editor
- No encryption, AES-256-GCM, or AES-128-GCM chosen at note creation
- 48-note and 256 KiB full-account-directory limits
- Unguessable, revocable, `noindex` read-only sharing links
- Argon2id password hashing and server-managed authenticated sessions
- CSRF, Origin, ownership, request-size, rate-limit, and security-header controls
- Layered IP, username, account, note-write, sharing, and public-read rate limits
- Human verification with mandatory server-side `/api/siteverify` validation
- Seven-day account-deletion reversal period and a two-month manual-erasure deadline
- Locally served Font Awesome; no font, analytics, or advertising CDN

## Project structure

```text
AstraNote/
├── asset/              # logo and local asset declarations
├── data/               # runtime data; mounted persistently and ignored by Git
├── public/             # HTML, CSS, and browser JavaScript
├── server.js           # Express server and all backend routes
├── package.json
├── LICENSE
└── NOTICE
```

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm start
```

Open `http://localhost:3000`.

## Zeabur deployment

1. Deploy this repository as a Node.js service.
2. Mount `data/` on a persistent volume. Alternatively point `DATA_DIR` at the
   mounted directory.
3. Zeabur supplies `PORT`; AstraNote reads `process.env.PORT` automatically.
4. Set one long random `ASTRANOTE_SECRET` in production. This is the only
   recommended custom environment variable. If omitted, AstraNote creates a
   secret file in the persistent data directory; losing that file makes
   existing encrypted notes unreadable.
5. Route both `https://astranote.nxlabtw.com` and
   `https://astranote.zeabur.app` to the service.

Do not deploy without persistent storage. Redeploying against an ephemeral
`data/` directory can lose all accounts and the encryption secret.

## Runtime files

At first launch the server creates:

```text
data/
├── .server-secret
├── users.txt
├── onlineToday.txt
├── onlineTodayUsers.json
├── sessions.json
├── shares.json
├── deletes.json
└── {username}/
    ├── metadata.json
    └── notes/{id}.json
```

Never publish runtime data. It can contain email and IP addresses, password
hashes, sessions, note content, and encrypted material.

### Manual account erasure

`deletes.json` records `requestedAt`, `reversibleUntil`, `lockedAt`, `eraseBy`,
and `status`. Once the seven-day reversal window has passed, the user cannot
sign in. The administrator must permanently remove the matching
`data/{username}/` directory no later than `eraseBy`, then remove the matching
entry from `deletes.json`. Review `shares.json` and `sessions.json` as a safety
check, although the application revokes both when the request is created.

Username and email may be registered again only after the entire account
directory and deletion entry no longer exist.

## Security notes

- CAPTCHA success in the browser is never trusted. The backend submits the
  16-character verification ID and 64-character one-time token to
  `https://nexacaptcha.nxlabtw.com/api/siteverify` and proceeds only when the
  response is exactly `success: true`.
- AES-GCM keys are derived from the server secret, username, note ID, and key
  size. Encryption is server-managed, not end-to-end or zero-knowledge.
- Main and backup domains use separate browser cookies. A user may sign into
  both with the same account.
- The repository intentionally contains no credential, user database, or
  production `.env` file.
- No application can guarantee the absence of every vulnerability. Keep Node.js
  and dependencies updated, protect the persistent volume, monitor resource
  usage, and review security reports responsibly.

## Licence

Repository source code is licensed under the [Apache License 2.0](LICENSE).
AstraNote and NeuralNexusLab names, logos, service data, user content, and
third-party materials are not granted as trademarks or user content by that
licence. See [NOTICE](NOTICE).

Copyright 2026 NeuralNexusLab.
