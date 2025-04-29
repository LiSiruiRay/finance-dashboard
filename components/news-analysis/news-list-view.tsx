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

  // Toggle show more for a specific event
  const toggleShowMore = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setShowMoreMap((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  // Determine how many news items to show for an event
  const getNewsToShow = (eventItem: EventItem) => {
    const allNews = eventItem.Event.news_list || [];
    return showMoreMap[eventItem.id] ? allNews : allNews.slice(0, 5);
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
        events.map((eventItem) => (
          <Card key={eventItem.id} className="transition-colors">
            <CardContent className="p-4">
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => toggleEventExpansion(eventItem.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      Event {eventItem.Event.event_id}
                    </h4>
                    {expandedEvents[eventItem.id] ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  {eventItem.Event.summary && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {eventItem.Event.summary.length > 120
                        ? `${eventItem.Event.summary.substring(0, 120)}...`
                        : eventItem.Event.summary}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    <span>
                      {eventItem.Event.news_list.length} related news items
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="font-medium">
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
                      key={index}
                      className="bg-muted/20 p-3 rounded-md hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{news.title}</h5>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span>{getDomainFromUrl(news.link)}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatPostTime(news.post_time)}</span>
                          </div>
                          {news.summary && (
                            <p className="text-xs mt-2">
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
                          className="ml-2 text-blue-500 hover:text-blue-700"
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
                      className="w-full mt-2"
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
