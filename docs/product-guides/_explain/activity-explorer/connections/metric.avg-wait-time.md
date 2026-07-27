The average time that waiting sessions had spent in their current wait, across the selected window. It answers "when sessions wait here, how long do they wait?"

### How it's calculated

- The agent's activity samples record how long each waiting session has been in its wait.
- Logstag averages those durations across the sessions observed waiting in the window, with the tab's filters applied.
- The tile turns amber or red when the average crosses the warning or critical threshold, and the trend arrow treats rising as worse.

### Reading it

Interpret it together with the number of waiters. A high average over one or two sessions is usually a single stuck query or an abandoned transaction; a moderate average over many sessions points at systemic contention — a hot table, an undersized pool, or storage latency. The Wait Events tab breaks the same waits down by category and event so you can see *what* is being waited on.
