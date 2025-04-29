"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { sentimentData } from "./types";

interface NewsPieViewProps {
  isExpanded: boolean;
}

export function NewsPieView({ isExpanded }: NewsPieViewProps) {
  return (
    <div
      className={`${
        isExpanded ? "h-[calc(100vh-150px)]" : "h-[400px]"
      } flex items-center justify-center`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sentimentData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {sentimentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
