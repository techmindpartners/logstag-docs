Database servers monitored by the Logstag agent — one asset per host, and every database it runs is picked up automatically once the agent connects.

### How it's calculated

- The page requires the **ManageDatabases** permission. Admin, SuperAdmin, and DBA hold it by default; anyone else is kept off the route before it loads.
- The list is backed by a paginated instances endpoint — search text, and the Engine, Environment, Status, Health, and Version filters all round-trip to the server rather than filtering a client-side cache.
- "Add asset" opens the three-step registration wizard. An asset represents a server, not an individual database — Database Explorer is where per-database operational data lives.

### Reading it

Use the column-header filters to narrow the fleet — by engine, environment, connection status, health range, or version — before opening a row. Click a row to reach the asset's detail view for connection, configuration, and integration management.
