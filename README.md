# AstraNote

> Write it down. Find it whenever you need it.

AstraNote is a bilingual, responsive online notebook built with Node.js and
Express. It provides optional authenticated encryption, a client-side
AstraConfidential SCHybrid mode, revocable read-only sharing, strict
per-account storage limits, and server-verified CAPTCHA protection for
security-sensitive actions.

## Highlights

- English and Traditional Chinese across the complete interface
- Animated, scroll-reactive starfield landing page
- Dark and light themes synchronized to signed-in accounts
- Plain-text lined note reader and editor
- No encryption, AES-128-GCM, AES-256-GCM, or AstraConfidential SCHybrid chosen at note creation
- Every encrypted mode protects note content; titles remain plaintext for identification
- 20-note and 200 KiB full-account-directory limits
- Unguessable, revocable, `noindex` read-only sharing links
- Argon2id password hashing and server-managed authenticated sessions
- CSRF, Origin, ownership, request-size, rate-limit, and security-header controls
- Layered IP, username, account, note-write, sharing, and public-read rate limits
- Human verification with mandatory server-side `/api/siteverify` validation
- Immediate permanent account deletion after username, password, and CAPTCHA confirmation
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
4. Set long, independent `ASTRANOTE_SECRET` and
   `ASTRANOTE_VAULT_SECRET` values in production. If `ASTRANOTE_SECRET` is
   omitted, AstraNote creates a secret file in the persistent data directory.
   SCHybrid stays unavailable when `ASTRANOTE_VAULT_SECRET` is missing.
5. Generate the SCHybrid secret with:
   `node -e "console.log(require('node:crypto').randomBytes(64).toString('base64url'))"`
6. Route both `https://astranote.nxlabtw.com` and
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

`deletes.json` is retained only for compatibility with deletion requests made
by older versions. New deletions immediately remove the account directory,
sessions, and share mappings. A username or email can be registered again only
after no matching account directory remains.

## Security notes

- CAPTCHA success in the browser is never trusted. The backend submits the
  16-character verification ID and 64-character one-time token to
  `https://nexacaptcha.nxlabtw.com/api/siteverify` and proceeds only when the
  response is exactly `success: true`.
- AES-GCM note content is encrypted with keys derived from the server secret,
  username, note ID, and key size. Titles remain plaintext. These AES modes are
  server-managed, not end-to-end or zero-knowledge.
- AstraConfidential SCHybrid encrypts note content in the browser with
  AES-256-GCM. Its Argon2id-derived browser key combines the user's 4–6 digit
  Vault PIN with a temporary server factor bound to the account, note, password
  hash, and independent `ASTRANOTE_VAULT_SECRET`. Titles remain plaintext so
  note lists can identify them. The server stores no PIN or
  final browser key, and SCHybrid notes cannot be shared. It is server-assisted
  encryption rather than a zero-knowledge design: the web application and
  factor endpoint must still be trusted while the note is unlocked.
- Losing a Vault PIN or either production secret can make encrypted notes
  permanently unreadable. Keep both environment secrets stable and backed up
  outside the application data volume.
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
