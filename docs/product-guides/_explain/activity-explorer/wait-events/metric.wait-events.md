The number of wait events captured on this database in the selected time window — sessions observed waiting on something instead of executing.

### How it's calculated

- The Logstag agent samples live session state on the activity interval (10 s by default) and records the wait each session is in, if any.
- The tile counts the waits observed in the window, with the tab's filters applied; the trend arrow compares against the preceding window of the same length.
- The tile turns amber or red when the count crosses the warning or critical threshold; every metric on this tab treats rising as worse.

### Reading it

Some waiting is normal — databases coordinate through locks and latches by design. What matters is the change: a count that doubles against the previous window deserves a look at the history chart to see *which category* grew. Locks growing means contention between sessions; IO growing means storage pressure; Client growing usually means slow consumers on the application side.
