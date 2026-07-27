The SQL statements that accumulated the most active session time in the selected window, identified by Oracle SQL_ID.

### Columns

- **SQL_ID** — Oracle's identifier for the statement. Use it to find the same statement in the Query Explorer or in Oracle's own views (`v$sql`, execution plans).
- **Active s** — active session time attributed to the statement (ASH sample count, ≈ seconds), covering both CPU work and waits while it ran.

### How it's calculated

- Each ASH sample that was executing SQL carries the statement's SQL_ID; samples are counted per SQL_ID and the top statements are shown.
- Samples taken outside a SQL statement — background operations, idle-in-call time — carry no SQL_ID and are not attributed to any row. When no samples carried a SQL_ID, the card reports that nothing was captured.

### Reading it

This ranking answers "which statement is the database spending its time on?" — which is not always the slowest statement, but the one whose frequency × duration is largest. A statement at the top with a modest per-execution time is a volume problem; the Query Explorer's statistics view shows its call rate and history. A statement at the top of both this card and the wait-event ranking is the one to tune first.
