#!/usr/bin/env python3
"""Convert Toronto municipal finances from Excel to Sankey JSON format."""

import json
import os
import re
from datetime import datetime
from typing import Any, Dict

import pandas as pd


def parse_sankeymatic_txt(filepath: str) -> Dict[str, Any]:
    """
    Parse the sankeymatic.txt file to extract the hierarchical structure.
    Returns a dict with 'revenue' and 'spending' tier-1 categories and their totals.
    """
    with open(filepath, 'r') as f:
        content = f.read()

    result = {
        'revenue_tier1': [],
        'spending_tier1': [],
        'revenue_tier2': {},
        'spending_tier2': {},
        'spending_tier3': {}
    }

    # Parse tier-1 revenue items: "Category [amount] Revenue"
    for line in content.split('\n'):
        if '] Revenue' in line and not line.strip().startswith('//'):
            match = re.match(r'^(.+?)\s*\[(-?[0-9.]+)\]\s*Revenue', line.strip())
            if match:
                category = match.group(1).strip()
                amount = float(match.group(2))
                result['revenue_tier1'].append({'name': category, 'amount': amount})

    # Parse tier-1 spending items: "Spending [amount] Category"
    for line in content.split('\n'):
        if line.strip().startswith('Spending ['):
            match = re.match(r'^Spending\s*\[(-?[0-9.]+)\]\s*(.+)$', line.strip())
            if match:
                amount = float(match.group(1))
                category = match.group(2).strip()
                result['spending_tier1'].append({'name': category, 'amount': amount})

    # Parse tier-2 revenue items: "Item [amount] Category"
    current_tier1_rev = None
    for line in content.split('\n'):
        line = line.strip()
        if line.startswith('// Tier 2 -'):
            # Extract the category name
            current_tier1_rev = line.replace('// Tier 2 -', '').strip()
            result['revenue_tier2'][current_tier1_rev] = []
        elif current_tier1_rev and not line.startswith('//') and '[' in line and '] Revenue' not in line:
            # Skip tier-1 lines and comments
            if line.startswith('Spending ['):
                current_tier1_rev = None
                continue
            match = re.match(r'^(.+?)\s*\[(-?[0-9.]+)\]\s*(.+)$', line)
            if match:
                item_name = match.group(1).strip()
                amount = float(match.group(2))
                category = match.group(3).strip()
                result['revenue_tier2'][current_tier1_rev].append({
                    'name': item_name,
                    'amount': amount,
                    'category': category
                })

    # Parse tier-2 spending items: "Category [amount] Item"
    current_section = None
    for line in content.split('\n'):
        line = line.strip()
        if line.startswith('// Tier 2 -') and 'Revenue' not in line:
            current_section = line.replace('// Tier 2 -', '').strip()
            result['spending_tier2'][current_section] = []
        elif line.startswith('// Tier 3'):
            current_section = None
        elif current_section and not line.startswith('//') and '[' in line:
            match = re.match(r'^(.+?)\s*\[(-?[0-9.]+)\]\s*(.+)$', line)
            if match:
                category = match.group(1).strip()
                amount = float(match.group(2))
                item_name = match.group(3).strip()
                result['spending_tier2'][current_section].append({
                    'name': item_name,
                    'amount': amount,
                    'category': category
                })

    # Parse tier-3 spending items: "Tier2Item [amount] LineItem (CODE)"
    current_tier3_section = None
    for line in content.split('\n'):
        line = line.strip()
        if line.startswith('// Tier 3'):
            current_tier3_section = line.replace('// Tier 3 -', '').strip()
        elif line.startswith('// Tier 2'):
            current_tier3_section = None
        elif current_tier3_section and not line.startswith('//') and '[' in line:
            match = re.match(r'^(.+?)\s*\[(-?[0-9.]+)\]\s*(.+)$', line)
            if match:
                tier2_item = match.group(1).strip()
                amount = float(match.group(2))
                line_item = match.group(3).strip()

                if tier2_item not in result['spending_tier3']:
                    result['spending_tier3'][tier2_item] = []
                result['spending_tier3'][tier2_item].append({
                    'name': line_item,
                    'amount': amount
                })

    return result


def load_excel_data(filepath: str) -> Dict[str, pd.DataFrame]:
    """Load all relevant sheets from the Excel file."""
    return {
        'income_tier2': pd.read_excel(filepath, sheet_name='Income Tier 2'),
        'expense_tier2': pd.read_excel(filepath, sheet_name='Expense Tier 2'),
        'expense_tier3': pd.read_excel(filepath, sheet_name='Expesnse Tier 3')
    }


def build_revenue_structure(sankey_data: Dict, excel_data: Dict) -> Dict[str, Any]:
    """
    Build the revenue hierarchy matching Ontario's format.
    Returns the revenue_data structure for the JSON.
    """
    # Get income data from Excel
    df_income = excel_data['income_tier2'][['Name', '2024 ($M)', 'Category']].copy()
    df_income = df_income.dropna(subset=['Name'])
    df_income = df_income[df_income['Name'] != '-']
    df_income = df_income[df_income['Category'].notna()]
    df_income = df_income[~df_income['Category'].isin(['xcl', '$', 'pdf'])]

    revenue_root = {
        'name': 'Revenue',
        'children': []
    }

    # For each tier-1 category from sankeymatic.txt
    for tier1_item in sankey_data['revenue_tier1']:
        tier1_name = tier1_item['name']
        tier1_amount = tier1_item['amount'] / 1000  # Convert millions to billions

        # Find tier-2 children from Excel
        tier2_children = df_income[df_income['Category'] == tier1_name]

        if len(tier2_children) > 0:
            # Has children - create parent node with children
            tier1_node = {
                'name': tier1_name,
                'children': []
            }

            for _, row in tier2_children.iterrows():
                child_node = {
                    'name': f"{tier1_name} → {row['Name']}",
                    'amount': row['2024 ($M)'] / 1000  # Convert to billions
                }
                tier1_node['children'].append(child_node)

            revenue_root['children'].append(tier1_node)
        else:
            # No children - create leaf node directly
            leaf_node = {
                'name': tier1_name,
                'amount': tier1_amount
            }
            revenue_root['children'].append(leaf_node)

    return revenue_root


def build_spending_structure(sankey_data: Dict, excel_data: Dict) -> Dict[str, Any]:
    """
    Build the spending hierarchy with 3 tiers matching Ontario's format.
    Returns the spending_data structure for the JSON.
    """
    df_expense2 = excel_data['expense_tier2'][['Name', '2024 ($M)', 'Category']].copy()
    df_expense2 = df_expense2.dropna(subset=['Name'])
    # Strip whitespace from names
    df_expense2['Name'] = df_expense2['Name'].str.strip()

    df_expense3 = excel_data['expense_tier3'][['Name', '2024 ($M)', 'SubCategory', 'Category']].copy()
    df_expense3 = df_expense3.dropna(subset=['Name'])
    # Strip whitespace from SubCategory for matching
    df_expense3['SubCategory'] = df_expense3['SubCategory'].str.strip()

    spending_root = {
        'name': 'Spending',
        'children': []
    }

    # For each tier-1 category from sankeymatic.txt
    for tier1_item in sankey_data['spending_tier1']:
        tier1_name = tier1_item['name']

        tier1_node = {
            'name': tier1_name,
            'children': []
        }

        # Find tier-2 items from Expense Tier 2 (Excel)
        tier2_items = df_expense2[df_expense2['Category'] == tier1_name]

        # Also get tier-2 items from sankeymatic (includes Unreported items)
        sankey_tier2_items = sankey_data['spending_tier2'].get(tier1_name, [])

        # Process Excel tier-2 items
        for _, tier2_row in tier2_items.iterrows():
            tier2_name = tier2_row['Name']
            tier2_total_m = float(tier2_row['2024 ($M)'])

            # Find tier-3 items from Expense Tier 3 by matching SubCategory to tier-2 Name
            tier3_items = df_expense3[df_expense3['SubCategory'] == tier2_name]

            if len(tier3_items) > 0:
                # Has tier-3 children
                tier2_node = {
                    'name': f"{tier1_name} → {tier2_name}",
                    'children': []
                }

                tier3_total_m = 0.0

                for _, tier3_row in tier3_items.iterrows():
                    tier3_amount_m = float(tier3_row['2024 ($M)'])
                    tier3_total_m += tier3_amount_m

                    tier3_node = {
                        'name': f"{tier1_name} → {tier2_name} → {tier3_row['Name']}",
                        'amount': tier3_amount_m / 1000  # Convert to billions
                    }
                    tier2_node['children'].append(tier3_node)

                difference_m = tier2_total_m - tier3_total_m
                if abs(difference_m) > 1e-3:
                    adjustment_amount_b = round(difference_m / 1000, 9)
                    tier2_node['children'].append({
                        'name': f"{tier1_name} → {tier2_name} → Other (adjustment)",
                        'amount': adjustment_amount_b
                    })

                tier1_node['children'].append(tier2_node)
            else:
                # No tier-3 children - tier-2 is a leaf node
                tier2_node = {
                    'name': f"{tier1_name} → {tier2_name}",
                    'amount': tier2_row['2024 ($M)'] / 1000  # Convert to billions
                }
                tier1_node['children'].append(tier2_node)

        # Add tier-2 items from sankeymatic (e.g., Unreported items)
        for sankey_item in sankey_tier2_items:
            # Only add if not already in Excel (avoid duplicates)
            item_name = sankey_item['name']
            # Check if this item already exists from Excel
            already_exists = any(
                item_name in child['name']
                for child in tier1_node['children']
            )

            if not already_exists:
                # Add as leaf node (Unreported items don't have tier-3 children)
                tier2_node = {
                    'name': f"{tier1_name} → {item_name}",
                    'amount': sankey_item['amount'] / 1000  # Convert to billions
                }
                tier1_node['children'].append(tier2_node)

        spending_root['children'].append(tier1_node)

    return spending_root


def calculate_totals(sankey_data: Dict) -> Dict[str, float]:
    """Calculate total revenue and spending from tier-1 items."""
    revenue_total = sum(item['amount'] for item in sankey_data['revenue_tier1']) / 1000
    spending_total = sum(item['amount'] for item in sankey_data['spending_tier1']) / 1000

    return {
        'total': revenue_total,  # Use revenue total as 'total'
        'revenue': revenue_total,
        'spending': spending_total
    }


def sum_node(node: Dict[str, Any]) -> float:
    """Recursively sum child amounts for a node (values stored in billions)."""
    if node.get('children'):
        return sum(sum_node(child) for child in node['children'])
    return float(node.get('amount', 0.0))


def slugify(value: str) -> str:
    slug = value.lower()
    slug = slug.replace('&', ' and ')
    slug = re.sub(r"[^a-z0-9]+", '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')


def format_compact_currency(amount_billion: float) -> str:
    if amount_billion >= 1:
        formatted = f"${amount_billion:.1f}B"
    else:
        formatted = f"${amount_billion * 1000:.0f}M"
    return formatted.replace('.0B', 'B')


def generate_summary(
    totals: Dict[str, float],
    spending_data: Dict[str, Any],
    revenue_data: Dict[str, Any],
    *,
    population: int,
    total_employees: int,
    source_url: str,
    name: str,
    financial_year: str,
) -> Dict[str, Any]:
    total_spending = totals['spending']
    total_revenue = totals['revenue']
    budget_balance = total_revenue - total_spending

    spending_categories = []
    for child in spending_data['children']:
        category_total = sum_node(child)
        spending_categories.append((child['name'], category_total))

    spending_categories.sort(key=lambda item: item[1], reverse=True)

    ministries = []
    for category_name, category_total in spending_categories:
        percentage = (category_total / total_spending) * 100 if total_spending else 0
        ministries.append({
            'name': category_name,
            'slug': slugify(category_name),
            'totalSpending': category_total,
            'totalSpendingFormatted': format_compact_currency(category_total),
            'percentage': percentage,
            'percentageFormatted': f"{percentage:.1f}%"
        })

    revenue_property_tax = next(
        (child for child in revenue_data['children'] if child['name'] == 'Property taxes & taxation from other governments'),
        None,
    )
    property_tax_total = sum_node(revenue_property_tax) if revenue_property_tax else 0.0

    per_capita_spending = round((total_spending * 1_000_000_000) / population) if population else None
    property_tax_per_capita = (
        round((property_tax_total * 1_000_000_000) / population)
        if population and property_tax_total
        else None
    )

    summary = {
        'name': name,
        'financialYear': financial_year,
        'source': source_url,
        'totalProvincialSpending': total_spending,
        'totalProvincialSpendingFormatted': format_compact_currency(total_spending),
        'totalEmployees': total_employees,
        'netDebt': None,
        'totalDebt': None,
        'debtInterest': None,
        'population': population,
        'budgetBalance': budget_balance,
        'budgetBalanceFormatted': format_compact_currency(abs(budget_balance)),
        'perCapitaSpending': per_capita_spending,
        'propertyTaxPerCapita': property_tax_per_capita,
        'propertyTaxRevenue': property_tax_total,
        'propertyTaxRevenueFormatted': format_compact_currency(property_tax_total),
        'ministries': ministries,
        'generatedAt': datetime.utcnow().replace(microsecond=0).isoformat() + 'Z',
    }

    return summary


def main():
    """Main conversion function."""
    print("Starting Toronto sankey conversion...")

    # Parse sankeymatic.txt
    print("Parsing sankeymatic.txt...")
    sankey_data = parse_sankeymatic_txt('2024_sankeymatic.txt')
    print(f"  Found {len(sankey_data['revenue_tier1'])} revenue tier-1 categories")
    print(f"  Found {len(sankey_data['spending_tier1'])} spending tier-1 categories")

    # Load Excel data
    print("\nLoading Excel data...")
    excel_data = load_excel_data('City_of_Toronto_2024_Actuals - Cleaned.xlsx')
    print("  Excel data loaded successfully")

    # Build structures
    print("\nBuilding revenue structure...")
    revenue_data = build_revenue_structure(sankey_data, excel_data)
    print(f"  Built {len(revenue_data['children'])} revenue categories")

    print("\nBuilding spending structure...")
    spending_data = build_spending_structure(sankey_data, excel_data)
    print(f"  Built {len(spending_data['children'])} spending categories")

    # Calculate totals
    print("\nCalculating totals...")
    totals = calculate_totals(sankey_data)
    print(f"  Total: ${totals['total']:.3f}B")
    print(f"  Revenue: ${totals['revenue']:.3f}B")
    print(f"  Spending: ${totals['spending']:.3f}B")

    population = 2_930_000  # Estimated 2024 population (rounded to nearest thousand)
    total_employees = 44_000
    source_url = 'https://www.toronto.ca/city-government/budget-finances/city-finance/annual-financial-report/'
    jurisdiction_name = 'Toronto'
    financial_year = '2024'

    # Build final JSON structure
    final_json = {
        'total': totals['total'],
        'spending': totals['spending'],
        'revenue': totals['revenue'],
        'spending_data': spending_data,
        'revenue_data': revenue_data
    }

    budget_balance = totals['revenue'] - totals['spending']
    property_tax_node = next(
        (child for child in revenue_data['children'] if child['name'] == 'Property taxes & taxation from other governments'),
        None,
    )
    property_tax_total = sum_node(property_tax_node) if property_tax_node else 0.0
    per_capita_spending = (totals['spending'] * 1_000_000_000) / population
    property_tax_per_capita = (
        (property_tax_total * 1_000_000_000) / population if property_tax_total else None
    )

    final_json.update({
        'population': population,
        'budget_balance': budget_balance,
        'per_capita_spending': round(per_capita_spending) if per_capita_spending else None,
        'property_tax_per_capita': round(property_tax_per_capita) if property_tax_per_capita else None,
        'property_tax_revenue': property_tax_total,
    })

    # Create output directory
    import os
    os.makedirs('data/toronto', exist_ok=True)

    # Save to file
    output_path = 'data/toronto/sankey.json'
    print(f"\nSaving to {output_path}...")
    with open(output_path, 'w') as f:
        json.dump(final_json, f, indent=2)

    summary = generate_summary(
        totals,
        spending_data,
        revenue_data,
        population=population,
        total_employees=total_employees,
        source_url=source_url,
        name=jurisdiction_name,
        financial_year=financial_year,
    )

    summary_path = 'data/toronto/summary.json'
    print(f"Saving to {summary_path}...")
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2)

    print("✓ Conversion complete!")
    print(f"\nOutput saved to: {output_path}")
    print(f"File size: {os.path.getsize(output_path) / 1024:.1f} KB")


if __name__ == '__main__':
    main()
