Every registered instance, with its engine, environment, connection status, health, and agent-reported version.

### How it's calculated

- **Instance** shows the instance name, falling back to the server's internal name when no instance name is set.
- **Engine** shows the database engine icon and label. **Environment** shows the instance's environment label, or an em dash when none is set.
- **Status** is derived from the connection flag, not observed live: **Connected** when the instance has an active agent connection, **Disconnected** otherwise. The backend flips a stale connection to Disconnected after roughly 5 minutes without agent traffic.
- **Health** shows the latest health score as a percentage, or an em dash when no assessment has run yet. **Version** shows the agent-reported short version string, truncated with a tooltip for long values.
- Filters for every column live in that column's header menu — Engine and Status are multi-select, Environment is a searchable combobox built from the instances already in the org, Health is a min/max range, and Version is a text match.

### Reading it

Filter Status to Disconnected to find servers that need agent attention — the table has no sort, only filters. A Connected asset can still show a low Health score: health and connectivity are independent signals, so check both before assuming an asset is healthy.
