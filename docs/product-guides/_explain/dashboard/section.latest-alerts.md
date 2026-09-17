A compact digest of the ten most recently triggered alerts in the current time window and instance scope.

### How it's calculated

- Uses the same alerts list API as the Alerts Explorer (`queryAlerts`), limited to page size 10, sorted by `last_triggered_at` descending, with status set to all (including resolved).
- **Time window:** for a preset, only `from = now − preset duration` is sent (through now); for a custom range, both `from` and `to` are sent. Filtering is on `last_triggered_at`, matching the shared topbar window the trend tiles use.
- **Instance scope:** when the topbar filter is set, alerts are narrowed by instance name after ID→name resolution. The digest waits for that resolution so it never briefly shows an unfiltered org-wide list.
- Compact mode hides search, filters, and pagination — View opens the alert's detail page carrying the same window and instance scope.

### Reading it

This is a glance, not the full workspace. Use **View all** for filters, bulk actions, and history charts. If the KPI Alerts count is high but this list looks quiet, the open alerts may last have triggered outside the selected window — widen the chip or open the Alerts Explorer.
