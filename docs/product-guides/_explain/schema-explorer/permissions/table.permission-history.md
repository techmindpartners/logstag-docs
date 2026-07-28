A log of permission changes on this schema: grants, revokes, and role membership changes, newest first.

### Columns

- **Timestamp** — when the change was detected.
- **Principal** — who the change applied to.
- **Action** — Grant, Revoke, Add member, or Remove member. Filterable.
- **Description** — what changed.
- **Changed by** — the grantor context, where the engine records one. Filterable.

### How it's calculated

- History is derived by comparing consecutive permission snapshots, so a change is detected once the next snapshot lands — within about 10 minutes on PostgreSQL and MongoDB, up to 4 hours on SQL Server and Oracle with default intervals. The timestamp is the detection time, not the exact moment the statement ran.
- The section always renders, even when empty, so an empty log is a statement — no recorded changes — rather than a missing feature.

### Reading it

This is the quiet audit trail: a Revoke that nobody planned means access cleanup happened outside process, and a Grant to an unfamiliar principal is worth tracing the same day. For PostgreSQL, grants also appear as first-class change records on the Changes tab — the two views cross-check each other.
