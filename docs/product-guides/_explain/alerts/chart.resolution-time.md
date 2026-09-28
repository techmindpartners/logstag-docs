How long alerts raised in the selected window took to resolve.

### How it's calculated

- From the same `GET /api/v1/alerts/history` payload as Avg. Resolution: average, median, and 90th-percentile resolution minutes (displayed as durations).
- Every statistic is measured from an alert's creation to its `resolved_at`, over alerts **raised inside the window that have since resolved** — the closing time itself can fall outside the window.
- No severity filter applies here, so Info and Best Practice alerts are included; muted alerts are excluded.
- Empty state when nothing raised in the window has resolved yet. Instance filter and chart snapshot window apply.

### Reading it

Avg. Resolution is the mean alone; this card adds median and p90 so you can see skew. A calm median with a long p90 points at a few hard incidents. Remember that still-open alerts are missing from all three figures, so a window ending in the last few hours flatters the numbers.
