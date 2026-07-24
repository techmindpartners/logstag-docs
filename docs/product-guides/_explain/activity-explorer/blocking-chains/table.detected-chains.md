Every blocking chain in the window, worst first. Each chain expands into the sessions inside it.

### Example

*In the dashboard this section shows an annotated miniature of the table rows.*

### Columns

- **PID** — The session id (`spid`). The chain is keyed by its root blocker's PID.
- **Lock Type** — Wait class: Locks, LWLocks, or IO.
- **Resource** — What is being waited on, e.g. `KEY: 6:72057594…` (database : object).
- **Mode** — Role in the chain: Holding, Blocked, or BlockedAndBlocking (amber).
- **Granted** — Whether the session's lock request is granted. Only the root shows Yes.
- **Duration** — How long the lock has been held (root) or waited on (blocked).
- **Query** — The last statement seen on the session.

> **Tip:** The share action opens the chain in the full Blocking Chain view. Killing the root blocker's session frees the whole chain — treat it as the last resort; first find the application that left the transaction open.
