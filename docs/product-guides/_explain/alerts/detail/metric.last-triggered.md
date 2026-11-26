The most recent trigger time among loaded occurrences for this template.

### How it's calculated

- Maximum `last_triggered_at` / `timestamp` over the header occurrence page (≤100 rows).
- The **first:** hint shows when the group first fired: the oldest occurrence's creation time, not its last trigger. When the group has more than the loaded rows, the page looks up its oldest occurrence. The hint is hidden when it reads the same as the last trigger.
- The header severity badge uses the worst severity across all loaded rows.

### Reading it

Compare with the Timeline to see whether the latest fire sits in a quiet or busy cluster of buckets.
