---
sidebar_position: 9
---

# Data Inventory

Data Inventory is in Beta. It classifies the schema metadata of monitored databases — table, column, and field identifiers — to flag where sensitive-data categories are likely to live.

## Purpose

Data Inventory helps operators and security-minded teams answer questions such as:

1. Which tables are likely to contain PII, payment data, or credentials, based on their schema?
2. Which sensitive-looking tables are unencrypted?
3. How exposed is a sensitive table, based on who can access it?
4. Which databases and schemas need closer review before an audit or a data-handling decision?

Data Inventory presents its results as a KPI strip summarizing sensitive-data exposure across monitored databases, followed by a findings table listing each classified table with its data-type categories, encryption status, access level, and a computed risk level. The table can be searched and filtered by engine, schema, encryption status, and risk level.

## How Classification Works

Classification runs automatically, without a manual tagging step. It is model-assisted: automated analysis reviews collected schema identifiers and assigns one or more sensitive-data categories with a confidence score, based on naming patterns rather than the underlying data.

Classification work is triggered by:

- A detected schema change on a supported database.
- A daily sweep that re-evaluates databases which have not been classified recently.

Classification runs are batched and bounded per database, so a single large schema cannot block or overwhelm the classification pipeline. If a run fails partway through, Logstag preserves the previously stored classification for that database rather than replacing it with a partial result.

## Categories

Logstag classifies columns and fields into these categories:

| Category | Examples of what it covers |
| --- | --- |
| PII | Names, emails, phone numbers, national ID numbers, dates of birth. |
| Financial | Bank account details, salaries, invoices, credit scores. |
| Credentials | Passwords, tokens, API keys, session identifiers. |
| Payment | Card and other payment-instrument data. |
| Health | Diagnoses, prescriptions, lab results, medical record numbers. |
| Location | Street addresses, postal codes, GPS coordinates. |
| Legal | Contracts, consent records, litigation data. |
| HR | Employment records not covered by Health. |

A column or field can be classified into more than one category. Generic container columns, such as a JSON payload or blob field, are not classified based on what they might contain.

## Engine Scope

Classification currently runs for PostgreSQL and Microsoft SQL Server. Other supported engines can appear as monitored targets, but Data Inventory does not classify them today.

Encryption status is currently reported for Microsoft SQL Server, based on transparent data encryption. Tables on other engines show an unknown encryption status rather than a claim either way.

## Data Boundaries

Data Inventory classifies schema metadata only: schema names, table names, column names, and field names. It does not read row contents, document contents, or key values from monitored databases. Classification never touches application data — only the identifiers that describe where that data would live.

Because classification works from names rather than content, a finding is an indicator to review, not a confirmed compliance determination. Column and field names that don't clearly describe their contents can be classified incorrectly or missed. Access to Data Inventory should be limited to users who are allowed to review sensitive-data exposure across the organization's databases.
