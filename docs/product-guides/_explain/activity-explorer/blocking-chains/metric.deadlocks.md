How many deadlocks the engine resolved in the window. A deadlock is not slow blocking — it is a **cycle** of sessions waiting on each other that can never resolve, so the engine kills one of them.

### How it's calculated

| Engine | Source |
| --- | --- |
| SQL Server | `xml_deadlock_report` events from the always-on `system_health` XE session |
| PostgreSQL | the deadlock detector that fires after `deadlock_timeout` (1 s default) |

The agent ingests these events; the tile counts them in the window.

### Example

![Deadlock cycle between two sessions](/img/explain/activity-explorer/blocking-chains/cycle.svg)

*A deadlock is a cycle — neither side can ever proceed, so the engine terminates one victim and rolls its transaction back.*

### Reading it

Anything above zero deserves a look: each event rolled back a victim's transaction (SQL Server error `1205`, PostgreSQL `40P01`) and the application had to retry. Repeated deadlocks on the same pair of tables usually mean two code paths update them in opposite order.
