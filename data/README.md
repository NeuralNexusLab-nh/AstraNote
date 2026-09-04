# Runtime data

This directory is intentionally excluded from Git. AstraNote creates counters,
sessions, deletion requests, payment orders, server secrets, and one directory per account at
runtime. On Zeabur, mount this directory (or `DATA_DIR`) on persistent storage.

`onlineToday.txt` counts unique signed-in accounts that made a request during
the current UTC day, rather than only accounts that performed a login action.

Never commit its runtime contents: they can contain password hashes, email
addresses, IP addresses, encrypted or plain-text notes, and session records.
