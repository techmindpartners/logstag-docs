The average duration of the queries observed on this database in the selected window.

### How it's calculated

- Derived from the durations of statements the agent observed in its activity samples across the window, with the trend compared against the preceding window of the same length.
- The unit adapts to the value — sub-second averages keep millisecond precision; larger averages switch to seconds or minutes.
- Rising is treated as a regression and shown red.

### Reading it

Averages hide tails: a stable average with unhappy users usually means a slow minority of queries is buried under fast ones — the Query Explorer's per-query statistics find them. A rising average across the board, though, points at something systemic: a missing index after a schema change, growing data volume, or pressure visible in Resource Utilization below.
