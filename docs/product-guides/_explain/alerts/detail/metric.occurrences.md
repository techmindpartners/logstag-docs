How many times this alert template code fired in the scoped window.

### How it's calculated

- `GET /api/v1/alerts/grouped/{code}/items` (via `queryAlertsByCode`) — uses `pagination.totalCount` for the full total.
- Scoped by topbar time window and optional instance filter from the URL. The header fetch loads up to 100 rows for downstream tiles; the count itself is not capped.

### Reading it

When total exceeds 100, companion tiles that uniq over loaded rows may undercount distinct databases/instances. Use All Occurrences paging for the full set.
