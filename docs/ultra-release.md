# Ultra release and storage format

## Entitlements

| Plan  | Account storage | Active notes | BTC / 30 days |
| ----- | --------------: | -----------: | ------------: |
| Free  |          128 KB |           20 |          Free |
| Plus  |          256 KB |           50 |      0.000025 |
| Pro   |          512 KB |     Infinity |      0.000060 |
| Ultra |         1024 KB |     Infinity |      0.000125 |
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

Plus, Pro, Ultra and Admin can pin/unpin, archive/unarchive, and apply operations to
at most 100 selected notes per request. Folders and tags are retired: legacy
classification fields are removed when account metadata is next saved, without
deleting note content. Every plan can search titles locally on the loaded list.
Normal view includes all unarchived notes and pinned notes, even when archived;
pins sort first. Explicit pinned/archive filters narrow that view. Archived
notes still count toward note count and storage. Changing organization requires
Plus or above, but existing classifications remain visible after downgrade.

Ultra and Admin save exactly one previous version inside the current note JSON.
A save replaces this snapshot; it never nests snapshots. Saving preflights the
combined size before replacing the file atomically. Client saves carry a
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

The client generates a fresh 256-bit content key for every new note using Web
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
entropy. A compromised client, extension, device, or delivered page script can
steal plaintext/PIN during use. The protocol is tested, not independently
audited; do not promise invulnerability or absolute superiority over other
trust models. Titles remain plaintext.

References: [Web Crypto](https://www.w3.org/TR/WebCryptoAPI/),
[hash-wasm](https://github.com/Daninet/hash-wasm).

## Compact payment ledger

Payment records now use `data/orders.sqlite`, not a rewritten global JSON
array. There is no external database service or extra environment setting.
The ledger uses Node.js 24's built-in SQLite, with `engines.node` pinned to
`24.x` for Zeabur. It no longer depends on a separately installed SQLite
native addon. Existing SQLite files, account bindings, fulfilment receipts and
coupon reservations retain the same schema and need no conversion or reset.
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

### Coupon redemption limit

From the coupon-limit release onward, each account may redeem a given coupon
once, except for the operator-designated reusable code. Identity comes only from
the authenticated Satora status response's `coupon.code`, trimmed and uppercased;
client-supplied coupon fields are never trusted. A missing or invalid identity
on a discounted payment fails verification without consuming a redemption.

SQLite retains only a 32-byte code digest, account-incarnation ID and first
order ID in `coupon_redemptions`. A unique account/digest key is reserved after
payment validation and before crediting. Retrying the same order is idempotent
across restarts and crash windows; another order is marked `coupon_reused` with
no plan time added. The charged amount and paid timestamp remain available for
support. This local rejection does not reverse Satora's successful payment and
does not issue a refund. Checkout and terms warn about this rule in all locales.

Older compact records lack coupon identities, so historic redemptions cannot be
reconstructed from those records alone; the limit is not retroactive. The
operator exemption is matched by digest, not published in plaintext in source
or the UI. For private exception integration tests, supply the code via
`ASTRANOTE_TEST_REUSABLE_COUPON` to the test process only; production needs no new
environment variable.

The Satora response shape was confirmed with one isolated, fully discounted
test invoice on 2026-09-05: `coupon` contained `code`, `type`, `value`; `status`
was `paid`, `price` and `received_sats` were 0, and `acceptance_policy` was
`coupon`. No Bitcoin was transferred and no production account was credited.
Coupon-release QA passed 47 automated tests (including the privately supplied
exception code) and checked all three locales at the eight viewport sizes below.

## Verification

SQLite startup fix (2026-09-05): a clean `npm ci --ignore-scripts` installation
passed all 49 tests with the private reusable-coupon test enabled. Production-mode
startup returned HTTP 200 for `/api/health`, `/` and `/plans` using isolated data.
A database created with the previous driver was opened, updated and integrity
checked with built-in SQLite, then reopened by the previous driver; paid records,
checkout identities and coupon claims were preserved. A regression test also
starts the standalone ledger with all non-builtin dependency imports rejected.

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
Dark/light layouts, mobile-menu close, legacy organization, batch organization,
and AstraZero unlock/edit/save/reopen/encrypted-previous-version flows were
checked with isolated preview data. This is functional QA, not an independent
cryptographic audit or a real Satora payment settlement test.

## Notes redesign and expiry locks (2026-09-05)

Paid plan cards are Plus, Pro, Ultra in one desktop row, with Pro emphasized;
Free is an included panel below. Settings use a full-width plan panel followed
by paired preferences, one Save button outside the preference panels at the
bottom right, and priority assistance last inside the plan panel. Selection
uses direct pin/archive/delete buttons beside Select all, not an action picker.
Plans, checkout, settings and the three-language terms disclose expiry locking.
AstraZero is described as client-generated, PIN-protected per-note keys with no
reliance on server encryption environment variables—not as a key that never
exists or an invulnerability guarantee. Plan eligibility is unchanged.

Follow-up choices: organization is now included in Plus as well as Pro, Ultra
and Admin; AstraZero remains Pro and above, and recovery remains Ultra/Admin.
Ultra storage is 1024 KB (1,024,000 bytes), with its existing BTC price unchanged.
The plan comparison lists organization before AstraZero. Monthly price cards
also show approximate US$2 / US$5 / US$10, using a disclosed, fixed illustrative
US$80,000/BTC rate, not a live feed or a dollar-denominated checkout. No external
exchange-rate service is called. Review these estimates when prices change.
The compact AstraZero note links to the home encryption section, not privacy.

Storage locks include trash, largest first; count-only overage never locks
trash merely to reduce active count. Locked rows provide title, size, status
and deadlines, deletion and upgrade. Backend routes deny content/ciphertext,
decryption factors, edits, sharing (including old links), pin/archive changes,
trash movement/restoration, and previous-version access/restoration. An upgrade
only unlocks what fits its new allowance; trash retains its original expiry.
Client copies already downloaded/decrypted cannot be recalled.

New integration coverage expires real entitlements, verifies denied routes
leave files intact, fulfills an isolated mocked payment through the billing
routes, and checks unlock plus original AES plaintext/previous-version
recovery. Every legacy/current client format retains its ciphertext and
derivation parameters through lock/unlock. Locked trash and CAPTCHA-protected
permanent deletion are exercised. Pure UI tests cover search, sorting,
filters, plan order, support placement, legal locales and translated warnings.

The unified settings endpoint persists theme, language, public display name and
eligible trash retention together. Retention validation was moved from the
legacy deletion-cancellation route to settings; changing it leaves existing
trash deadlines unchanged. Expired plans cannot update the retention policy.

After the status endpoint confirms both `paid` and `fulfilledAt`, the return
page reloads once to refresh account entitlements and navigation. A per-order
history-state marker prevents reload loops; blocked history falls back to the
clean plans URL. Pending, unverified and coupon-rejected payments never trigger
this refresh or any client-side crediting.

Final redesign QA: 63 automated tests pass with no skips (including the private
coupon exception). Plan cards in EN, Traditional Chinese and Japanese were
rechecked at all eight viewport sizes above with no horizontal overflow and
46px-high purchase buttons. Settings were saved and reloaded with all four
preferences retained; the sole Save button stays outside the panels and at
least 48px high at every tested width. Home encryption wording, comparison-row
alignment, direct batch actions, dark/light layouts and the home-section link
were inspected in isolated browser previews, without changing production data.
Existing Ultra accounts receive the 1024 KB allowance from the backend too;
an integration fixture above that reduced allowance is locked without changing
its note file. Restarting the original local preview also confirmed 1024 KB
on both open dashboard tabs, rather than only changing the plan-card wording.
