How many members have status Active.

### How it's calculated

- Counts members from the unfiltered organization list whose status is **Active** — the status a member reaches by opening their invitation and setting a password. Accepting the invitation is what activates the member; there is no separate activation step afterwards.
- Active is also the precondition for signing in at all: sign-in is refused for any member who is not already Active, so a member cannot become Active by logging in.
- Independent of the Members table's own Status filter; this KPI always reflects the whole organization.

### Reading it

Active plus Pending Invite should equal Total Members — every member is in exactly one of those two states. A large gap between Total Members and Active points to invitations that were sent but never accepted.
