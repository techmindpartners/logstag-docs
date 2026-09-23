Manage organization members, their roles, and pending invitations.

### How it's calculated

- The page requires the **ManageMembers** permission, held by Admin and SuperAdmin only — every other role is kept off the route before it loads.
- The KPI strip always reflects the whole organization; the Members table below it is a separate, independently filtered and paginated view. Narrowing the table never changes the KPI numbers.
- Inviting a member sends an invite with an email, optional name, and a role. Editing a member changes name and role; email is fixed once an account exists.

### Reading it

Use the KPI strip for a quick read on headcount and pending onboarding, then use the Members table's own filters — Role, Status, and Added date range — to find a specific person or audit a role assignment.
