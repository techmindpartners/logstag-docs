The rate of operations per second — the throughput tile for engines whose unit of work is the operation rather than the transaction: MongoDB, Redis, and Valkey.

### How it's calculated

- MongoDB: the agent reads the server's operation counters (`serverStatus` opcounters — inserts, queries, updates, deletes, and the rest). The tile shows the per-second rate of the Server Operations chart's latest bucket in the selected time window, rounded to two decimal places.
- Redis and Valkey: the agent collects command statistics from `INFO`. The tile shows the latest chart bucket's operations-per-second rate.
- If the latest bucket has no sample, the tile shows `—`, even when earlier buckets contain data. It does not use an earlier populated bucket or the whole-window average as a fallback.
- The trend arrow compares the selected window's average rate against the preceding window's average rate, independently of the latest-bucket value.

### Reading it

An empty tile means no sample in the latest bucket, not zero operations. This can happen between collections when the chart's buckets are shorter than the reporting interval.

The absolute rate matters less than its relationship to latency and hit rates. On MongoDB, compare against the Server Operations chart below to see how throughput changed over time. On Redis, an operations spike with a falling keyspace hit rate means the working set changed — new keys are being asked for that aren't there yet.
