The number of structural changes detected in the selected schema during the selected time window: additions, modifications, and removals combined.

### How it's calculated

- Logstag detects changes by comparing consecutive schema inventory snapshots collected by the agent, so a change appears once the *next* snapshot lands: within about 10 minutes on PostgreSQL and MongoDB, and up to 4 hours on SQL Server and Oracle with default intervals.
- The count is the change events recorded in the window. Filters below narrow the table only; the four tiles here always show window totals.

### Reading it

Zero during a quiet period is the expected state; a burst that lines up with a deployment is normal and useful as a deployment audit. The number to chase is the burst *nobody* recognizes. Structural change without a known deploy means someone or something is altering the schema outside the process.
