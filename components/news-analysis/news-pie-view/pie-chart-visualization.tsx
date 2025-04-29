"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

interface PieDataItem {
  name: string;
  value: number;
  id: string;
  color: string;
}

interface PieChartVisualizationProps {
  isExpanded: boolean;
  pieData: PieDataItem[];
  selectedEventId: string | null;
  onPieClick: (eventId: string) => void;
}

export function PieChartVisualization({
  isExpanded,
  pieData,
  selectedEventId,
  onPieClick,
}: PieChartVisualizationProps) {
  return (
    <>
      {/* Add CSS to remove focus outlines and set up highlight animation */}
      <style jsx global>{`
        .recharts-sector:focus {
          outline: none !important;
        }

        .selected-pie-segment {
          transform: scale(1.05);
          transform-box: fill-box;
          transform-origin: center;
          filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.3));
          transition: transform 0.3s ease;
        }
      `}</style>

      <div
        className={`${
          isExpanded ? "h-[calc(80vh-150px)]" : "h-[300px]"
        } flex items-center justify-center`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {pieData.map((entry, index) => (
                <filter
                  key={`filter-${index}`}
                  id={`shadow-${entry.id}`}
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="0"
                    dy="3"
                    stdDeviation="3"
                    floodColor="#000"
                    floodOpacity="0.3"
                  />
                </filter>
              ))}
            </defs>

            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, value }) => `${value}%`}
              onClick={(data, index) => {
                // Ensure we're passing the id correctly to the parent component
                onPieClick(data.id);
              }}
              animationDuration={500}
            >
              {pieData.map((entry, index) => {
                const isSelected = entry.id === selectedEventId;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={isSelected ? "#fff" : "#fff"}
                    strokeWidth={isSelected ? 4 : 2}
                    className={isSelected ? "selected-pie-segment" : ""}
                    filter={isSelected ? `url(#shadow-${entry.id})` : "none"}
                  />
                );
              })}
            </Pie>

            <RechartsTooltip
              formatter={(value: any) => [`${value}%`, "Impact"]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "6px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                border: "none",
                padding: "8px 12px",
              }}
              itemStyle={{ color: "#333" }}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}