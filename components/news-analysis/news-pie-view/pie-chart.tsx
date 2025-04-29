"use client";

import { useState, useRef, useEffect } from "react";
import { EventItem } from "../types";
import { PieChartVisualization } from "./pie-chart-visualization";
import { GraphVisualization } from "./graph-visualization";
import { SelectedEventDetails } from "./selected-event-details";
import { Button } from "@/components/ui/button";
import { NetworkIcon, PieChartIcon } from "lucide-react";

interface NewsPieViewProps {
  isExpanded: boolean;
  events: EventItem[];
  expandedEvents: Record<string, boolean>;
  toggleEventExpansion: (eventId: string) => void;
}

export function NewsPieView({
  isExpanded,
  events,
  expandedEvents,
  toggleEventExpansion,
}: NewsPieViewProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const [showGraph, setShowGraph] = useState<boolean>(false);
  const NEWS_PER_PAGE = 5;

  // Create a stable color map for every event ID
  const colorMapRef = useRef<Record<string, string>>({});

  // Assign consistent colors to events
  useEffect(() => {
    events.forEach((event) => {
      if (!colorMapRef.current[event.id]) {
        colorMapRef.current[event.id] = `hsl(${Math.floor(
          Math.random() * 360
        )}, 70%, 50%)`;
      }
    });
  }, [events]);

  const handlePieClick = (eventId: string) => {
    // Make sure we have a valid event ID
    if (!eventId) return;

    setSelectedEventId(eventId);

    // Initialize pagination when selecting a new event
    if (!currentPage[eventId]) {
      setCurrentPage((prev) => ({
        ...prev,
        [eventId]: 1,
      }));
    }
  };

  // Find the selected event if any
  const selectedEvent = selectedEventId
    ? events.find((e) => e.id === selectedEventId)
    : null;

  // Pagination handlers
  const goToNextPage = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    const totalPages = Math.ceil(event.Event.news_list.length / NEWS_PER_PAGE);
    const nextPage = Math.min(currentPage[eventId] + 1, totalPages);

    setCurrentPage((prev) => ({
      ...prev,
      [eventId]: nextPage,
    }));
  };

  const goToPrevPage = (eventId: string) => {
    setCurrentPage((prev) => ({
      ...prev,
      [eventId]: Math.max(prev[eventId] - 1, 1),
    }));
  };

  // Get paginated news items
  const getPaginatedNews = (event: EventItem) => {
    const page = currentPage[event.id] || 1;
    const startIndex = (page - 1) * NEWS_PER_PAGE;
    return event.Event.news_list.slice(startIndex, startIndex + NEWS_PER_PAGE);
  };

  // Toggle between chart and graph view
  const toggleGraphView = () => {
    setShowGraph(!showGraph);
  };

  // Create pie data with formatted summaries
  const pieData = events.map((event) => ({
    name: getShortSummary(event),
    value:
      typeof event.Percentage === "string"
        ? parseFloat(event.Percentage)
        : event.Percentage || 0,
    id: event.id,
    color:
      colorMapRef.current[event.id] ||
      `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
  }));

  return (
    <div className="space-y-6">
      {/* Toggle between chart and graph */}
      <div className="flex items-center justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleGraphView}
          className="flex items-center gap-1"
        >
          {showGraph ? (
            <>
              <PieChartIcon className="h-3.5 w-3.5 mr-1" />
              Show Pie Chart
            </>
          ) : (
            <>
              <NetworkIcon className="h-3.5 w-3.5 mr-1" />
              Show Relationship Graph
            </>
          )}
        </Button>
      </div>

      {/* Visualization Section */}
      {showGraph ? (
        <GraphVisualization isExpanded={isExpanded} />
      ) : (
        <PieChartVisualization
          isExpanded={isExpanded}
          pieData={pieData}
          selectedEventId={selectedEventId}
          onPieClick={handlePieClick}
        />
      )}

      {/* Selected Event Details Section */}
      {selectedEvent && !showGraph && (
        <SelectedEventDetails
          event={selectedEvent}
          isExpanded={expandedEvents[selectedEvent.id]}
          toggleExpansion={() => toggleEventExpansion(selectedEvent.id)}
          currentPage={currentPage[selectedEvent.id] || 1}
          goToNextPage={() => goToNextPage(selectedEvent.id)}
          goToPrevPage={() => goToPrevPage(selectedEvent.id)}
          paginatedNews={getPaginatedNews(selectedEvent)}
          colorMap={colorMapRef.current}
        />
      )}
    </div>
  );
}

// Helper function
function getShortSummary(event: EventItem) {
  if (!event.Event.summary) return "Event";

  const summary = event.Event.summary;
  const firstSentence = summary.split(".")[0];

  if (firstSentence.length < 20) {
    return firstSentence;
  } else {
    return firstSentence.substring(0, 20) + "...";
  }
}
