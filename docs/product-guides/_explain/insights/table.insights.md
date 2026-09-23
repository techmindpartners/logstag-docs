Every finding in scope, one row each, filtered by status tab and chips and sorted by most recent activity by default.

### How it's calculated

- **Status tabs**:
  - **Active**: still firing.
  - **Dismissed**: closed by a user.
  - **No longer detected**: the detector has not seen the problem for about 45 minutes. This does not mean anyone confirmed a fix.
  - **Expired**: reserved; no finding moves to this state today.
  - **All**: the default.
- **Each row** shows a title, the database and instance, severity (Critical, High, or Medium), confidence, a **New** badge if the finding was first detected in the selected window, and `N× · time ago` once it has recurred.
- **Expanding a row** shows:
  - **What changed**: baseline versus current values.
  - **Why**: likely causes, such as data growth, a plan change, or lock contention.
  - **Recommended fix**: numbered steps.
  - **Evidence**: the metrics behind the finding.
  - First seen, Last seen, and Occurrences.
- **Dismiss** (Active rows only) asks for an optional reason, up to 500 characters. The reason and time appear on the row afterwards. A dismissed finding stays silent for about 30 days even if the detector sees it again. There is no undo. Dismissing changes nothing in the monitored database.
- Dismissed and No longer detected findings are removed after 30 days.

### Reading it

Expand a finding before you act on it. The Evidence and What changed sections show whether the baseline was solid. Dismiss with a reason when a finding is expected, such as a planned migration, so the next reviewer knows why it was closed.
