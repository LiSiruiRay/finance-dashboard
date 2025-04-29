"use client";

import { useState, useEffect } from "react";

interface HistoryViewProps {
  isExpanded: boolean;
}

export function HistoryView({ isExpanded }: HistoryViewProps) {
  return (
    <div
      className={`w-full ${
        isExpanded ? "h-[calc(100vh-150px)]" : "h-[400px]"
      } overflow-hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700`}
    >
      <iframe
        src="https://react-graph.project.slray.com/"
        className="w-full h-full"
        title="Event Relationship History"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}
