# British Columbia (BC) Public Accounts 2024/25 — Data Notes

Data sourced from: https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/government-finances/public-accounts/2024-25/public-accounts-2024-25.pdf

This repository contains cleaned tabular data and JSON needed to drive the BC spending/revenue visualizations for the 2024/25 Public Accounts.

I am referencing the financial results of the core provincial government operations, specifically the Consolidated Revenue Fund (CRF) for the fiscal year ended March 31, 2025. These amounts reflect the activity of ministries and legislative offices and are distinct from the broader Consolidated Summary Financial Statements which include Crown corporations and the SUCH (School districts, universities, colleges, institutes, and health organizations) sector.

Based on the CRF Supplementary Schedules, the figures used are:
• Net Consolidated Revenue Fund Revenue (Net Revenue): $64,866,802 thousand (approximately $64.87 billion)

• Total Consolidated Revenue Fund Expense (Total Spending): $77,368,925 thousand (approximately $77.37 billion)

## Sources
- Primary source: Province of British Columbia — Public Accounts 2024/25 (PDF).
- The screenshots in `data/` are crops of those PDF tables to document provenance.

## What’s included
- `final/sankey.json` — hierarchical Spending JSON used for the Sankey. Amounts are stored in billions of dollars.
- Expense (CSV, dollars):
  - `final/cleaned data - csv/expense/Expense_data_consolidated.csv` — two‑column extract (Category, Total) for quick joins. The original table reports in thousands; this file has been scaled ×1,000.
  - `final/cleaned data - csv/expense/Ministry wise granular expenses/*.csv` — one CSV per ministry. These come from the detailed pages of the PDF and are used to construct the Sankey leaves.
- Revenue (CSV, dollars):
  - `final/cleaned data - csv/revenue/bc_revenue_2025.csv` — high‑level revenue lines transcribed from the PDF.
  - `final/cleaned data - csv/revenue/bc_revenue_2025_consolidated.csv` — two‑column extract (Category, Total) with the consolidated categories.

## Units and conventions
- CSV files are in dollars unless otherwise stated. Where source tables are reported in thousands, normalized totals to dollars.
- JSON amounts in `final/sankey.json` are in billions of dollars.

## Methodology and scope
- Revenue: high‑level only (see `final/cleaned data - csv/revenue/bc_revenue_2025.csv`). No per‑ministry revenue breakdown was used.
- Expenses: individual ministry/group CSVs are used for the Sankey leaf nodes; the PDF summary table is used for quality control.
- Assumption: 'Other Appropriations' breaks down to 'Tax Revenue' and 'Capital Funding'; however, using that breakdown caused the total expense sum to be off by approximately $300 million. The consolidated 'Other Appropriations' figure from the summary table ($7,491,242,000) is used to keep totals consistent.

## Reconciliation and validation
- The PDF summary table totals to $77,368,925,000 for "Total Consolidated Revenue Fund Expense 2024/25".

### Granular vs. provincial totals
- The ministry‑wise granular CSVs are direct extractions from detailed pages and can classify some program lines differently than the high‑level summary. Historically this can create a small delta relative to the audited provincial total. The summary table (`Expense_data.csv`) serves as the ground truth for the aggregate total; the granular CSVs provide the Sankey structure and within‑ministry distribution.

## Known assumptions
- Some PDF subtables are summarized in the Sankey (e.g., multiple lines collapsed under a single ministry program). This preserves totals while keeping the visualization legible.
- The Sankey amounts are stored in billions; when cross‑checking against CSVs (dollars), convert units accordingly.

## File map (key outputs)
- `final/sankey.json` — Spending hierarchy (billions)
- `final/cleaned data - csv/expense/Expense_data_consolidated.csv` — Category + Total (dollars; scaled ×1,000)
- `final/cleaned data - csv/expense/Ministry wise granular expenses/` — granular ministry/group CSVs (dollars)
- `final/cleaned data - csv/revenue/bc_revenue_2025.csv` — revenue lines (dollars)
- `final/cleaned data - csv/revenue/bc_revenue_2025_consolidated.csv` — revenue section totals (dollars)

## Attribution
- Data © Province of British Columbia. Report any suspected transcription/normalization errors by opening an issue for corrections.
