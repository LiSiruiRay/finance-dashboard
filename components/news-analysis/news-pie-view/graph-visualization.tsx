"use client";

import { ExternalLink } from "lucide-react";

interface GraphVisualizationProps {
  isExpanded: boolean;
}

export function GraphVisualization({ isExpanded }: GraphVisualizationProps) {
  return (
    <div className="relative">
      <div
        className={`${
          isExpanded ? "h-[calc(80vh-150px)]" : "h-[300px]"
        } w-full rounded-md overflow-hidden border border-gray-200 dark:border-gray-700`}
      >
        <iframe
          src="https://react-graph.project.slray.com/"
          className="w-full h-full"
          title="News Relationship Graph"
          allowFullScreen
        />
      </div>
      <div className="absolute top-2 right-2 z-10">
        <a
          href="https://react-graph.project.slray.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
        >
          Open in New Tab
          <ExternalLink className="h-4 w-4 ml-2" />
        </a>
      </div>
    </div>
  );
}