# Runtime data

This directory is intentionally excluded from Git. AstraNote creates counters,
sessions, deletion requests, server secrets, and one directory per account at
runtime. On Zeabur, mount this directory (or `DATA_DIR`) on persistent storage.

Never commit its runtime contents: they can contain password hashes, email
addresses, IP addresses, encrypted or plain-text notes, and session records.
