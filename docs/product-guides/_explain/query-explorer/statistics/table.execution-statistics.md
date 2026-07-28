The statement's execution profile for the selected window: how often it ran, how long it took on average and at the extremes, and how much block I/O time it spent.

### Rows

- **Calls in period** — executions in the window.
- **Mean time** — average execution duration. Rising reads red.
- **Execution time in period** — total time spent executing across all calls; the statement's real cost.
- **Min time / Max time** — the fastest and slowest observed executions, where the engine tracks them.
- **Rows** — rows produced in the window.
- **Block I/O total time** — time spent reading and writing data blocks, where the engine measures it.

A "Measured" timestamp on the card shows when the statistics were last collected. Each row's trend chip compares against the preceding window; the arrow's color follows whether rising is good (calls, rows) or bad (times).

### Reading it

The Min–Max spread is the diagnostic the averages hide: a tight spread means the statement is uniformly slow (plan or index work), a wide one means it is usually fast with bad outliers (contention, parameter sensitivity, or cache misses on cold values). And compare total Execution time in period across your top statements — the biggest total, not the worst mean, is where tuning pays back most.
