Findings rated High or Very high confidence.

### How it's calculated

- Sums the **High** and **Very high** findings in the current scope. The Confidence bar under the KPI strip shows the full mix: Very high, High, Medium, and Low.
- Confidence measures how much data backs a finding, not how bad it is (that is severity):
  - **N+1**: how consistently the pattern appeared across the last 15 minutes. At least 90% of minutes gives Very high; at least 70% gives High.
  - **Regression**: how many hours of baseline history the comparison had. At least 100 hours gives Very high; at least 40 gives High. A perfectly flat baseline caps it at Medium.
  - **Workload anomaly**: at most High, which needs at least 4 samples from the same weekday and hour. It is never Very high.
- Confidence is recalculated on every detection pass, so it can go up or down as history builds.

### Reading it

Start with high-confidence findings: they are the least likely to be noise. Low-confidence findings on a new or recently reset database usually firm up once more baseline history exists.
