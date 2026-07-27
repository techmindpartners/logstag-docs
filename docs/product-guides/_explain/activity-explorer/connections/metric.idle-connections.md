The number of connections that were **connected but doing nothing** when sampled — no running statement and no open transaction.

### How it's calculated

- Sessions whose engine-native state maps to **Idle** in Logstag's shared state model: `idle` on PostgreSQL, `sleeping` (with no open transaction) or `dormant` on SQL Server, `INACTIVE` on Oracle.
- Connections that are idle **inside an open transaction** are not counted here — they are tracked as their own state in the Connection States chart, because they hold locks and snapshot resources that plain idle connections do not.
- The count uses each session's most recent sample in the window, with the tab's filters applied.

### Reading it

A healthy pool keeps a cushion of idle connections — that is what a pool is for. The number matters in proportion: if idle connections dominate the total and keep growing, the pool is oversized or connections are leaking. Zero idle connections under load means the pool is exhausted and new work is about to queue.
