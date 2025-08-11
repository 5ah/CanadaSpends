"use client";

import React from "react";
import { useLingui } from "@lingui/react/macro";
import { useMemo, useState, useEffect, useCallback } from "react";
import { SankeyChart } from "./SankeyChart";
import { SankeyData } from "./SankeyChartD3";
import { Trans } from "@lingui/react/macro";
import { H2, Section, PageContent } from "@/components/Layout";

interface SpendingReductions {
  [key: string]: number; // Department Name -> Reduction Percentage
}

interface BudgetNode {
  name: string;
  amount2024?: number;
  amount2025?: number;
  amount?: number;
  children?: BudgetNode[];
}

interface BudgetSankeyProps {
  onDataChange?: (data: {
    spending: number;
    revenue: number;
    deficit: number;
  }) => void;
}

export function BudgetSankey({ onDataChange }: BudgetSankeyProps = {}) {
  const { t } = useLingui();

  // Grouped Spending Reductions (in percentages) - 9 Major Categories
  const [spendingReductions, setSpendingReductions] =
    useState<SpendingReductions>({
      Health: 7.5, // Health Research, Health Care Systems, Food Safety, Public Health
      "Public Safety": 7.5, // CSIS, Corrections, RCMP, Justice System, Support for Veterans
      "Social Services & Employment": 7.5, // Employment + Training, Housing Assistance, Gender Equality, Support for Veterans
      "Economy + Innovation & Research": 7.5, // Investment/Growth/Commercialization, Research, Statistics Canada, Other Boards + Councils
      "Immigration & Border Services": 7.5, // Border Security, Immigration Services, Settlement Assistance, Citizenship + Passports
      "Government Operations": 7.5, // Public Services + Procurement, Government IT, Parliament, Privy Council, Treasury Board
      "Culture & Official Languages": 7.5, // Official Languages + Culture
      "Revenue & Tax Administration": 7.5, // Revenue Canada
      "Other Federal Programs": 0, // Spending Classified as "Off-Limits to Cuts"
      "International Affairs": 7.5, // International Development, International Trade, International Cooperation, International Security, International Development, International Trade, International Cooperation, International Security
    });

  // Mapping From Detailed Department Names to Broader Categories
  const getDepartmentCategory = (departmentName: string): string => {
    const categoryMap: { [key: string]: string } = {
      "Health Care Systems + Protection": "Health",
      "Food Safety": "Health",
      "Public Health + Disease Prevention": "Health",
      "Health Research": "Health",

      RCMP: "Public Safety",
      Corrections: "Public Safety",
      "Justice System": "Public Safety",
      "Community Safety": "Public Safety",
      CSIS: "Public Safety",
      "Disaster Relief": "Public Safety",
      "Other Public Safety Expenses": "Public Safety",

      "Employment + Training": "Social Services & Employment",
      "Housing Assistance": "Social Services & Employment",
      "Gender Equality": "Social Services & Employment",

      "Other Immigration Services": "Immigration & Border Services",
      "Border Security": "Immigration & Border Services",
      "Settlement Assistance": "Immigration & Border Services",
      "Citizenship + Passports": "Immigration & Border Services",
      "Visitors, International Students + Temporary Workers":
        "Immigration & Border Services",
      "Interim Housing Assistance": "Immigration & Border Services",

      "Other International Affairs Activities": "International Affairs",
      "Development, Peace + Security Programming": "International Affairs",
      "Support for Embassies + Canada's Presence Abroad":
        "International Affairs",
      "International Diplomacy": "International Affairs",
      "Trade and Investment": "International Affairs",
      "International Development Research Centre": "International Affairs",

      "Investment, Growth and Commercialization":
        "Economy + Innovation & Research",
      Research: "Economy + Innovation & Research",
      "Statistics Canada": "Economy + Innovation & Research",
      "Other Boards + Councils": "Economy + Innovation & Research",
      "Infrastructure Investments": "Economy + Innovation & Research",
      "Innovative and Sustainable Natural Resources Development":
        "Economy + Innovation & Research",
      "Nuclear Labs + Decommissioning": "Economy + Innovation & Research",
      "Support for Global Competition": "Economy + Innovation & Research",
      "Natural Resources Science + Risk Mitigation":
        "Economy + Innovation & Research",
      "Other Natural Resources Management Support":
        "Economy + Innovation & Research",
      Transportation: "Economy + Innovation & Research",
      "Coastguard Operations": "Economy + Innovation & Research",
      "Fisheries + Aquatic Ecosystems": "Economy + Innovation & Research",
      "Other Fisheries Expenses": "Economy + Innovation & Research",
      Agriculture: "Economy + Innovation & Research",
      "Other Environment and Climate Change Programs":
        "Economy + Innovation & Research",
      "Weather Services": "Economy + Innovation & Research",
      "Nature Conservation": "Economy + Innovation & Research",
      "National Parks": "Economy + Innovation & Research",
      Space: "Economy + Innovation & Research",
      "Banking + Finance": "Economy + Innovation & Research",

      "Other Public Services + Procurement": "Government Operations",
      "Government IT Operations": "Government Operations",
      Parliament: "Government Operations",
      "Privy Council Office": "Government Operations",
      "Treasury Board": "Government Operations",
      "Office of the Secretary to the Governor General":
        "Government Operations",
      "Office of the Chief Electoral Officer": "Government Operations",

      "Official Languages + Culture": "Culture & Official Languages",

      "Revenue Canada": "Revenue & Tax Administration",
    };

    return categoryMap[departmentName] || "Other Federal Programs";
  };

  // Function to Apply Spending Reduction to an Amount
  const applyReduction = (amount: number, departmentName: string): number => {
    const category = getDepartmentCategory(departmentName);
    const reduction = spendingReductions[category] || 0;
    return amount * (1 - reduction / 100);
  };

  // Function to Calculate Total from Nested Structure
  const calculateTotal = useCallback(
    (node: BudgetNode, useProjected: boolean = true): number => {
      if (
        typeof node.amount2024 === "number" &&
        typeof node.amount2025 === "number"
      ) {
        return useProjected ? node.amount2025 : node.amount2024;
      }
      if (node.children && Array.isArray(node.children)) {
        return node.children.reduce(
          (sum: number, child: BudgetNode) =>
            sum + calculateTotal(child, useProjected),
          0,
        );
      }
      return 0;
    },
    [],
  );

  // Function to Apply Reductions and Update 2025 Structure
  const applyReductionsToData = useCallback(
    (node: BudgetNode): BudgetNode => {
      if (
        typeof node.amount2024 === "number" &&
        typeof node.amount2025 === "number"
      ) {
        const amount2024 = node.amount2024;
        const amount2025 = applyReduction(node.amount2025, node.name);
        return {
          ...node,
          amount2024: amount2024,
          amount2025: amount2025,
          amount: amount2025,
        };
      }
      if (node.children && Array.isArray(node.children)) {
        // This is a Parent Node with Children
        return {
          ...node,
          children: node.children.map((child: BudgetNode) =>
            applyReductionsToData(child),
          ),
        };
      }
      return node;
    },
    [spendingReductions],
  );

  // Function to Process Revenue Data (no reductions, just add 'amount' property)
  const processRevenueData = useCallback((node: BudgetNode): BudgetNode => {
    // Handle nodes with amount2024 and amount2025 already set
    if (
      typeof node.amount2024 === "number" &&
      typeof node.amount2025 === "number"
    ) {
      return {
        ...node,
        amount: node.amount2025, // Use 2025 amount for chart compatibility
      };
    }
    if (node.children && Array.isArray(node.children)) {
      // This is a Parent Node with Children
      return {
        ...node,
        children: node.children.map((child: BudgetNode) =>
          processRevenueData(child),
        ),
      };
    }
    return node;
  }, []);

  const data = useMemo(() => {
    const baseSpendingData = {
      name: t`Spending`,
      children: [
        {
          name: t`Economy and Standard of Living`,
          children: [
            {
              name: t`Standard of Living`,
              children: [
                {
                  name: t`Health`,
                  children: [
                    {
                      name: t`Health Research`,
                      amount2024: 1.35,
                      amount2025: 1.35,
                    },
                    {
                      name: t`Health Care Systems + Protection`,
                      amount2024: 6.85,
                      amount2025: 6.85,
                    },
                    {
                      name: t`Food Safety`,
                      amount2024: 1.08,
                      amount2025: 1.08,
                    },
                    {
                      name: t`Public Health + Disease Prevention`,
                      amount2024: 4.43,
                      amount2025: 4.43,
                    },
                  ],
                },
                {
                  name: t`Standard of Living`,
                  children: [
                    {
                      name: t`Revenue Canada`,
                      amount2024: 6.94,
                      amount2025: 6.94,
                    },
                    {
                      name: t`Employment + Training`,
                      amount2024: 28.26,
                      amount2025: 28.26,
                    },
                    {
                      name: t`Housing Assistance`,
                      amount2024: 5.43,
                      amount2025: 5.43,
                    },
                    {
                      name: t`Gender Equality`,
                      amount2024: 0.32,
                      amount2025: 0.32,
                    },
                    {
                      name: t`Official Languages + Culture`,
                      amount2024: 4.78,
                      amount2025: 4.78,
                    },
                    {
                      name: t`Support for Veterans`,
                      amount2024: 6.07,
                      amount2025: 6.07,
                    },
                    {
                      name: t`Carbon Tax Rebate`,
                      amount2024: 9.86,
                      amount2025: 0,
                    },
                  ],
                },
              ],
            },
            {
              name: t`Economy + Infrastructure`,
              children: [
                {
                  name: t`Innovation + Research`,
                  children: [
                    {
                      name: t`Investment, Growth and Commercialization`,
                      amount2024: 4.35,
                      amount2025: 4.35,
                    },
                    {
                      name: t`Research`,
                      amount2024: 4.11,
                      amount2025: 4.11,
                    },
                    {
                      name: t`Statistics Canada`,
                      amount2024: 0.74,
                      amount2025: 0.74,
                    },
                    {
                      name: t`Other Boards + Councils`,
                      amount2024: 0.18,
                      amount2025: 0.18,
                    },
                  ],
                },
                {
                  name: t`Community and Regional Development`,
                  children: [
                    {
                      name: t`Economic Development in Southern Ontario`,
                      amount2024: 0.46,
                      amount2025: 0.46,
                    },
                    {
                      name: t`Economic Development in Atlantic Canada`,
                      amount2024: 0.39,
                      amount2025: 0.39,
                    },
                    {
                      name: t`Economic Development in the Pacific Region`,
                      amount2024: 0.19,
                      amount2025: 0.19,
                    },
                    {
                      name: t`Western + Northern Economic Development`,
                      amount2024: 1.09,
                      amount2025: 1.09,
                    },
                    {
                      name: t`Economic Development in Northern Ontario`,
                      amount2024: 0.07,
                      amount2025: 0.07,
                    },
                    {
                      name: t`Economic Development in Quebec`,
                      amount2024: 0.39,
                      amount2025: 0.39,
                    },
                  ],
                },
                {
                  name: t`Fisheries`,
                  children: [
                    {
                      name: t`Coastguard Operations`,
                      amount2024: 1.8,
                      amount2025: 1.8,
                    },
                    {
                      name: t`Fisheries + Aquatic Ecosystems`,
                      amount2024: 1.78,
                      amount2025: 1.78,
                    },
                    {
                      name: t`Other Fisheries Expenses`,
                      amount2024: 0.97,
                      amount2025: 0.97,
                    },
                  ],
                },
                {
                  name: t`Agriculture`,
                  amount2024: 4.19,
                  amount2025: 4.19,
                },
                {
                  name: t`Space`,
                  amount2024: 0.45,
                  amount2025: 0.45,
                },
                {
                  name: t`Banking + Finance`,
                  amount2024: 0.23,
                  amount2025: 0.23,
                },
                {
                  name: t`Environment and Climate Change`,
                  children: [
                    {
                      name: t`Other Environment and Climate Change Programs`,
                      amount2024: 1.46,
                      amount2025: 1.46,
                    },
                    {
                      name: t`Weather Services`,
                      amount2024: 0.28,
                      amount2025: 0.28,
                    },
                    {
                      name: t`Nature Conservation`,
                      amount2024: 0.72,
                      amount2025: 0.72,
                    },
                    {
                      name: t`National Parks`,
                      amount2024: 1.45,
                      amount2025: 1.45,
                    },
                  ],
                },
                {
                  name: t`Natural Resources Management`,
                  children: [
                    {
                      name: t`Innovative and Sustainable Natural Resources Development`,
                      amount2024: 1.911,
                      amount2025: 1.911,
                    },
                    {
                      name: t`Support for Global Competition`,
                      amount2024: 0.874,
                      amount2025: 0.874,
                    },
                    {
                      name: t`Nuclear Labs + Decommissioning`,
                      amount2024: 1.514,
                      amount2025: 1.514,
                    },
                    {
                      name: t`Natural Resources Science + Risk Mitigation`,
                      amount2024: 0.452,
                      amount2025: 0.452,
                    },
                    {
                      name: t`Other Natural Resources Management Support`,
                      amount2024: 0.344,
                      amount2025: 0.344,
                    },
                  ],
                },
                {
                  name: t`Infrastructure Investments`,
                  amount2024: 9.02,
                  amount2025: 9.02,
                },
                {
                  name: t`Transportation`,
                  amount2024: 5.31,
                  amount2025: 5.31,
                },
              ],
            },
          ],
        },
        {
          name: t`Social Security`,
          children: [
            {
              name: t`Retirement Benefits`,
              amount2024: 76.03,
              amount2025: 76.03,
            },
            {
              name: t`Employment Insurance`,
              amount2024: 23.13,
              amount2025: 23.13,
            },
            {
              name: t`Children's Benefits`,
              amount2024: 26.34,
              amount2025: 26.34,
            },
            {
              name: t`COVID-19 Income Support`,
              amount2024: -4.84,
              amount2025: 0,
            },
            {
              name: t`Canada Emergency Wage Subsidy`,
              amount2024: -0.42,
              amount2025: 0,
            },
          ],
        },
        {
          name: t`Safety`,
          children: [
            {
              name: t`Public Safety`,
              children: [
                {
                  name: t`CSIS`,
                  amount2024: 0.83,
                  amount2025: 0.83,
                },
                {
                  name: t`Corrections`,
                  amount2024: 3.374,
                  amount2025: 3.374,
                },
                {
                  name: t`RCMP`,
                  amount2024: 5.14,
                  amount2025: 5.14,
                },
                {
                  name: t`Disaster Relief`,
                  amount2024: 0.52,
                  amount2025: 0.52,
                },
                {
                  name: t`Community Safety`,
                  amount2024: 0.839,
                  amount2025: 0.839,
                },
                {
                  name: t`Office of the Chief Electoral Officer`,
                  amount2024: 0.249,
                  amount2025: 0.249,
                },
                {
                  name: t`Other Public Safety Expenses`,
                  amount2024: 0.269,
                  amount2025: 0.269,
                },
                {
                  name: t`Justice System`,
                  amount2024: 2.442,
                  amount2025: 2.442,
                },
              ],
            },
            {
              name: t`Immigration + Border Security`,
              children: [
                {
                  name: t`Border Security`,
                  amount2024: 2.69,
                  amount2025: 2.69,
                },
                {
                  name: t`Other Immigration Services`,
                  amount2024: 3.389,
                  amount2025: 3.389,
                },
                {
                  name: t`Settlement Assistance`,
                  amount2024: 1.926,
                  amount2025: 1.926,
                },
                {
                  name: t`Interim Housing Assistance`,
                  amount2024: 0.26,
                  amount2025: 0.26,
                },
                {
                  name: t`Visitors, International Students + Temporary Workers`,
                  amount2024: 0.52,
                  amount2025: 0.52,
                },
                {
                  name: t`Citizenship + Passports`,
                  amount2024: 0.24,
                  amount2025: 0.24,
                },
              ],
            },
          ],
        },
        {
          name: t`Other`,
          children: [
            {
              name: t`Public Works + Government Services`,
              children: [
                {
                  name: t`Other Public Services + Procurement`,
                  amount2024: 5.388,
                  amount2025: 5.388,
                },
                {
                  name: t`Government IT Operations`,
                  amount2024: 2.7,
                  amount2025: 2.7,
                },
              ],
            },
            {
              name: t`Functioning of Government`,
              children: [
                {
                  name: t`Parliament`,
                  amount2024: 0.93,
                  amount2025: 0.93,
                },
                {
                  name: t`Privy Council Office`,
                  amount2024: 0.347,
                  amount2025: 0.347,
                },
                {
                  name: t`Treasury Board`,
                  amount2024: 4.954,
                  amount2025: 4.954,
                },
                {
                  name: t`Office of the Secretary to the Governor General`,
                  amount2024: 0.026,
                  amount2025: 0.026,
                },
              ],
            },
            {
              name: t`Net actuarial losses`,
              amount2024: -7.49,
              amount2025: -7.49,
            },
          ],
        },
        {
          name: t`Transfers to Provinces`,
          link: "https://www.canada.ca/en/department-finance/programs/federal-transfers/major-federal-transfers.html",
          children: [
            {
              name: t`Health Transfer to Provinces`,
              children: [
                {
                  name: t`Newfoundland and Labrador HTP`,
                  amount2024: 0.666,
                  amount2025: 0.666,
                },
                {
                  name: t`Prince Edward Island HTP`,
                  amount2024: 0.214,
                  amount2025: 0.214,
                },
                {
                  name: t`Nova Scotia HTP`,
                  amount2024: 1.303,
                  amount2025: 1.303,
                },
                {
                  name: t`New Brunswick HTP`,
                  amount2024: 1.027,
                  amount2025: 1.027,
                },
                {
                  name: t`Quebec HTP`,
                  amount2024: 10.911,
                  amount2025: 10.911,
                },
                {
                  name: t`Ontario HTP`,
                  amount2024: 19.266,
                  amount2025: 19.266,
                },
                {
                  name: t`Manitoba HTP`,
                  amount2024: 1.794,
                  amount2025: 1.794,
                },
                {
                  name: t`Saskatchewan HTP`,
                  amount2024: 1.491,
                  amount2025: 1.491,
                },
                {
                  name: t`Alberta HTP`,
                  amount2024: 5.771,
                  amount2025: 5.771,
                },
                {
                  name: t`British Columbia HTP`,
                  amount2024: 6.817,
                  amount2025: 6.817,
                },
                {
                  name: t`Yukon HTP`,
                  amount2024: 0.056,
                  amount2025: 0.056,
                },
                {
                  name: t`Northwest Territories HTP`,
                  amount2024: 0.055,
                  amount2025: 0.055,
                },
                {
                  name: t`Nunavut HTP`,
                  amount2024: 0.05,
                  amount2025: 0.05,
                },
              ],
            },
            {
              name: t`Social Transfer to Provinces`,
              children: [
                {
                  name: t`Newfoundland and Labrador STP`,
                  amount2024: 0.221,
                  amount2025: 0.221,
                },
                {
                  name: t`Prince Edward Island STP`,
                  amount2024: 0.071,
                  amount2025: 0.071,
                },
                {
                  name: t`Nova Scotia STP`,
                  amount2024: 0.433,
                  amount2025: 0.433,
                },
                {
                  name: t`New Brunswick STP`,
                  amount2024: 0.341,
                  amount2025: 0.341,
                },
                {
                  name: t`Quebec STP`,
                  amount2024: 3.624,
                  amount2025: 3.624,
                },
                {
                  name: t`Ontario STP`,
                  amount2024: 6.4,
                  amount2025: 6.4,
                },
                {
                  name: t`Manitoba STP`,
                  amount2024: 0.596,
                  amount2025: 0.596,
                },
                {
                  name: t`Saskatchewan STP`,
                  amount2024: 0.495,
                  amount2025: 0.495,
                },
                {
                  name: t`Alberta STP`,
                  amount2024: 1.917,
                  amount2025: 1.917,
                },
                {
                  name: t`British Columbia STP`,
                  amount2024: 2.264,
                  amount2025: 2.264,
                },
                {
                  name: t`Yukon STP`,
                  amount2024: 0.019,
                  amount2025: 0.019,
                },
                {
                  name: t`Northwest Territories STP`,
                  amount2024: 0.018,
                  amount2025: 0.018,
                },
                {
                  name: t`Nunavut STP`,
                  amount2024: 0.017,
                  amount2025: 0.017,
                },
              ],
            },
            {
              name: t`Equalization Payments to Provinces`,
              children: [
                {
                  name: t`Newfoundland and Labrador EQP`,
                  amount2024: 0,
                  amount2025: 0,
                },
                {
                  name: t`Prince Edward Island EQP`,
                  amount2024: 0.561,
                  amount2025: 0.561,
                },
                {
                  name: t`Nova Scotia EQP`,
                  amount2024: 2.803,
                  amount2025: 2.803,
                },
                {
                  name: t`New Brunswick EQP`,
                  amount2024: 2.631,
                  amount2025: 2.631,
                },
                {
                  name: t`Quebec EQP`,
                  amount2024: 14.037,
                  amount2025: 14.037,
                },
                {
                  name: t`Ontario EQP`,
                  amount2024: 0.421,
                  amount2025: 0.421,
                },
                {
                  name: t`Manitoba EQP`,
                  amount2024: 3.51,
                  amount2025: 3.51,
                },
                {
                  name: t`Saskatchewan EQP`,
                  amount2024: 0,
                  amount2025: 0,
                },
                {
                  name: t`Alberta EQP`,
                  amount2024: 0,
                  amount2025: 0,
                },
                {
                  name: t`British Columbia EQP`,
                  amount2024: 0,
                  amount2025: 0,
                },
                {
                  name: t`Yukon EQP`,
                  amount2024: 0,
                  amount2025: 0,
                },
                {
                  name: t`Northwest Territories EQP`,
                  amount2024: 0,
                  amount2025: 0,
                },
                {
                  name: t`Nunavut EQP`,
                  amount2024: 0,
                  amount2025: 0,
                },
              ],
            },
            {
              name: t`Quebec Tax Offset`,
              amount2024: -7.1,
              amount2025: -7.1,
            },
            {
              name: t`Other Major Transfers`,
              amount2024: 17.6,
              amount2025: 17.6,
            },
          ],
        },
        {
          name: t`Obligations`,
          children: [
            {
              name: t`Net Interest on Debt`,
              amount2024: 47.27,
              amount2025: 47.27,
            },
          ],
        },
        {
          name: t`Defence`,
          children: [
            {
              name: t`Ready Forces`,
              amount2024: 13.368,
              amount2025: 16.368,
            },
            {
              name: t`Defence Procurement`,
              amount2024: 4.93,
              amount2025: 7.93,
            },
            {
              name: t`Sustainable Bases, IT Systems, Infrastructure`,
              amount2024: 4.913,
              amount2025: 4.913,
            },
            {
              name: t`Defence Team`,
              amount2024: 5.39,
              amount2025: 8.09,
            },
            {
              name: t`Future Force Design`,
              amount2024: 1.472,
              amount2025: 1.472,
            },
            {
              name: t`Defence Operations + Internal Services`,
              amount2024: 3.39,
              amount2025: 3.39,
            },
            {
              name: t`Communications Security Establishment`,
              amount2024: 1.01,
              amount2025: 1.01,
            },
            {
              name: t`Other Defence`,
              amount2024: 0.01,
              amount2025: 0.01,
            },
          ],
        },
        {
          name: t`Indigenous Priorities`,
          children: [
            {
              name: t`Indigenous Well-Being + Self Determination`,
              children: [
                {
                  name: t`Grants to Support the New Fiscal Relationship with First Nations`,
                  amount2024: 1.36,
                  amount2025: 1.36,
                },
                {
                  name: t`Community Infrastructure Grants`,
                  amount2024: 3.31,
                  amount2025: 3.31,
                },
                {
                  name: t`First Nations Elementary and Secondary Educational Advancement`,
                  amount2024: 2.56,
                  amount2025: 2.56,
                },
                {
                  name: t`On-reserve Income Support in Yukon Territory`,
                  amount2024: 1.4,
                  amount2025: 1.4,
                },
                {
                  name: t`First Nations and Inuit Health Infrastructure Support`,
                  amount2024: 1.22,
                  amount2025: 1.22,
                },
                {
                  name: t`Emergency Management Activities On-Reserve`,
                  amount2024: 0.59,
                  amount2025: 0.59,
                },
                {
                  name: t`Prevention and Protection Services for Children, Youth, Families and Communities`,
                  amount2024: 3.57,
                  amount2025: 3.57,
                },
                {
                  name: t`First Nations and Inuit Primary Health Care`,
                  amount2024: 3.03,
                  amount2025: 3.03,
                },
                {
                  name: t`Other Support for Indigenous Well-Being`,
                  amount2024: 9.45,
                  amount2025: 9.45,
                },
              ],
            },
            {
              name: t`Crown-Indigenous Relations`,
              children: [
                {
                  name: t`Claims Settlements`,
                  children: [
                    {
                      name: t`Out of Court Settlement`,
                      amount2024: 5.0,
                      amount2025: 0,
                    },
                    {
                      name: t`Gottfriedson Band Class Settlement`,
                      amount2024: 2.82,
                      amount2025: 0,
                    },
                    {
                      name: t`Childhood Claims Settlement`,
                      amount2024: 1.42,
                      amount2025: 0,
                    },
                    {
                      name: t`Other Settlement Agreements`,
                      amount2024: 0.85,
                      amount2025: 0,
                    },
                  ],
                },
                {
                  name: t`Other Grants and Contributions to Support Crown-Indigenous Relations`,
                  amount2024: 6.26,
                  amount2025: 6.26,
                },
              ],
            },
          ],
        },
        {
          name: t`International Affairs`,
          children: [
            {
              name: t`Development, Peace + Security Programming`,
              amount2024: 5.37,
              amount2025: 5.37,
            },
            {
              name: t`International Diplomacy`,
              amount2024: 1.0,
              amount2025: 1.0,
            },
            {
              name: t`International Development Research Centre`,
              amount2024: 0.16,
              amount2025: 0.16,
            },
            {
              name: t`Support for Embassies + Canada's Presence Abroad`,
              amount2024: 1.23,
              amount2025: 1.23,
            },
            {
              name: t`Other International Affairs Activities`,
              amount2024: 11.03,
              amount2025: 11.03,
            },
            {
              name: t`Trade and Investment`,
              amount2024: 0.41,
              amount2025: 0.41,
            },
          ],
        },
      ],
    };

    const revenueData = {
      name: t`Revenue`,
      children: [
        {
          name: t`Other Taxes and Duties`,
          children: [
            {
              name: t`Goods and Services Tax`,
              amount2024: 51.42,
              amount2025: 51.42,
            },
            {
              name: t`Energy Taxes`,
              children: [
                {
                  name: t`Excise Tax — Gasoline`,
                  amount2024: 4.33,
                  amount2025: 4.33,
                },
                {
                  name: t`Excise Tax - Diesel Fuel`,
                  amount2024: 1.12,
                  amount2025: 1.12,
                },
                {
                  name: t`Excise Tax — Aviation Gasoline and Jet Fuel`,
                  amount2024: 0.14,
                  amount2025: 0.14,
                },
              ],
            },
            {
              name: t`Customs Duties`,
              amount2024: 5.57,
              amount2025: 5.57,
            },
            {
              name: t`Other Excise Taxes and Duties`,
              children: [
                {
                  name: t`Excise Duties`,
                  amount2024: 5.33,
                  amount2025: 5.33,
                },
                {
                  name: t`Air Travellers Charge`,
                  amount2024: 1.5,
                  amount2025: 1.5,
                },
              ],
            },
          ],
        },
        {
          name: t`Individual Income Taxes`,
          amount2024: 217.7,
          amount2025: 212.3,
        },
        {
          name: t`Corporate Income Taxes`,
          amount2024: 82.47,
          amount2025: 82.47,
        },
        {
          name: t`Non-resident Income Taxes`,
          amount2024: 12.54,
          amount2025: 12.54,
        },
        {
          name: t`Payroll Taxes`,
          children: [
            {
              name: t`Employment Insurance Premiums`,
              amount2024: 29.56,
              amount2025: 29.56,
            },
          ],
        },
        {
          name: t`Carbon Tax Revenue`,
          amount2024: 9.86,
          amount2025: 0,
        },
        {
          name: t`Other Non-tax Revenue`,
          children: [
            {
              name: t`Crown Corporations and other government business enterprises`,
              amount2024: 3.22,
              amount2025: 3.22,
            },
            {
              name: t`Net Foreign Exchange Revenue`,
              amount2024: 3.4,
              amount2025: 3.4,
            },
            {
              name: t`Return on Investments`,
              amount2024: 0.88,
              amount2025: 0.88,
            },
            {
              name: t`Sales of Government Goods + Services`,
              amount2024: 13.99,
              amount2025: 13.99,
            },
            {
              name: t`Miscellaneous revenues`,
              amount2024: 15.87,
              amount2025: 15.87,
            },
          ],
        },
      ],
    };

    // Apply Dynamic Reductions to Spending Data (updates 2025 amounts based on sliders)
    const adjustedSpendingData = applyReductionsToData(baseSpendingData);

    // Process Revenue Data to add 'amount' property for chart compatibility (no reductions applied)
    const processedRevenueData = processRevenueData(revenueData);

    // Calculate Totals Dynamically
    const baselineSpendingTotal = calculateTotal(adjustedSpendingData, false); // 2024 baseline
    const projectedSpendingTotal = calculateTotal(adjustedSpendingData, true); // 2025 projected (with slider reductions)
    const revenueTotal = calculateTotal(processedRevenueData, true); // Revenue uses 2025 amounts
    const totalBudget = Math.max(projectedSpendingTotal, revenueTotal);

    return JSON.parse(
      JSON.stringify({
        total: totalBudget,
        spending: projectedSpendingTotal, // 2025 projected spending (with reductions)
        revenue: revenueTotal,
        spending_data: adjustedSpendingData, // Contains both 2024 baseline and dynamically calculated 2025 amounts
        revenue_data: processedRevenueData, // Revenue data with 'amount' property for chart compatibility
        baseline_spending: baselineSpendingTotal, // 2024 baseline spending
      }),
    );
  }, [t, applyReductionsToData, calculateTotal, processRevenueData]);

  // Notify Parent Component of Data Changes (using useEffect to avoid setState during render)
  useEffect(() => {
    if (onDataChange && data) {
      onDataChange({
        spending: data.spending,
        revenue: data.revenue,
        deficit: data.spending - data.revenue,
      });
    }
  }, [data, onDataChange]);

  // Function to Update Spending Reduction for a Specific Category
  const updateSpendingReduction = (category: string, reduction: number) => {
    setSpendingReductions((prev) => ({
      ...prev,
      [category]: reduction,
    }));
  };

  return (
    <div>
      {/* Sankey Chart */}
      <SankeyChart data={data as SankeyData} />

      {/* Spending Reduction Controls */}
      <PageContent>
        <Section>
          <H2 className="text-white">
            <Trans>Department Spending Reductions</Trans>
          </H2>
          <div className="mt-6 p-4 bg-blue-900 rounded-lg">
            <p className="text-sm text-white">
              <Trans>
                Adjust sliders to see how department spending reductions affect
                the overall Fall 2025 Budget. The Minister of Finance has asked
                departments to reduce spending by 7.5% in 2026-27, 10% in
                2027-28, and 15% in 2028-29.
              </Trans>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Object.entries(spendingReductions)
              .filter(([category]) => category !== "Other Federal Programs")
              .map(([category, reduction]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-white">
                      {category}
                    </label>
                    <span className="text-sm font-semibold text-white">
                      {reduction}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={reduction}
                    onChange={(e) =>
                      updateSpendingReduction(
                        category,
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(reduction / 15) * 100}%, #E5E7EB ${(reduction / 20) * 100}%, #E5E7EB 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-white">
                    <span>0%</span>
                    <span>15%</span>
                  </div>
                </div>
              ))}
          </div>
        </Section>
      </PageContent>
    </div>
  );
}
