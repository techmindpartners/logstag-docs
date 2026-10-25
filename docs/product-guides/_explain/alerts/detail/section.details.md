Metadata for the selected alert occurrence in the split detail panel.

### How it's calculated

- Fields come from the selected `AlertItem` row — not a separate detail endpoint for this table.
- Rows, top to bottom: threshold, current value, unused index names, the template's key facts, instance/database, engine, category, check frequency, scope, type, status, created, assignee, SLA, escalation/ticket.
- What the alert found comes first. The alert's template picks the current value and up to three key facts from the alert's context. Unused-index alerts also name their largest indexes (up to three, then "+N more").
- Rows that are the same for every alert of the template (engine, category, check frequency) come after the alert's own values, so the findings are seen first.
- Current value, key facts, unused index names, instance, database, type, and SLA appear only when the alert has them.
- On the alert group page, a current value or key fact that differs between the listed occurrences is marked "differs".
- An unused-index alert's indexes, and any list the template picks from the context, show as tables right under Details.
- Shown when the All Occurrences list is in split view. Description, impact, causes, and actions live in sibling panel sections; this help entry covers the Details table only.

### Reading it

Use Details to see what the alert found and where it fired, then who owns it. If the row is muted, the panel banner links to Alert Policy — muted alerts stay out of default list KPIs until you show muted.
