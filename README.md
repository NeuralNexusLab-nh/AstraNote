# AstraNote

Copyright © 2026 NXLabTW. All Rights Reserved. This is proprietary
software; see [LICENSE](LICENSE).

> Write it once. Find it fast.

AstraNote is a multilingual, responsive online notebook built with Node.js and
Express. It provides optional authenticated encryption, a client-side
AstraConfidential mode, revocable read-only sharing, strict
per-account storage limits, and server-verified CAPTCHA protection for
security-sensitive actions.

## Highlights

- English, Traditional Chinese, and Japanese across the application interface
- Animated, scroll-reactive starfield landing page
- Dark and light themes synchronized to signed-in accounts
- Safe Markdown note reader and editable source; remote images and raw HTML are disabled.
- Up to three PNG/JPEG/WebP images per note. Three local compression presets
  balance storage and detail without a separate quality control. Images share note storage
  and encryption, use note-local `{img_<id>}` references, and support local drawing.
- Astra Agent revises titles and content with a preview-first workflow, including
  selected notes; PIN-protected notes are unlocked before entering an instruction.
- AstraPass creates one expiring account for one existing note. Saved edits update
  the original note; expiry immediately ends access without deleting the note.
  Concurrent limits: Free 2, Plus 10, Pro 25, Ultra 100, Beta/Admin unlimited.
  Downgrades prevent new grants above the limit but do not revoke existing grants.
- Beta storage is 10 MB (10,000,000 bytes); Admin has no storage limit.
- Astra Agent uses GPT-6-Luna with Flex first and retryable failures falling back
  to Standard on every plan. Standard token rates are twice Flex rates. Monthly
  internal budgets (30 days): Free $0.05, Plus $0.50, Pro $1, Ultra $2.50, Beta $5,
  Admin unlimited. Only percentages are shown in the interface.
- Selected image analysis returns allowlisted drawing/adjustment commands,
  never executable code or image-generation requests. Preview before saving.
- Free (128 KB/20 notes), Plus (256 KB/50 notes), Pro (512 KB/Infinity notes), and Ultra (1024 KB/Infinity notes)
- Independent Ultra, Pro and Plus balances, consumed in that order; one month is always 30 days
- Plus/Pro/Ultra note organization: pins, archive and batch actions; title search for every plan
- Ultra: 0/1/3/5/10/20 saved versions (default 3), reverse text differences only.
  Restoring text preserves current images, captions and drawings. Images do not
  have version history. Configurable trash retention (default 7 days),
  all included in storage. Client-encrypted history uses the note's content key;
  legacy text-only notes and full snapshots remain readable.
- Satora Bitcoin checkout with server-side status verification, validated coupon
  totals, and idempotent fulfilment
- Compact, indexed SQLite payment records: completed orders retain only the ownership,
  product, amount, Satora reference, status, timestamps, and optional TXID needed
  for audit and idempotent fulfilment. New-order requests are limited per account
  and IP, with a persistent six-new-orders-per-hour account check and a 2.4 GB
  database hard limit (new orders stop earlier to reserve update space).
- Payment history is deleted 90 days after order creation. Cleanup runs at startup
  and hourly in small batches; old records are immediately excluded from history
  and verification even between cleanup runs. Already credited plan balances are
  stored separately and remain valid. Minimal coupon-redemption receipts remain
  to prevent reuse. Save receipts before the retention period ends.
- Billing history verifies recent unresolved invoices and routes payment actions
  through a fresh status check. Failed/expired invoices never offer a payment link;
  failed verification or a provider outage never grants subscription time.
- No encryption, AES-256-GCM, AstraSecret, AstraConfidential, or client-only AstraZero at note creation; legacy AES-128 notes remain readable
- New encrypted notes protect both content and titles; title storage uses a separate AES-256-GCM envelope while authenticated owners can still list and search titles
- Server-enforced overage locks and permanent deletion after 30 continuously locked days
- Capacity for up to 70,000 registered accounts
- Unguessable, revocable, `noindex` read-only sharing links
- Argon2id password hashing and server-managed authenticated sessions
- Email verification unlocks the full Free allowance; verified accounts can
  reset a password and optionally require a single-use email code after a
  correct password. Verification links and codes expire after ten minutes.
  The service-wide email delivery limit is 100 messages per UTC day.
- CSRF, Origin, ownership, request-size, rate-limit, and security-header controls
- Layered IP, username, account, note-write, sharing, and public-read rate limits
- Human verification with mandatory server-side `/api/siteverify` validation
- Immediate permanent account deletion after username, password, and a
  single-use email code confirmation
- Locally served Font Awesome; no font, analytics, or advertising CDN

## Project structure

```text
AstraNote/
├── asset/              # logo and local asset declarations
├── data/               # runtime data; mounted persistently and ignored by Git
├── public/             # HTML, CSS, and client JavaScript
├── server.js           # Express server and all backend routes
├── package.json
└── LICENSE
```

## Run locally

Requires Node.js 24.x, including its built-in SQLite module. The package engine
setting selects this runtime on Zeabur; no additional environment variable or
SQLite native-addon build is needed.

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
├── orders.sqlite       # indexed, compact payment ledger
├── orders.json         # legacy migration source; cleared after migration
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

- CAPTCHA success in the client is never trusted. The backend submits the
  16-character verification ID and 64-character one-time token to
  `https://nexacaptcha.nxlabtw.com/api/siteverify` and proceeds only when the
  response is exactly `success: true`.
- AES-GCM note content is encrypted with server-managed keys. New notes use the
  versioned `*-new` formats and `ASTRA_CONFIDENTIAL_KEY`; legacy AES formats
  continue using `ASTRANOTE_SECRET`. The visible labels remain AES-128-GCM and
  AES-256-GCM. New encrypted-note titles are stored separately in an
  AES-256-GCM envelope and returned only to authenticated account requests for
  list display and title search; this is not zero-knowledge title protection.
- AstraConfidential encrypts note content in the client with AES-256-GCM. Its
  current version uses a case-sensitive 4–16 character PIN of printable ASCII
  letters, numbers, and symbols and is available for new notes on Plus, Pro and Ultra.
  Notes created while an earlier release allowed a longer PIN remain unlockable
  with their original PIN.
  A memory-hard client derivation combines the PIN with
  account-bound server protection. The server stores neither the PIN nor the
  final client key, and AstraConfidential notes cannot be shared. This is
  server-assisted client encryption rather than a zero-knowledge design: the
  web application and factor endpoint must still be trusted while a note is
  unlocked.
- Existing AstraConfidential SCHybrid notes retain their original encryption
  identifier, 4–6 digit PIN rule, and `ASTRANOTE_VAULT_SECRET` derivation. They
  remain readable and editable but are no longer offered for new notes.
- AstraSecret uses a 4–6 digit PIN and the same client/server trust boundary,
  with an independently domain-separated derivation. It is intended for
  convenient everyday protection, not high-entropy secret storage.
- Losing a PIN or a required production secret can make encrypted notes
  permanently unreadable. Keep all three environment secrets stable and backed
  up outside the application data volume.
- Main and backup domains use separate client cookies. A user may sign into
  both with the same account.
- The repository intentionally contains no credential, user database, or
  production `.env` file.
- No application can guarantee the absence of every vulnerability. Keep Node.js
  and dependencies updated, protect the persistent volume, monitor resource
  usage, and review security reports responsibly.

## Ultra upgrade

See [the release and storage notes](docs/ultra-release.md) for exact prices,
feature eligibility, restore/expiry rules, AstraZero protocol and its limits,
ledger migration and capacity safeguards. AstraZero needs **no new environment
variable**. Keep all existing production encryption secrets unchanged. Back up
the persistent volume before deploying this format migration; a JSON-only
rollback cannot read orders created in SQLite.

## File-backed performance and compatibility

Account metadata, sessions and note JSON files remain authoritative. A hashed
email lookup is rebuilt at startup from account files; registration and deletion
update it immediately. `.indexes/notes/` contains disposable note summaries,
actual file sizes, encrypted titles and image counts, never content, image bytes,
PINs or content keys. Missing or invalid indexes rebuild from the originals.
Unchanged note files are checked by file size and modification time rather than
loading their images or history for every list. Do not restore only an index:
restore the original data directory. After manually changing account email files,
restart the service to rebuild the lookup.

Session activity writes are coalesced to one minute; validity, bans and revocation
are still checked on every authenticated request. Repeated statistics reads avoid
rewriting unchanged daily records. New daily visitors append a small durable
journal event, then snapshots are compacted in batches; restarts replay the
journal without double counting. An account allows one Agent request at a time;
the external AI wait releases its account lock, and completion reloads current
metadata before charging usage. Plan cleanup yields in batches and sends notices
outside account locks. Image decoding permits two active jobs with at most eight
waiting jobs and a ten-second queue deadline.

Images count toward both storage and the plan's image allowance: Free 15,
Plus/Education 50, Pro 150, Ultra 500, Beta/Admin unlimited, including trash.
Existing over-limit images are retained; increases are rejected. Old PIN-encrypted
files disclose their attachment count only on the next owner unlock or save;
their original encryption, PINs and contents are not rewritten by indexing.
Stored timestamps stay UTC. Display uses the device timezone; a validated IANA
timezone identifier may be saved for account emails. No new environment variable
is required.

Run `node scripts/load-test.cjs --accounts=1000 --requests=200 --concurrency=8`
for isolated synthetic login/list/save/image workloads. It creates only OS-temporary
fixtures, blocks external services, records percentiles, CPU/RSS and errors, then
removes its test data. See [the measured performance report](docs/performance-update.md).

## Licence

Repository source code is proprietary and protected by [All Rights Reserved](LICENSE).
AstraNote and NXLabTW names, logos, service data, user content, and
third-party materials are not granted as trademarks or user content by that
licence.

Copyright 2026 NXLabTW.
