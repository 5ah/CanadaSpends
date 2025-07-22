"use client";

import React from "react";

export interface SpendingItem {
  name: string;
  amount: number;
  formattedAmount: string;
  percentage: number;
  color?: string;
}

interface HorizontalSpendingChartProps {
  data: SpendingItem[];
  title?: string;
  totalAmount?: number;
}

const defaultColors = [
  "#1e40af", // blue-800
  "#2563eb", // blue-600
  "#3b82f6", // blue-500
  "#60a5fa", // blue-400
  "#93c5fd", // blue-300
  "#dbeafe", // blue-100
];

export function HorizontalSpendingChart({
  data,
  title,
  totalAmount,
}: HorizontalSpendingChartProps) {
  const maxAmount = Math.max(...data.map((item) => item.amount));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      )}

      <div className="space-y-4">
        {data.map((item, index) => {
          const barWidth = (item.amount / maxAmount) * 100;
          // Use lighter color for "Other" category
          const color =
            item.color ||
            (item.name === "Other"
              ? "#dbeafe"
              : defaultColors[index % defaultColors.length]);

          return (
            <div key={item.name} className="space-y-2">
              {/* Category name and amount row */}
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-900 flex-1 pr-4">
                  {item.name}
                </div>
                <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  {item.formattedAmount}
                </div>
              </div>

              {/* Bar */}
              <div className="w-full bg-gray-100 rounded-sm h-4">
                <div
                  className="h-4 rounded-sm transition-all duration-300"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {totalAmount && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-base font-semibold text-gray-900">
              Your total tax contribution:
            </div>
            <div className="text-base font-bold text-gray-900">
              ${totalAmount.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
