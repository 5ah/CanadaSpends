# Alberta Government's Revenue and Spending - FY 2023-24

This directory contains the source data, intermediate work-products, and derived JSON files that power the Alberta view in **Canada Spends**.
All monetary figures are expressed in **billions of dollars (B$)** unless noted otherwise.

---

## 1. Folder & File Guide

| Path                                                                     | What it holds                                                                                                                                                                                        | Notes                                                               |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **`summary.json`**                                                       | High-level roll-up of provincial spending (total, per-ministry %, employee count, metadata, generation timestamp).                                                                                   | Generated from the CSVs in `modified data - csv/`.                  |
| **`sankey.json`**                                                        | Node + link arrays used to render the Sankey flow diagram.                                                                                                                                           | Built programmatically from the same CSVs.                          |
| **`departments/`**                                                       | Individual JSON files for each ministry. Currently empty.                                                                                                                                            | Currently empty.                                                    |
| **`modified data - csv/`**                                               | Cleaned & normalised spreadsheets extracted from the original PDFs.                                                                                                                                  | These are the*authoritative* numbers that feed all downstream JSON. |
| &nbsp;&nbsp;└── `Expenses/High level expenses.csv`                       | Provincial totals by functional line-item.                                                                                                                                                           |                                                                     |
| &nbsp;&nbsp;└── `Expenses/High level expenses - grouped by ministry.csv` | Provincial totals re-grouped to ministry buckets.                                                                                                                                                    |                                                                     |
| &nbsp;&nbsp;└── `Expenses/Ministry wise granular expenses/`              | 25+ CSVs, one per ministry, containing detailed expense breakdowns.                                                                                                                                  |                                                                     |
| &nbsp;&nbsp;└── `Revenues grouped.csv`                                   | Consolidated revenue lines (taxes, transfers, investment income, etc.).                                                                                                                              |                                                                     |
| **`raw data - images/`**                                                 | PNG screenshots taken directly from the government PDFs.                                                                                                                                             | Serve as immutable reference evidence.                              |
| &nbsp;&nbsp;└── `expenses high level.png`                                | Overall provincial expense page.                                                                                                                                                                     |                                                                     |
| &nbsp;&nbsp;└── `ministry wise expenses/`                                | 25 PNGs — one per ministry — showing the source tables for granular expenses. (PNG for 26th ministry - Legislative Assembly is<br />not available as it's complete breakdown PDF is not available).  |                                                                     |
| &nbsp;&nbsp;└── `revenue/`                                               | Screenshots for both high-level and granular revenue tables.                                                                                                                                         |                                                                     |

---

## 2. Data Source

_Financial statements and annual reports (FY 2023-24) published by the Government of Alberta._
Official URL: [https://www.alberta.ca/government-and-ministry-annual-reports#23-24](https://www.alberta.ca/government-and-ministry-annual-reports#23-24)

All numbers originate from PDF tables in those documents.
Screenshots in `raw data - images/` demonstrate exactly where each value came from.

---

## 3. Methodology & Key Assumptions

1. **Audited vs. unaudited figure treatment**• Provincial-level totals are audited.• Ministry-level tables are _unaudited_; any difference between their sum and the audited provincial total is recorded as **“Unreported”**.
2. **Legislative Assembly**The Assembly provides no granular breakdown; only its audited provincial total is shown.
3. **Revenues vs. Expenses**• Revenues — only high-level categories are captured.• Expenses — granular ministry tables are captured and reconciled back to the provincial audit figure; residual difference tagged as **Unreported**.
4. **Screenshots as immutable evidence**Every number used is traceable back to an image in `raw data - images/`.
5. **Specific judgment calls** -
   - **Inter-ministry Consolidation Adjustments** under **Advanced Education** Ministry combines \$101.860 M + \$320.848 M = **\$422.7 M**.
   - “Taxpayer-supported Debt Servicing Costs – Capital Plan” has **\$122 M** mentioned as **Education (school P3s) / Transportation (ring road P3s)**. Made an assumption and split it 50:50 between **Education** and **Transportation & Economic Corridors** Ministries ($61 M each). Didn't consider the explicitly mentioned **$116 M** (**Ring Roads – Debt Servicing**) under Transportation & Economic Corridors Ministry's expenses report to decide this ratio as it is unaudited data.
   - **Treasury Board & Finance** lists _Change in unfunded pension obligations_ of **–\$327 M** which equals the calculated “Unreported” amount — needs further investigation.

---

## 4. Contribution Notes

_Authored by:_ **`<Sathvik Divili>`** (GitHub: `@<https://github.com/sathvik3103`>)

- Located, downloaded, and examined all FY 2023-24 Public Accounts PDFs.
- Captured data tables via manual transposition & validation from source PDFs.
- Produced reproducible CSVs (`modified data - csv/`) and traceability screenshots (`raw data - images/`).
- Generated `summary.json` + `sankey.json`.
- Documented assumptions & reconciliation logic (see above).

_Have questions or spot an issue?_
Please open an issue or pull request and reference the specific CSV line or screenshot — every figure is traceable.
