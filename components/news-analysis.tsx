"use client";

import { useState } from "react";
import {
  List,
  PieChartIcon,
  Network,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewType } from "./news-analysis/types";
import { useNewsEvents } from "./news-analysis/use-news-events";
import { NewsListView } from "./news-analysis/news-list-view";
import { NewsPieView } from "./news-analysis/news-pie-view";
import { NewsGraphView } from "./news-analysis/news-graph-view";

export function NewsAnalysis() {
  const [viewType, setViewType] = useState<ViewType>("list");
  const [isExpanded, setIsExpanded] = useState(false);
  const { events, expandedEvents, loading, error, toggleEventExpansion } =
    useNewsEvents();

  return (
    <div
      className={`space-y-4 ${
        isExpanded
          ? "fixed inset-4 z-50 bg-background p-6 overflow-auto rounded-lg shadow-lg"
          : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Financial News Impact</h3>
        <div className="flex space-x-1">
          <div className="border rounded-md mr-2">
            <button
              onClick={() => setViewType("list")}
              className={`p-1.5 ${viewType === "list" ? "bg-muted" : ""}`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType("pie")}
              className={`p-1.5 ${viewType === "pie" ? "bg-muted" : ""}`}
              aria-label="Pie chart view"
            >
              <PieChartIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType("graph")}
              className={`p-1.5 ${viewType === "graph" ? "bg-muted" : ""}`}
              aria-label="Relational graph view"
            >
              <Network className="h-4 w-4" />
            </button>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {viewType === "list" && (
        <NewsListView
          events={events}
          expandedEvents={expandedEvents}
          isExpanded={isExpanded}
          loading={loading}
          error={error}
          toggleEventExpansion={toggleEventExpansion}
        />
      )}

      {viewType === "pie" && (
        <NewsPieView
          isExpanded={isExpanded}
          events={events}
          expandedEvents={expandedEvents}
          toggleEventExpansion={toggleEventExpansion}
        />
      )}

      {viewType === "graph" && (
        <NewsGraphView isExpanded={isExpanded} viewType={viewType} />
      )}
    </div>
  );
}
