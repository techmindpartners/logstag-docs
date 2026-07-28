One row per distinct statement observed in the selected window. Click a row to open the query's detail view.

### Columns

- **Query** — the statement text, syntax-highlighted and clamped to a few lines; the detail view shows the full text.
- **Database** — the database the statement ran in, with its engine icon. Filterable.
- **Instance** — the hosting instance.
- **Execution Time** — the average execution duration, with a trend against the previous comparable period. Rising is shown red.
- **Rows** — rows the statement produced in the window, where the engine reports them.
- **Calls** — how many times the statement executed in the window.
- **Alerts** — active query-level alert counts as severity chips.
- **Last Executed** — when the statement last ran.

The list can be searched, filtered per column (execution-time and count ranges, engine, with/without alerts), sorted by most measures, and paginated with a selectable page size. Column visibility choices persist in your browser.

### Reading it

Three sorts cover most tuning sessions: Execution Time for the slow, Calls for the busy, and Alerts for the already-flagged. A statement with modest per-call time but enormous call volume often costs more than the slowest query on the page — which is exactly what the Calls sort surfaces.
