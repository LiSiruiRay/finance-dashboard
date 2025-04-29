"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import { EventItem } from "./types";
import { formatPostTime, getDomainFromUrl } from "./utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NewsListViewProps {
  events: EventItem[];
  expandedEvents: Record<string, boolean>;
  isExpanded: boolean;
  loading: boolean;
  error: string | null;
  toggleEventExpansion: (eventId: string) => void;
}

export function NewsListView({
  events,
  expandedEvents,
  isExpanded,
  loading,
  error,
  toggleEventExpansion,
}: NewsListViewProps) {
  // Track which events have "show more" expanded
  const [showMoreMap, setShowMoreMap] = useState<Record<string, boolean>>({});
  // Track which summaries are expanded
  const [expandedSummaries, setExpandedSummaries] = useState<
    Record<string, boolean>
  >({});

  // Toggle show more for a specific event
  const toggleShowMore = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setShowMoreMap((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  // Toggle summary expansion
  const toggleSummary = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubble to avoid toggling the event expansion
    setExpandedSummaries((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  // Determine how many news items to show for an event
  const getNewsToShow = (eventItem: EventItem) => {
    const allNews = eventItem.Event.news_list || [];
    return showMoreMap[eventItem.id] ? allNews : allNews.slice(0, 5);
  };

  // Generate a title from an event summary
  const getEventTitle = (event: EventItem) => {
    if (!event.Event.summary) {
      return "Financial Market Event";
    }

    // Extract first sentence or first 50 characters for title
    const summary = event.Event.summary;
    const firstSentence = summary.split(".")[0];

    if (firstSentence.length < 60) {
      return firstSentence;
    } else {
      // Find a good break point (after a comma or space) within first 60 chars
      const shortened = summary.substring(0, 60);
      const lastComma = shortened.lastIndexOf(",");
      const lastSpace = shortened.lastIndexOf(" ");

      const breakPoint = lastComma > 30 ? lastComma : lastSpace;
      return summary.substring(0, breakPoint) + "...";
    }
  };

  return (
    <div
      className={`space-y-3 ${
        isExpanded ? "max-h-[calc(100vh-150px)]" : "max-h-[400px]"
      } overflow-y-auto pr-1`}
    >
      {loading ? (
        <div className="p-4 text-center">Loading events...</div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">Error: {error}</div>
      ) : events.length === 0 ? (
        <div className="p-4 text-center">No events found</div>
      ) : (
        events.map((eventItem, index) => (
          <Card
            key={`card-${eventItem.id}-${index}`}
            className="transition-colors border-l-4 border-l-blue-500 shadow-sm hover:shadow-md"
          >
            <CardContent className="p-4">
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => toggleEventExpansion(eventItem.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">
                      {getEventTitle(eventItem)}
                    </h4>
                    {expandedEvents[eventItem.id] ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  {eventItem.Event.summary && (
                    <div
                      className="mt-1"
                      onClick={(e) => toggleSummary(eventItem.id, e)}
                    >
                      <p className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                        {eventItem.Event.summary.length > 120 &&
                        !expandedSummaries[eventItem.id]
                          ? `${eventItem.Event.summary.substring(0, 120)}...`
                          : eventItem.Event.summary}
                        {eventItem.Event.summary.length > 120 && (
                          <span className="ml-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                            {expandedSummaries[eventItem.id]
                              ? "(collapse)"
                              : "(expand)"}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    <span>
                      {eventItem.Event.news_list.length} related news items
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant="secondary"
                    className={`font-medium ${
                      typeof eventItem.Percentage === "number" &&
                      eventItem.Percentage > 30
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {typeof eventItem.Percentage === "number"
                      ? `${eventItem.Percentage}% Impact`
                      : "Impact unknown"}
                  </Badge>
                </div>
              </div>

              {expandedEvents[eventItem.id] && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  {/* Only render the first 5 news items or all if "show more" is clicked */}
                  {getNewsToShow(eventItem).map((news, index) => (
                    <div
                      key={`${eventItem.id}-news-${index}`}
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

                  {/* Show "Load more" button if there are more than 5 news items */}
                  {eventItem.Event.news_list.length > 5 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-blue-200 hover:border-blue-400 text-blue-700 hover:text-blue-800 dark:border-blue-800 dark:hover:border-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={(e) => toggleShowMore(eventItem.id, e)}
                    >
                      {showMoreMap[eventItem.id]
                        ? `Show less`
                        : `Show ${
                            eventItem.Event.news_list.length - 5
                          } more news`}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
