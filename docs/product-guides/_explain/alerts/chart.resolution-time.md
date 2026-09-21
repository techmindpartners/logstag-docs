How long alerts took to resolve when they closed in the selected window.

### How it's calculated

- From the same `GET /api/v1/alerts/history` payload as Avg. Resolution: average, median, and 90th-percentile resolution minutes (displayed as durations).
- Empty state when nothing resolved in the window. Instance filter and chart snapshot window apply.

### Reading it

Avg. Resolution is the mean alone; this card adds median and p90 so you can see skew. A calm median with a long p90 points at a few hard incidents.
