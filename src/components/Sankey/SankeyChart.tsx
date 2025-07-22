import { hierarchy } from "d3";
import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import "./SankeyChart.css";
import { SankeyData } from "./SankeyChartD3";
import { SankeyChartSingle } from "./SankeyChartSingle";
import { formatNumber, sortNodesByAmount, transformToIdBased } from "./utils";

type FlatDataNodes = ReturnType<typeof getFlatData>["nodes"];
type Node = FlatDataNodes[number] & {
  realValue?: number;
};

interface HoverNodeType extends Node {
  percent: number;
  blockRect?: DOMRect;
}

interface SearchOptionType {
  value: string;
  label: string;
}

const getFlatData = (data: SankeyData) => {
  const revenueRoot = hierarchy(data.revenue_data).sum((d) => {
    return Math.abs(d.amount);
  });

  const spendingRoot = hierarchy(data.spending_data).sum((d) => {
    return Math.abs(d.amount);
  });

  return {
    nodes: [
      ...revenueRoot.descendants().map((d) => ({
        ...d.data,
        parent: d.parent?.data.id,
        value: d.value,
        type: "revenue",
      })),
      ...spendingRoot.descendants().map((d) => ({
        ...d.data,
        parent: d.parent?.data.id,
        value: d.value,
        type: "spending",
      })),
    ].sort((a, b) => {
      return (a.displayName || a.name || "").localeCompare(
        b.displayName || b.name || "",
      );
    }),
    revenueTotal: revenueRoot.value ?? 0,
    spendingTotal: spendingRoot.value ?? 0,
  };
};

const chartHeight = 760;
const amountScalingFactor = 1e9;

const chartConfig = {
  revenue: {
    id: "revenue-chart-root",
    colors: {
      primary: "#249EDC",
    },
    direction: "right-to-left",
    differenceLabel: "Deficit",
  },
  spending: {
    id: "spending-chart-root",
    colors: {
      primary: "#E3007D",
    },
    direction: "left-to-right",
    differenceLabel: "Surplus",
  },
} as const;

type SankeyChartProps = {
  data: SankeyData;
};

export function SankeyChart(props: SankeyChartProps) {
  const [chartData, setChartData] = useState<SankeyData | null>(null);
  const [flatData, setFlatData] = useState<FlatDataNodes | null>(null);

  const [searchedNode, setSearchedNode] = useState<SearchOptionType | null>(
    null,
  );
  const [searchResult, setSearchResult] = useState<Node | null>(null);
  const [hoverNode, setHoverNode] = useState<HoverNodeType | null>(null);
  // Mouse position as fallback - ensures tooltip still works if blockRect is missing
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Transform the data to use ID-based structure
    const transformedData = {
      ...props.data,
      revenue_data: transformToIdBased(props.data.revenue_data),
      spending_data: transformToIdBased(props.data.spending_data),
    };

    setChartData(transformedData);
    const { nodes, revenueTotal, spendingTotal } = getFlatData(transformedData);

    setFlatData(nodes);
    setTotalAmount(Math.max(revenueTotal, spendingTotal));
  }, [props.data]);

  const handleSearch = (selected: SearchOptionType | null) => {
    setSearchedNode(selected);

    if (!selected) {
      return setSearchResult(null);
    }

    let node = flatData?.find((d) => d.id === selected.value);

    // If it's a leaf node, we need to find the parent node
    if (!node?.children) {
      node = flatData?.find((d) => d.id === node?.parent);
    }

    setSearchResult(node ?? null);
  };

  const handleMouseOver = useCallback((totalAmount: number) => {
    return (node: Node, event?: MouseEvent) => {
      const percent = (node.realValue! / totalAmount) * 100;
      setHoverNode({
        ...node,
        percent,
      });
      // Store mouse position as fallback for tooltip positioning
      if (event) {
        setMousePosition({ x: event.clientX, y: event.clientY });
      }
    };
  }, []);

  const handleMouseOut = useCallback(() => {
    setHoverNode(null);
    setMousePosition(null);
  }, []);

  return (
    <div className="sankey-chart-wrapper">
      <div className="sankey-chart-header">
        <div className="search-container">
          <Select
            instanceId="sankey-search"
            inputId="sankey-search-input"
            value={searchedNode}
            options={flatData
              ?.map((d) => ({
                value: d.id!,
                label: d.displayName || d.name || "Unknown",
              }))
              .filter((d) => d.value && d.label)}
            onChange={handleSearch}
            isClearable={true}
            placeholder="Search..."
            className="search-select"
            styles={{
              input: (base) => ({
                ...base,
                color: "#fff",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#fff",
              }),
              control: (base) => ({
                ...base,
                color: "#fff",
                backgroundColor: "#000",
                borderColor: "#444",
              }),
            }}
          />
        </div>
      </div>

      <div className="sankey-chart-content">
        {hoverNode && (
          <div
            className="node-tooltip"
            style={{
              // Horizontal: right of the block, constrained to viewport
              left: hoverNode.blockRect
                ? `${Math.min(hoverNode.blockRect.right + 10, window.innerWidth - 340)}px`
                : `${Math.min((mousePosition?.x || 0) + 10, window.innerWidth - 340)}px`,
              // Vertical: 40px above the block to avoid native tooltip conflict
              // Math.max ensures tooltip stays within viewport (min 10px from top)
              top: hoverNode.blockRect
                ? `${Math.max(10, hoverNode.blockRect.top - 40)}px`
                : `${(mousePosition?.y || 0) + 10}px`,
            }}
          >
            <p className="node-tooltip-name">
              {hoverNode.displayName || hoverNode.name}
            </p>
            <div className="node-tooltip-amount">
              <span>
                {formatNumber(hoverNode.realValue ?? 0, amountScalingFactor)}
              </span>
              <span className="node-tooltip-amount-divider">&#8226;</span>
              <span>{hoverNode.percent.toFixed(1)}%</span>
            </div>
          </div>
        )}

        {chartData && !searchResult && (
          <div className="charts">
            <SankeyChartSingle
              {...chartConfig.revenue}
              data={sortNodesByAmount(chartData.revenue_data)}
              totalAmount={totalAmount}
              difference={chartData.total - chartData.revenue}
              height={chartHeight}
              amountScalingFactor={amountScalingFactor}
              onMouseOver={handleMouseOver(chartData.revenue)}
              onMouseOut={handleMouseOut}
            />

            <SankeyChartSingle
              {...chartConfig.spending}
              data={sortNodesByAmount(chartData.spending_data)}
              totalAmount={totalAmount}
              difference={chartData.total - chartData.spending}
              height={chartHeight}
              amountScalingFactor={amountScalingFactor}
              onMouseOver={handleMouseOver(chartData.spending)}
              onMouseOut={handleMouseOut}
            />
          </div>
        )}

        {searchResult && (
          <div className="chart search-results">
            <SankeyChartSingle
              id="search-results-root"
              data={searchResult}
              // @ts-expect-error: fix type here
              colors={chartConfig[searchResult.type].colors}
              // @ts-expect-error: fix type here
              direction={chartConfig[searchResult.type].direction}
              totalAmount={searchResult.value ?? 0}
              height={chartHeight}
              amountScalingFactor={amountScalingFactor}
              difference={0}
              differenceLabel=""
            />
          </div>
        )}
      </div>
    </div>
  );
}
