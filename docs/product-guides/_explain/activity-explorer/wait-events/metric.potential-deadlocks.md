An indicator of **deadlock risk** in the selected window. It counts situations that look like they could end in a deadlock — it is not a count of deadlocks the engine has already killed.

### How it's calculated

| Engine | Source |
| --- | --- |
| PostgreSQL | Distinct blocking-chain roots observed in the window — each chain of sessions queued behind one blocker counts once. |
| SQL Server | The engine's own deadlock rate counters, averaged over the window. |
| Oracle | The change in the cumulative `lock deadlock retry` event counter (`v$system_event`) within the window. |

The tile turns amber at the first potential deadlock and red as they accumulate; rising is worse.

### Reading it

Zero is the expected state. A non-zero value is an early warning, not a confirmed incident — the engines resolve true deadlocks themselves by killing a victim, and this tile is designed to light up *before* that happens. When it does, the Blocking Chains tab shows the structure at risk: chains where two sessions each hold what the other wants are the ones that convert into real deadlocks.
