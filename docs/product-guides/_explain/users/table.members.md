Every organization member, searchable and filterable by role, status, and when they were added.

### How it's calculated

- Columns: avatar initials, Name / Email, Role, Status, and Last login (or "Never" if the member hasn't logged in yet).
- Backed by a paginated, filtered endpoint: search text, the Role and Status column filters, and the Added date range all round-trip to the server. This is a different query from the KPI strip above, which always reads the full organization.
- Status shows **Active**, **Invited**, or **Expired** as a colored badge. Under a pending invite, the table shows when its link expires; once it has expired, it shows when the invite was sent. Role shows Admin, DBA, Dev, or Billing (SuperAdmin members don't appear editable from this table the same way, since role changes go through the same Edit dialog).
- Each row's **⋯** menu holds the actions for that member. **Edit** changes first name, last name, and role; email cannot be changed once a member exists.
- For an invited member, **Resend invite** emails a new link that works for seven days, and the old link stops working. You can resend to the same person once a minute. **Cancel invite** removes the invite, and its link stops working.
- For an active member other than you, **Remove member** takes away their access: they can no longer sign in, and reports they scheduled are paused.
- A cancelled invite or a removed member can be invited again later. If an invite is saved but its email can't be sent, the page says so; the member still appears in the table, so you can resend it.
- Inviting a new member is a separate action from the toolbar above the table.

### Reading it

Use the Added date range together with Status to find recent invitations that are still pending, or filter Role to review who currently holds elevated access. An **Expired** badge means the person can no longer join with their link: resend the invite, or cancel it if they no longer need access.
