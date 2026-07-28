The statement's behavior over time: four charts tracking calls, mean execution time, rows, and cache hit rate across the selected window.

### How to read them

- Each chart mirrors one of the summary tiles above it, bucketed over the window; the bucket size adapts to the window length.
- All four share a synchronized hover — moving the cursor on one moves it on all, so you can line up a latency spike with the call volume and cache behavior at the same instant.
- Gaps in a line are honest: no samples were collected for that stretch, not zero.

### Reading it

The diagnosis usually falls out of which charts move together. Mean time up with calls flat and cache hit down: the working set changed — think data growth or eviction. Mean time up with calls up: contention under load. Mean time up alone, everything else flat: a plan change — on PostgreSQL, check the Explain Plan below; on SQL Server, this is what Query Store's plan history exists for.
