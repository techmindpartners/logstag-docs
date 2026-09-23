Every organization member, searchable and filterable by role, status, and when they were added.

### How it's calculated

- Columns: avatar initials, Name / Email, Role, Status, and Last login (or "Never" if the member hasn't logged in yet).
- Backed by a paginated, filtered endpoint — search text, the Role and Status column filters, and the Added date range all round-trip to the server. This is a different query from the KPI strip above, which always reads the full organization.
- Status shows **Active** or **Invited** as a colored badge; Role shows Admin, DBA, Dev, or Billing (SuperAdmin members don't appear editable from this table the same way, since role changes go through the same Edit dialog).
- Edit opens a dialog to change first name, last name, and role; email cannot be changed once a member exists. Inviting a new member is a separate action from the toolbar above the table.

### Reading it

Use the Added date range together with Status to find recent invitations that are still pending, or filter Role to review who currently holds elevated access.
