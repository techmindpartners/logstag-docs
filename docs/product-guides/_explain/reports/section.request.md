Ask for a PDF built in the background and emailed as a download link that works for 30 days.

### How it's calculated

- `POST /api/v1/reports` with a `ReportKind` and scope parameters. The requester is always a recipient; extras come from the org member list (max **20** people including the requester).
- Security and Data Inventory accept optional multi-instance filters (max **100** ids). Per-Instance Scorecard requires one instance, optional one database, and a `from` / `to` window (presets Last 7 / Last 30 days, or custom up to **31 days**).
- Generation is asynchronous. Status moves Queued → Building (Processing) → Ready or Failed. The email link and in-app download expire after the org retention window (default **30 days**).

### Reading it

Share the pre-filled request URL — scope lives in query params. If an identical request is already building, the API reuses it instead of starting a duplicate.
