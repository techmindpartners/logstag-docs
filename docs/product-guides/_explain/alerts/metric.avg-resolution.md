Mean time to resolve alerts that were raised in the selected time window and have since been resolved.

### How it's calculated

- Served by `GET /api/v1/alerts/history` for the chart snapshot window (`from` / `to` / `bucketSize` from the topbar chip).
- Uses `averageResolutionMinutes` from the history payload (shown as a duration), measured from each alert's creation to its `resolved_at`.
- The window filters on **when an alert was raised, not when it closed**. An alert raised inside the window counts however long afterwards it resolved, and one raised before the window never counts even if it closed inside it.
- Unlike the bucketed severity counts on this page, this figure has no severity filter, so Info and Best Practice alerts are included. Muted alerts are excluded.
- Shows an empty value when nothing raised in the window has resolved yet.
- Respects the topbar instance filter. This is windowed — unlike Active Alerts / Critical.

### Reading it

Pair with Resolution Time (median and p90 on the same source). A short average with a long p90 means a few outliers dominate the tail. Because the window selects by raise time, a freshly chosen short window can look optimistic: the slow alerts it contains have not resolved yet, so they are not in the average.
