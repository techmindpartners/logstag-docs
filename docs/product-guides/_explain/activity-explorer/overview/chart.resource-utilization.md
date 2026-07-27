The database server's current resource pressure: CPU, memory, and network, each with a level bar and a health color.

### How it's calculated

- The agent collects system metrics from the host it monitors alongside the database metrics.
- Each bar shows the latest sample for the server behind this database: CPU and memory as percentages, network as throughput.
- The bar's color reflects the health status for that resource.

### Reading it

This card answers "is the *machine* the problem?" — the fastest triage split there is. High CPU with high Active Sessions is genuine workload; high CPU with few sessions is one expensive query. Memory near the top on a database server is not automatically bad — databases deliberately use memory as cache — but a sudden *drop* often means a restart. When everything here is green and queries are still slow, the cause is inside the database: look at wait events, not the hardware.
