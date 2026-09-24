CPU, memory and disk usage across every monitored host in the selected window, one line per resource.

### How it's calculated

- Served by `GET /api/v1/metrics/utilization` with the same `from` / `to` / `bucketSize` (1 minute / 1 hour / 1 day / 1 week) the dashboard derives from the topbar time window, plus the optional instance filter (empty = whole org). Results are cached for 30 s.
- Sourced from VictoriaMetrics host stats reported by the agent, covering every monitored host regardless of database engine.
- **CPU (%):** each host's CPU usage averaged over the bucket, then averaged across hosts — every host weighted equally.
- **Memory (%):** same averaging method; used vs. total RAM only — swap is not included.
- **Disk (%):** the fullest single volume across all hosts at its peak in the bucket (max of max), not an average. `/boot`, `/boot/efi`, and `/snap/*` are ignored. This is the alerting-relevant figure.
- Buckets with no data come back `null` and are drawn as gaps; a real zero stays 0. The in-progress last bucket is a partial average.

### Reading it

CPU and Memory are fleet averages, so one saturated host can hide behind several quiet ones; drill into the instance when a line creeps up. Disk is the single fullest volume at its peak, so a rising Disk line means at least one volume is filling up, even if the rest of the estate has room. Hover stays in sync with the other three trend tiles.
