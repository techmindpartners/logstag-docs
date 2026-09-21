Mean time to resolve alerts that closed in the selected time window.

### How it's calculated

- Served by `GET /api/v1/alerts/history` for the chart snapshot window (`from` / `to` / `bucketSize` from the topbar chip).
- Uses `averageResolutionMinutes` from the history payload (shown as a duration). Shows an empty value when nothing resolved in the window.
- Respects the topbar instance filter. This is windowed — unlike Active Alerts / Critical.

### Reading it

Pair with Resolution Time (median and p90 on the same source). A short average with a long p90 means a few outliers dominate the tail.
