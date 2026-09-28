How many alert firings occurred in the selected time window, at Low severity and above.

### How it's calculated

- Sum of per-severity `alertCount` values from `GET /api/v1/alerts/history` for the chart snapshot window.
- Only **Low, Medium, High and Critical** are counted. The history query builds its severity series from those four levels only, so Info and Best Practice firings never reach this number — they are dropped, not folded into Low. Alert Distribution does the opposite with the same two levels, so the two cards disagree by design.
- Counts **events in the window**, including alerts that have since resolved — not the open backlog.
- Instance filter applies. Hint text names the window label (for example Past 24 hours).

### Reading it

It is normal for Alerts Fired to be large while Active Alerts is zero: the estate fired and cleared inside the window. Compare with Alerts Activity (severity breakdown of the same history) and Open Alerts (what is still open). If a firing you expected is missing, check its severity — an Info or Best Practice alert is real but invisible here.
