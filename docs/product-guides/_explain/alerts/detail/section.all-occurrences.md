Every occurrence of this alert template in the current window, with a selectable list and detail panel.

### How it's calculated

- Paged `queryAlertsByCode` for the detail route's `code`, using the same time range and instance scope as the header KPIs.
- Opens focused on the newest occurrence. Split view shows the Details panel for the selection; the left list hides when there is only one occurrence total.
- Search is disabled on this by-code list (server search is not available here).

### Reading it

Use this list for acknowledge / mute / assign / escalate on individual rows. Timeline below summarizes the same window; Details explains the selected row.
