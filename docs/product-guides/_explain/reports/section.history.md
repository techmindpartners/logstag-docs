Every report request for this kind across the organization, newest first.

### How it's calculated

- `GET /api/v1/reports?kind=…` pages of 20. Rows include requester, server-built scope label, recipient count, status, and download URL when Ready.
- Statuses: Queued, Building (Processing), Ready, Failed, Expired. The table polls about every 5 seconds while any row is still Queued or Building.
- Download uses the authenticated export tray while the request is Ready and not expired. Failed rows show the backend error code message.

### Reading it

Org-wide on purpose — someone else's in-flight copy is why you may see a deduped "already being built" confirmation on Request. Empty state means nobody in the org has requested this kind yet.
