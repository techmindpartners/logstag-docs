The number of wait events in the **Locks** category — sessions waiting for a lock held by another session.

### How it's calculated

- Waits whose engine-native type maps to Logstag's Locks category: `Lock` and `BufferPin` waits on PostgreSQL, `LCK_*` wait types on SQL Server, and the `Concurrency` and `Application` wait classes on Oracle.
- Counted over the selected window with the tab's filters applied; amber and red follow the same warning and critical thresholds as the other tiles here.

### Reading it

Lock waits are the most actionable wait category, because there is always another session to look at: something *holds* what this session wants. When this tile is elevated, the Blocked Processes tile tells you how many sessions are stuck, and the Blocking Chains tab shows who is at the root. Brief lock waits under a write-heavy workload are normal; long ones almost always trace back to a transaction that stayed open longer than intended.
