# Runtime data

This directory is intentionally excluded from Git. AstraNote creates counters,
sessions, deletion requests, payment orders, server secrets, and one directory per account at
runtime. On Zeabur, mount this directory (or `DATA_DIR`) on persistent storage.

Payment records use `orders.sqlite`. Existing `orders.json` entries migrate
automatically on startup and the JSON representation is cleared only after
successful migration. Back up the data before upgrading; a JSON-only release
cannot read new SQLite orders. Keep the SQLite database and any recovery journal
together; do not delete them to reclaim space.

`onlineToday.txt` counts unique signed-in accounts that made a request during
the current UTC day, rather than only accounts that performed a login action.

Never commit its runtime contents: they can contain password hashes, email
addresses, IP addresses, encrypted or plain-text notes, and session records.
