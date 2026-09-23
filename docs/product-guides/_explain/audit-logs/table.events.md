Every recorded action in the selected time window, one row per API request.

### How it's calculated

- Columns: Time, User, Method, Route, Controller, Entity, Status, and duration in milliseconds. Entity shows an em dash when the action isn't tied to a specific entity.
- Defaults to the **Last 24 Hours** window, set independently of the shared time-window default used on explorer pages elsewhere in the product.
- Every column has its own header-menu filter: Time reopens the time-range picker, User and Route are text matches, Method is a multi-select of HTTP verbs, Controller and Entity are populated from a distinct query over the whole window (not just the loaded page), and Status and duration are min/max ranges.
- Rows are paginated; selecting a row opens its Event Detail panel alongside the table rather than navigating away.

### Reading it

Controller and Entity filter options reflect the selected window as a whole, so a value can appear in the dropdown before its row has loaded onto the current page — keep paging or narrow further rather than assuming the filter is wrong.
