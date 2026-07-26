Activity Explorer shows runtime database activity — sessions, connections, waits, blocking, and transactions. It is built for operators who need to understand what is happening inside a database while a workload is running.

### What it answers

- Which databases currently have active workload?
- Which sessions or connections are consuming time?
- Are users waiting on locks, I/O, client activity, or other engine wait classes?
- Is one session blocking other sessions, and did deadlocks or long waits increase compared with the previous period?

### Scope

Detailed activity views cover **PostgreSQL**, **SQL Server**, and **Oracle**. MongoDB, Redis, and Valkey are covered by their monitoring, alerting, health, and explorer workflows instead. Query-level performance history belongs in Query Explorer; broader posture across performance, configuration, security, schema, and maintenance belongs to Health Check.

### Reading it

Every metric uses the selected time window and compares against the previous period of the same length. An upward trend is not always bad — rising throughput can simply mean more workload. Rising deadlocks, wait time, blocked sessions, or blocking duration usually deserves review.
