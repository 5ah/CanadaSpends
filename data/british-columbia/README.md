# British Columbia (BC) Public Accounts 2024/25 — Data Notes

## Data Source
**Primary document:** [Consolidated Revenue Fund Supplementary Schedules](https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/government-finances/public-accounts/2024-25/pa-2024-25-crf-supplementary-schedules.pdf) for the fiscal year ended March 31, 2025.

**Note:** This document (`pa-2024-25-crf-supplementary-schedules.pdf`) is considered "Unaudited" supplementary information. It contains details on the budgets and spending for individual government ministries, staff utilization, and other financial information on government operations.

This repository contains cleaned tabular data and JSON files needed to drive the BC spending/revenue visualizations for the 2024/25 Public Accounts.

## Key Figures
Based on the CRF Supplementary Schedules:
- **Net Consolidated Revenue Fund Revenue:** $64,866,802 thousand (~$64.87 billion)
- **Total Consolidated Revenue Fund Expense:** $77,368,925 thousand (~$77.37 billion)

## Data Scope
The figures reference the financial results of the core provincial government operations, specifically the Consolidated Revenue Fund (CRF). These amounts reflect the activity of ministries and legislative offices and are distinct from the broader Consolidated Summary Financial Statements which include Crown corporations and the SUCH (School districts, universities, colleges, institutes, and health organizations) sector.

## What's Included
- `sankey.json` — Hierarchical spending and revenue data for Sankey visualizations (amounts in billions)
- `summary.json` — Provincial metadata including total spending, debt, and ministry-level summaries
- **Expense CSVs** (amounts in dollars):
  - `cleaned data - csv/expense/Expense_data_consolidated.csv` — Two-column extract (Category, Total). Original table reports in thousands; this file has been scaled ×1,000
  - `cleaned data - csv/expense/Ministry wise granular expenses/*.csv` — 31 ministry-level CSV files with detailed program breakdowns
- **Revenue CSVs** (amounts in dollars):
  - `cleaned data - csv/revenue/bc_revenue_2025.csv` — Detailed revenue lines transcribed from the PDF
  - `cleaned data - csv/revenue/bc_revenue_2025_consolidated.csv` — Consolidated revenue categories
- **Source Evidence:**
  - `data/expense/` — 36 PNG screenshots from source PDF expense tables
  - `data/revenue/` — 1 PNG screenshot from source PDF revenue table

## Units and Conventions
- CSV files are in **dollars** (scaled from thousands in source documents)
- JSON amounts in `sankey.json` are in **billions of dollars**
- All monetary values have been normalized for consistency

## Methodology and Scope
- **Revenue:** High-level categories only. No per-ministry revenue breakdown was used
- **Expenses:** Individual ministry CSVs are used for Sankey leaf nodes; the PDF summary table is used for quality control
- **Key Assumption:** 'Other Appropriations' is kept as a single consolidated figure ($7,491,242,000) rather than broken down, as the breakdown caused a ~$300M discrepancy

## Reconciliation and Validation
- The PDF summary table totals to **$77,368,925,000** for "Total Consolidated Revenue Fund Expense 2024/25"
- Ministry-level granular data may classify some programs differently than the high-level summary, creating minor deltas
- The summary table serves as ground truth for aggregate totals; granular CSVs provide structure for visualizations

## Known Assumptions
- Some PDF subtables are summarized in the Sankey (e.g., multiple lines collapsed under a single ministry program) to preserve totals while keeping visualizations legible
- When cross-checking between JSON (billions) and CSVs (dollars), remember to convert units accordingly

## File Structure
```
data/british-columbia/
├── README.md
├── summary.json                              # Provincial metadata
├── sankey.json                               # Hierarchical spending/revenue data (billions)
├── cleaned data - csv/
│   ├── expense/
│   │   ├── Expense_data_consolidated.csv    # Consolidated expense categories
│   │   └── Ministry wise granular expenses/  # 31 ministry-level CSVs
│   └── revenue/
│       ├── bc_revenue_2025.csv              # Detailed revenue breakdown
│       └── bc_revenue_2025_consolidated.csv # Consolidated revenue categories
└── data/
    ├── expense/                              # 36 PNG source screenshots
    └── revenue/                              # 1 PNG source screenshot
```

## Attribution
Data © Province of British Columbia. Report any suspected transcription/normalization errors by opening an issue.
