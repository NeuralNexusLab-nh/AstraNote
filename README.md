# AstraNote

> Write it down. Find it whenever you need it.

AstraNote is a multilingual, responsive online notebook built with Node.js and
Express. It provides optional authenticated encryption, a client-side
AstraConfidential mode, revocable read-only sharing, strict
per-account storage limits, and server-verified CAPTCHA protection for
security-sensitive actions.

## Highlights

- English, Traditional Chinese, and Japanese across the application interface
- Animated, scroll-reactive starfield landing page
- Dark and light themes synchronized to signed-in accounts
- Plain-text lined note reader and editor
- Free (128 KB/20 notes), Plus (256 KB/50 notes), and Pro (512 KB/no separate note-count limit)
- Independent Plus and Pro day balances; Pro is consumed first and one month is always 30 days
- Satora Bitcoin checkout with server-side status verification and idempotent fulfilment
- No encryption, AES-128-GCM, AES-256-GCM, AstraSecret, or AstraConfidential at note creation
- Every encrypted mode protects note content; titles remain plaintext for identification
- Server-enforced overage locks and permanent deletion after 30 continuously locked days
- Capacity for up to 75,000 registered accounts
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
4. Keep the existing `ASTRANOTE_SECRET` and `ASTRANOTE_VAULT_SECRET` values
   unchanged so legacy AES and SCHybrid notes remain readable. If
   `ASTRANOTE_SECRET` is omitted, AstraNote creates a secret file in the
   persistent data directory.
5. Set a new, independent `ASTRA_CONFIDENTIAL_KEY`. Newly created AES and
   AstraConfidential notes use versioned, domain-separated keys derived from
   this value. Generate it with:
   `node -e "console.log(require('node:crypto').randomBytes(64).toString('base64url'))"`
6. Route both `https://astranote.nxlabtw.com` and
   `https://astranote.zeabur.app` to the service.
7. Set the server-only `SATORA_API_KEY`. AstraNote connects only to
   `https://satora.nxlabtw.com`. Allow the exact return origin
   `https://astranote.nxlabtw.com` in Satora.

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
├── orders.json
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
- AES-GCM note content is encrypted with server-managed keys. New notes use the
  versioned `*-new` formats and `ASTRA_CONFIDENTIAL_KEY`; legacy AES formats
  continue using `ASTRANOTE_SECRET`. The visible labels remain AES-128-GCM and
  AES-256-GCM. Titles remain plaintext, and these modes are not end-to-end or
  zero-knowledge.
- AstraConfidential encrypts note content in the browser with AES-256-GCM. Its
  current version uses a case-sensitive 4–16 character PIN of printable ASCII
  letters, numbers, and symbols and is available for new notes on Plus and Pro.
  Notes created while an earlier release allowed a longer PIN remain unlockable
  with their original PIN.
  A memory-hard browser derivation combines the PIN with
  account-bound server protection. The server stores neither the PIN nor the
  final browser key, and AstraConfidential notes cannot be shared. This is
  server-assisted browser encryption rather than a zero-knowledge design: the
  web application and factor endpoint must still be trusted while a note is
  unlocked.
- Existing AstraConfidential SCHybrid notes retain their original encryption
  identifier, 4–6 digit PIN rule, and `ASTRANOTE_VAULT_SECRET` derivation. They
  remain readable and editable but are no longer offered for new notes.
- AstraSecret uses a 4–6 digit PIN and the same browser/server trust boundary,
  with an independently domain-separated derivation. It is intended for
  convenient everyday protection, not high-entropy secret storage.
- Losing a PIN or a required production secret can make encrypted notes
  permanently unreadable. Keep all three environment secrets stable and backed
  up outside the application data volume.
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
