CPU, memory and disk usage across every monitored host in the selected window, one line per resource.

### How it's calculated

- Served by `GET /api/v1/metrics/utilization` with the same `from` / `to` / `bucketSize` (1 minute / 1 hour / 1 day / 1 week) the dashboard derives from the topbar time window, plus the optional instance filter (empty = whole org). Results are cached for 30 s.
- Sourced from VictoriaMetrics host stats reported by the agent, covering every monitored host regardless of database engine.
- **CPU (%):** each host's CPU usage averaged over the bucket, then averaged across hosts — every host weighted equally.
- **Memory (%):** same averaging method; used vs. total RAM only — swap is not included.
- **Disk (%):** the fullest single volume across all hosts at its peak in the bucket (max of max), not an average. `/boot`, `/boot/efi`, and `/snap/*` are ignored. This is the alerting-relevant figure.
- Buckets with no data come back `null` and are drawn as gaps; a real zero stays 0. The in-progress last bucket is a partial average, and a host whose read fails is silently dropped from that bucket.

### Reading it

Disk is a peak, not an average, so it can spike well above what CPU and Memory suggest — treat it as the number that matters for capacity alerts. A CPU or Memory line that plateaus near 100% before Disk fills points to a resource-constrained host, not just a busy one. Hover stays in sync with the other three trend tiles.
