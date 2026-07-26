Every database that can be reviewed for activity, with its hosting instance, engine, state, and the session pressure it is under in the selected time window.

### Columns

- **Database / Instance** — The database and the instance hosting it. Opening a row leads to the detail tabs: Overview, Connections, Wait Events, and Blocking Chains.
- **Engine** — PostgreSQL, SQL Server, or Oracle for detailed activity views.
- **Status** — Active means the target is currently reporting; inactive targets stay listed with their last known information.
- **Sessions** — Total sessions observed in the window.
- **Active** — Sessions actively executing work in the engine.
- **Blocked** — Sessions waiting on locks. The strongest column to sort by during an incident.
- **Alerts** — Critical and warning alert counts for the database.

### Reading it

Sort by **Blocked** when triaging an incident, then narrow with the engine, instance, or status filters. The search box matches database and instance names.

### If a database shows no data

- No activity in the selected time window.
- The monitoring user lacks access to the engine's activity views.
- High-frequency or workload collectors are disabled.
- The database target is inactive.
