# Ultra release and storage format

## Entitlements

| Plan  | Account storage | Active notes | BTC / 30 days |
| ----- | --------------: | -----------: | ------------: |
| Free  |          128 KB |           20 |          Free |
| Plus  |          256 KB |           50 |      0.000025 |
| Pro   |          512 KB |     Infinity |      0.000060 |
| Ultra |            2 MB |     Infinity |      0.000125 |
| Admin |        Infinity |     Infinity |  Not for sale |

KB and MB are decimal (1,000 / 1,000,000 bytes). Every file in the account
directory counts, including metadata, ciphertext overhead, one previous version
and trash. Infinity note counts remain bounded by storage and request limits.
Individual content submissions retain a 2,048,000-byte safety limit, including
Admin; this is not an unlimited request-body allowance.

Ultra time is consumed before Pro and Plus; lower balances pause. One month is
30 days; choices are 1, 3, 6, 9, 12, 24 and 36 months with no discount or automatic
renewal. Existing client-encrypted notes remain editable after downgrade, unless
backend overage locking applies. New AstraConfidential requires Plus or above;
new AstraZero requires Pro or above.

## Organization and recovery

Pro, Ultra and Admin can pin notes, assign a flat folder label and up to eight
tags, archive notes, and apply operations to at most 100 selected notes per
request. Folder and tag names are unencrypted metadata, never filesystem paths.
Archived notes count toward note count and storage and remain accessible via
the archive filter after downgrade; changing organization requires Pro or above.

Ultra and Admin save exactly one previous version inside the current note JSON.
A save replaces this snapshot; it never nests snapshots. Saving preflights the
combined size before replacing the file atomically. Browser saves carry a
revision to detect conflicting edits. Restoring replaces the current title and
content and clears the snapshot (no unlimited undo/redo chain). Encrypted
snapshots retain ciphertext and their original format.

Manual deletion by Ultra/Admin moves unlocked notes to trash using their
existing metadata reference, with a fixed deletion timestamp and expiry.
Retention choices: 1, 3, 7, 14, 30 days; default 7. Settings changes only affect
future deletions. Trash counts toward storage, not active note count. Shared
links are revoked immediately and never re-enabled by restoration.

Trash and previous-version access/restore checks are server-side, owner scoped
and blocked for locked or trashed active-note routes. After expiry of Ultra,
new snapshots/trash entries stop, but existing unexpired trash and versions may
still be restored within current storage and count limits. System overage
deletions after 30 days bypass trash. Scheduled cleanup runs hourly and on
account/note access; expiry immediately prevents restoration even between runs.
These facilities do not replace independent backups.

## AstraZero v1

Identifier: `astra-zero-v1`. No additional environment variable.
Existing AES/AstraSecret/AstraConfidential/legacy SCHybrid secrets are unchanged.

The browser generates a fresh 256-bit content key for every new note using Web
Crypto. It encrypts UTF-8 JSON content with AES-256-GCM (random 96-bit IV,
128-bit tag). The content key is wrapped with AES-256-GCM under a key derived
from the user PIN and a fresh 32-byte random salt using Argon2id
(v1 parameters: 98,304 KiB memory, 4 iterations, parallelism 1, 32-byte output).
These fixed parameters are protocol-versioned, not controlled by untrusted
ciphertext. Each wrap and content encryption has its own fresh IV and
purpose-separated authenticated data containing the owner and note ID.
Subsequent saves unwrap and reuse that note's content key with a new content IV.
Previous versions retain the corresponding wrapped key and encrypted content.

Only salt, wrapped key, IVs/tags, protocol identifier and ciphertext reach the
backend. No server factor request is made. PINs use 4–16 non-space printable
ASCII characters, case sensitive; random 12–16 character values are strongly
recommended. No recovery or sharing is provided for AstraZero.

Security limits: encrypted files permit offline PIN guesses, so a 4-character
PIN is not high-entropy protection. Public identifiers add context, not secret
entropy. A compromised browser, extension, device, or delivered page script can
steal plaintext/PIN during use. The protocol is tested, not independently
audited; do not promise invulnerability or absolute superiority over other
trust models. Titles, folders and tags remain plaintext.

References: [Web Crypto](https://www.w3.org/TR/WebCryptoAPI/),
[hash-wasm](https://github.com/Daninet/hash-wasm).

## Compact payment ledger

Payment records now use `data/orders.sqlite`, not a rewritten global JSON
array. There is no external database service or extra environment setting.
Indexes serve a scoped order ID, checkout attempt, recent history (50 items)
and the durable six-new-orders-per-hour account limit.

Records keep ownership/account incarnation, plan/months/quoted amount, status,
created/paid/fulfilled timestamps, Satora ID, original checkout identity,
optional transaction ID, actual charged amount, and a short failure code.
Completed invoices drop their payment URL. No full API responses, coupon
objects, translated product copy, or duplicate request keys are retained.

The original checkout token remains even after a failed/ambiguous request or
payment, so a retry uses the same Satora idempotency key. Fulfilment uses a
temporary receipt in account metadata to survive a crash before the ledger
commit; the receipt is removed once the durable ledger marks the invoice paid.
Account-incarnation binding prevents reused usernames from accessing or
redeeming a previous account's invoices.

The database has a 2.4 GB hard page limit. New orders stop before 2.2 GB,
including a 64 MB reserve and 4 KB per outstanding invoice. SQLite uses bounded
cache, full synchronization, and DELETE journal mode rather than an unbounded
WAL; ordinary transactions affect one compact record. Keep the overall 3 GB
allocation available for the ledger, recovery journal and migration headroom.
Near capacity, existing verification/updates remain possible but new checkout
is refused. There is no automatic deletion of paid audit records.

At startup, existing `orders.json` records are migrated idempotently; only
after each is present in SQLite is the legacy representation replaced by an
empty array. Migration is bounded to a legacy JSON file of 128 MB; larger
legacy files require an offline migration rather than an unbounded startup
parse. Keep an operator backup before upgrading or attempting a rollback.
Downgrading to a JSON-only release will not see newly created SQLite orders.
Do not delete `orders.sqlite` or change the established encryption secrets.

## Verification

Run `npm ci` and `npm test`. Tests cover plan priority, server-side feature
gating and ownership, ciphertext validation, actual AstraZero round trips,
wrong PIN/context/tampering rejection, one-version replacement, quota rollback,
trash route isolation/expiry/restoration, organization and CAPTCHA checks,
Satora lost-response retry and exactly-once crediting, and ledger capacity.
All tests use temporary data and mocked payment/CAPTCHA providers; no real
payment or production note is changed.

Release checks (2026-09-05): 40 automated tests pass, including recovery from a
crash between entitlement credit and invoice commit. Dependency audit reports
no known vulnerabilities. Edge preview QA covered EN, Traditional Chinese and
Japanese plan comparisons at 1440×900, 1024×768, 768×1024, 430×932, 390×844,
360×740, 320×568 and 844×390 without page-level horizontal overflow. Notes,
dashboard, settings, trash, and the home page were also checked at these sizes.
Dark/light layouts, mobile-menu close, folder filtering, batch organization,
and AstraZero unlock/edit/save/reopen/encrypted-previous-version flows were
checked with isolated preview data. This is functional QA, not an independent
cryptographic audit or a real Satora payment settlement test.
