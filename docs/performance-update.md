# File-backed performance update — 17 October 2026

Original account, session and note files remain authoritative. This release adds
rebuildable email and note indexes; it does not move notes to a new database or
change encryption keys. Indexes live under `data/.indexes/`, outside note quotas.
Encrypted titles remain encrypted there, and note bodies, images, history payloads,
PINs and content keys are not copied into indexes.

## Measured workloads

The local workload uses six synthetic notes per account, each with an image and a
text-history entry. Each scenario sends 200 requests with eight concurrent workers.
CAPTCHA site verification is stubbed locally; there is no production traffic,
real email delivery, payment or AI request. Password hashing, authorization,
storage validation, image decoding and rate limits run normally.

| Scenario | 1,000 accounts / 6,000 notes: p50 / p95 | 10,000 accounts / 60,000 notes: p50 / p95 |
| --- | --- | --- |
| Email and password login | 313 / 460 ms | 109 / 120 ms |
| First list reads | 184 / 404 ms | 50 / 61 ms |
| Warm list reads | 54 / 72 ms | 15 / 18 ms |
| Text saves | 148 / 175 ms | 33 / 38 ms |
| Image saves | 217 / 265 ms | 44 / 55 ms |

Both workloads completed with **zero failed requests** and **zero full-note reads
during the warm-list phase**. The 10,000-account sample was captured before the
final daily-statistics journal refinement; the final implementation was rerun
with 1,000 accounts. Timing varied with local machine and filesystem load, so the
two runs are not a controlled speed comparison. Account population itself no
longer causes email login to scan unrelated metadata files.

The final 1,000-account run measured 194.47 MiB peak process RSS and 32.65 ms p95
event-loop delay. Per-scenario CPU use was 84–187% of one CPU core. The earlier
10,000-account run measured 238.52 MiB RSS, 22.48 ms event-loop p95, and 143–372%
of one core. Client and server share this process, so these figures include the
load driver. They are not a server memory limit or a production capacity promise.

Environment: Windows, Node 24.19.0, Ryzen 9 6900HS, 16 logical CPUs, about 32 GiB
system RAM. The production 2-vCPU server has different CPU and disk performance;
these local results must not be presented as its guaranteed latency or throughput.

## Behavior and recovery

- Email lookup is rebuilt from authoritative account files at startup. Registration
  and account deletion update it immediately. Restart after manually restoring
  account folders or changing email addresses on disk.
- Note lists use encrypted title summaries and file sizes. Changed files are
  detected by size and modification time; missing or invalid indexes rebuild.
  Cache admission is capped at 64 accounts / 8 MB of serialized summaries.
- Session validity, bans and revocation are checked on every request. Activity
  timestamps are persisted at most once per minute.
- Daily visitors append durable journal entries. Snapshot compaction is batched,
  and replay deduplicates usernames after restart. The public counter reads the
  live set. Original UTC day boundaries remain in force.
- Agent requests release the account lock during the external wait, then reload
  current metadata before charging usage. A second simultaneous Agent request
  for the same owner receives a clear busy response.
- Background cleanup yields in batches. Plan notices are sent outside account
  locks. Image decoding admits two active and eight waiting jobs; queue waiting
  is bounded to ten seconds. The initial load test exposed immediate image-busy
  failures; bounded waiting removed those failures in the tested workload.
- Image count and byte limits both apply. Existing over-limit images are retained;
  only increases are blocked. Old client-encrypted image counts are discovered
  on owner unlock, without rewriting their ciphertext or increasing note size.

## Reproduce and verify

```sh
npm test
node scripts/load-test.cjs --accounts=1000 --requests=200 --concurrency=8
node scripts/verify-experience.cjs
node scripts/verify-product-docs.cjs --pricing
node scripts/verify-note-media.cjs --functional-only
```

All fixtures are generated in separate OS-temporary directories and removed by
the harness. Load reports remain in separate temporary report directories.
Tests cover quota enforcement, old-file integrity, index rebuilds, journal replay,
immediate session revocation, concurrent settings during Agent generation, and
English / Traditional Chinese / Japanese layouts in both themes at eight sizes.
