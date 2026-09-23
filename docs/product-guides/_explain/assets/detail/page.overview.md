The summary card at the top of an asset's detail page: identity, connection status, a live health/CPU/memory strip, and editable instance settings.

### How it's calculated

- The header shows the instance name, a Connected/Disconnected badge from the same connection flag as the list, and a subtitle with engine, agent-reported version, and environment.
- The metric strip renders Health, CPU, and Memory only when the backend has a value for each. Health is tinted green at 80% or above, amber at 60% or above, and red below that — the same thresholds used elsewhere in the product.
- Expanding the card reveals read-only details (full version, hosting, replication role, Oracle edition, database role, CDB flag, last health check, created/updated timestamps, agent ID) — each row is skipped entirely when the backend has no value, rather than showing a placeholder.
- Settings — instance name (3–100 characters), environment, and owner — are edited from the same expanded panel. Instance name and environment are required; owner is optional and lists the organization's members, loaded only once the card is expanded.

### Reading it

CPU and memory only appear once the agent has reported a recent system-stats snapshot, so a freshly connected asset can show Health without them yet. Use Edit to correct an instance name or reassign ownership — engine, version, and health are reported by the system and can't be edited here.
