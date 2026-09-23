Findings that have been detected more than once.

### How it's calculated

- Counts findings in the current scope with more than one occurrence. Each detector pass that sees the same problem again on the same database adds one occurrence and updates **Last seen**.
- A finding that stops firing moves to **No longer detected** after about 45 minutes. If it comes back within 7 days, the same finding is reactivated and its count keeps growing. After 7 days it returns as a new finding with a count of 1.
- Ignores the status tabs and chip filters.

### Reading it

Recurring findings are persistent problems, not one-off spikes. Sort the list by **Most recurring** to see them first. The row chip `N× · time ago` shows how often a finding fired and when it last did.
