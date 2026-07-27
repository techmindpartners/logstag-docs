The number of sessions that were **blocked by another session** in the selected window — waiting on a lock someone else holds.

### How it's calculated

- The agent's activity samples record, for each waiting session, which session blocks it (`pg_blocking_pids()` on PostgreSQL, `blocking_session_id` on SQL Server, `blocking_session` on Oracle).
- The tile counts distinct blocked sessions observed in the window, with the tab's filters applied.
- Amber and red follow the tab's warning and critical thresholds; rising is worse.

### Reading it

This is the human-impact number: each unit is a session going nowhere. One or two blocked sessions that clear within a sample interval are everyday contention. A stable or growing count means a blocker is not letting go — open the Blocking Chains tab, find the root blocker, and read its query text. The fix is almost always at the root, not at the blocked sessions.
