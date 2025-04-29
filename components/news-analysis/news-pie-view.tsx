"use client";

import { useState, useRef, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { EventItem } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatPostTime, getDomainFromUrl } from "./utils";
import { Button } from "@/components/ui/button";

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
  // State for pagination
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
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

  // Get a short summary for the pie chart label
  const getShortSummary = (event: EventItem) => {
    if (!event.Event.summary) return "Event";

    // Extract the first sentence or first few words
    const summary = event.Event.summary;
    const firstSentence = summary.split(".")[0];

    if (firstSentence.length < 20) {
      return firstSentence;
    } else {
      // Take just the first few words
      return firstSentence.substring(0, 20) + "...";
    }
  };

  // Format data for the pie chart - use summary instead of event ID
  const pieData = events.map((event) => ({
    name: getShortSummary(event),
    value: Number(event.Percentage) || 0,
    //   typeof event.Percentage === "string"
    //     ? parseFloat(event.Percentage)
    //     : event.Percentage || 0,
    id: event.id,
    // Use the stable color map
    color:
      colorMapRef.current[event.id] ||
      `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
  }));

  const handlePieClick = (data: any, index: number) => {
    setSelectedEventId(data.id);
    // Initialize pagination when selecting a new event
    if (!currentPage[data.id]) {
      setCurrentPage((prev) => ({
        ...prev,
        [data.id]: 1,
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

  return (
    <div className="space-y-6">
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
              onClick={handlePieClick}
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

      {/* Selected Event Details Section */}
      {selectedEvent && (
        <div className="mt-6 animate-fadeIn">
          <h3 className="text-lg font-medium mb-3">Selected Event Details</h3>
          <Card
            key={selectedEvent.id}
            className="transition-colors border-l-4 border-l-blue-500 shadow-sm hover:shadow-md"
          >
            <CardContent className="p-4">
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => toggleEventExpansion(selectedEvent.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">
                      {selectedEvent.Event.summary
                        ? selectedEvent.Event.summary.length > 60
                          ? `${selectedEvent.Event.summary.substring(0, 60)}...`
                          : selectedEvent.Event.summary
                        : `Event ${selectedEvent.Event.event_id}`}
                    </h4>
                    {expandedEvents[selectedEvent.id] ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  {selectedEvent.Event.summary &&
                    selectedEvent.Event.summary.length > 60 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {expandedEvents[selectedEvent.id]
                          ? selectedEvent.Event.summary
                          : `${selectedEvent.Event.summary.substring(
                              0,
                              120
                            )}...`}
                      </p>
                    )}
                  <div className="text-xs text-muted-foreground mt-1">
                    <span>
                      {selectedEvent.Event.news_list.length} related news items
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant="secondary"
                    className="font-medium"
                    style={{
                      backgroundColor: `${
                        colorMapRef.current[selectedEvent.id]
                      }20`,
                      color: colorMapRef.current[selectedEvent.id],
                    }}
                  >
                    {selectedEvent.Percentage}% Impact
                  </Badge>
                </div>
              </div>

              {expandedEvents[selectedEvent.id] && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  {/* Paginated news items */}
                  {getPaginatedNews(selectedEvent).map((news, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm hover:shadow border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{news.title}</h5>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span className="text-blue-600 dark:text-blue-400">
                              {getDomainFromUrl(news.link)}
                            </span>
                            <span className="mx-2">•</span>
                            <Clock className="h-3 w-3 mr-1 text-gray-500" />
                            <span>{formatPostTime(news.post_time)}</span>
                          </div>
                          {news.summary && (
                            <p className="text-xs mt-2 text-gray-600 dark:text-gray-300">
                              {news.summary.length > 150
                                ? `${news.summary.substring(0, 150)}...`
                                : news.summary}
                            </p>
                          )}
                        </div>
                        <a
                          href={news.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}

                  {/* Pagination controls */}
                  {selectedEvent.Event.news_list.length > NEWS_PER_PAGE && (
                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToPrevPage(selectedEvent.id);
                        }}
                        disabled={(currentPage[selectedEvent.id] || 1) <= 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>

                      <span className="text-xs text-muted-foreground">
                        Page {currentPage[selectedEvent.id] || 1} of{" "}
                        {Math.ceil(
                          selectedEvent.Event.news_list.length / NEWS_PER_PAGE
                        )}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToNextPage(selectedEvent.id);
                        }}
                        disabled={
                          (currentPage[selectedEvent.id] || 1) >=
                          Math.ceil(
                            selectedEvent.Event.news_list.length / NEWS_PER_PAGE
                          )
                        }
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
