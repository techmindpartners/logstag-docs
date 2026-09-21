The most recent trigger time among loaded occurrences for this template.

### How it's calculated

- Maximum `last_triggered_at` / `timestamp` over the header occurrence page (≤100 rows).
- Hint may also show the earliest trigger in that set when it differs. Header severity badge uses the worst severity across loaded rows, not only the latest row.

### Reading it

Compare with the Timeline to see whether the latest fire sits in a quiet or busy cluster of buckets.
