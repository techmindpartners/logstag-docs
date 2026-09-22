Findings first detected inside the selected time range.

### How it's calculated

- Counts findings whose first detection falls inside the topbar time window. A finding that started earlier and is still firing is in scope for the page, but it is not **New**.
- If no window is applied, this falls back to findings first detected in the last 7 days. The card's hint says which definition is in use.
- Recurrence is ignored: a finding first detected in the window that has already fired several times is still New.
- Uses the same definition as the **New** badge on list rows, and ignores the status tabs and chip filters.

### Reading it

A spike in New after a deploy or a configuration change is the signal to look at first. Filter by Category to see whether the new findings are query-level regressions or database-wide workload changes.
