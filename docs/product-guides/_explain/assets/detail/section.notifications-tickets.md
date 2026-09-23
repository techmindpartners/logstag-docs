Maps each database on this server to a Jira project so alerts open tickets in the right place.

### How it's calculated

- One row per database discovered on this server. If Jira isn't connected at the workspace level, the section shows a "Connect Jira" prompt instead of the mapping list.
- Each row is a single dropdown: choosing a project creates the mapping, choosing a different one updates it, and choosing "— none —" removes it. Mappings are server-scoped through this card, but stored per database, not per server.
- "Manage integration" links out to the workspace-level Jira integration page for connecting, disconnecting, or reviewing all projects — connecting Jira itself does not happen from an asset's detail page.

### Reading it

Map only the databases that need alerts filed against a specific Jira project. A database left unmapped simply has no automatic ticket routing configured for it here.
