The Database Explorer is the inventory of every monitored database: which databases Logstag watches, whether they and their hosting instances are reporting, and which ones need attention because of host pressure or active alerts.

### What the page shows

- One row per monitored database, paired with the instance that hosts it.
- **Online** means both the database and its instance are active; if either is inactive, the row shows **Offline**.
- CPU and memory are **instance-level** measurements — when several databases share a host, they show the same values. They describe host pressure, not one database's consumption.
- Alert chips summarize the database's active alerts by severity.

Selecting a row opens the database's detail view: overview metrics and trends, the health score, the schema inventory, and the database's alerts.

### Reading it

Scan Status first, then the alert chips, then CPU and memory. A healthy fleet reads as a column of green Online badges and grey zero chips — anything colored is your triage list, and the row's detail page says why.
