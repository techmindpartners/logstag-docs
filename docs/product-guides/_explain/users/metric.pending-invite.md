How many members have been invited but haven't accepted yet.

### How it's calculated

- Counts members from the unfiltered organization list whose status is **Invited** — where every invited member starts, until they open the invitation and set a password, which moves them to Active.
- An invited member has no way in until then: sign-in is refused for anyone who is not Active, which is why the Members table shows "Never" under Last login for this group.
- Invitation links expire seven days after they are sent. An expired invitation leaves the member Invited, so this count also includes invitations that can no longer be completed — inviting the member again issues a fresh link and restarts the window.
- Independent of the Members table's own Status filter; this KPI always reflects the whole organization.

### Reading it

A rising count with no matching Active growth means invitations are going out but not being completed. Check how long ago they were sent before assuming the mail never arrived: anything past the seven-day window needs a fresh invitation rather than a nudge.
