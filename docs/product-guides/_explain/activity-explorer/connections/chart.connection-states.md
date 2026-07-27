A stacked history of connection counts by state across the selected window. Each bar is a sample bucket; each color is one state, and the legend toggles states on and off.

### The states

- **Active** — executing a statement right now.
- **Idle** — connected, no running statement, no open transaction.
- **Idle in Transaction** — no running statement, but a transaction was left open. These sessions still hold locks and pin resources, which is why they get their own color.
- **Waiting for Lock** — blocked on a lock held by another session.
- **Other** — states that don't fit the categories above, including engine-internal ones.

Each engine reports its own native session states; Logstag maps them onto this shared model so the chart reads the same for PostgreSQL, SQL Server, and Oracle.

### Reading it

The shape matters more than any single bar. A growing orange band (Idle in Transaction) is an application forgetting to commit — the classic prelude to lock pileups and bloat. A red band (Waiting for Lock) appearing suddenly correlates with the Blocking Chains tab; check there for the root blocker. A total height that ratchets upward without receding is pool growth worth investigating before it hits the connection limit.
