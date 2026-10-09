How many new alerts were raised in the selected time window, at Low severity and above.

### How it's calculated

- Sum of per-severity `alertCount` values from `GET /api/v1/alerts/history` for the chart snapshot window.
- Only **Low, Medium, High and Critical** are counted. The history query builds its severity series from those four levels only, so Info and Best Practice firings never reach this number — they are dropped, not folded into Low. Alert Distribution does the opposite with the same two levels, so the two cards disagree by design.
- Counts **new alerts, not recurrences**. An alert that closed on its own (auto-resolved when its timer ran out) and whose condition returns within **60 minutes** is reopened, not raised again — so it is counted once, at the time it was first raised. A flapping condition therefore adds 1, not 1 per cycle. An alert you resolved by hand is not reopened: if its condition comes back, that is a new alert and is counted.
- Counts **events in the window**, including alerts that have since resolved — not the open backlog.
- Instance filter applies. Hint text reads "Low to Critical" followed by the window label (for example Low to Critical (past 24 hours)).

### Reading it

It is normal for Alerts Fired to be large while Active Alerts is zero: the estate fired and cleared inside the window. Compare with Alerts Activity (severity breakdown of the same history) and Open Alerts (what is still open). If an alert you expected is missing, check its severity — an Info or Best Practice alert is real but invisible here — and whether it was a reopen: a condition that recurred within 60 minutes of auto-closing lands on the existing alert, which is counted in the bucket where it was first raised, possibly before the window.
