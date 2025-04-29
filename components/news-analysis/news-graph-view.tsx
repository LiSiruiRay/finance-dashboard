"use client";

import { useRef, useEffect } from "react";
import { Network } from "lucide-react";
import { renderGraph } from "./utils";

interface NewsGraphViewProps {
  isExpanded: boolean;
  viewType: "list" | "pie" | "graph";
}

export function NewsGraphView({ isExpanded, viewType }: NewsGraphViewProps) {
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewType === "graph" && graphRef.current) {
      if (graphRef.current) {
        renderGraph({ current: graphRef.current });
      }
    }
  }, [viewType]);

  return (
    <div
      ref={graphRef}
      className={`${
        isExpanded ? "h-[calc(100vh-150px)]" : "h-[400px]"
      } bg-muted/20 rounded-lg relative overflow-hidden`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6">
          <Network className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">News Relationship Graph</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
            This visualization shows connections between news events and related
            topics.
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 max-w-md mx-auto">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex items-center text-xs p-1 border rounded"
                >
                  <span className="ml-1 truncate">Event {index + 1}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
