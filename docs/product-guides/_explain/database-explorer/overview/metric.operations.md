The rate of operations per second — the throughput tile for engines whose unit of work is the operation rather than the transaction: MongoDB, Redis, and Valkey.

### How it's calculated

- MongoDB: the agent reads the server's operation counters (`serverStatus` opcounters — inserts, queries, updates, deletes, and the rest) and Logstag turns the window's growth into a rate.
- Redis and Valkey: command counters from `INFO`, turned into a rate the same way.
- The trend arrow compares against the preceding window.

### Reading it

The absolute rate matters less than its relationship to latency and hit rates. On MongoDB, compare against the Server Operations chart below to see *which* operation type moved. On Redis, an operations spike with a falling keyspace hit rate means the working set changed — new keys are being asked for that aren't there yet.
