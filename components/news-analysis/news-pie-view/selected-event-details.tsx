"use client";

import { EventItem } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronDown, ChevronUp, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPostTime, getDomainFromUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { NewsItem } from "./news-item";

interface SelectedEventDetailsProps {
  event: EventItem;
  isExpanded: boolean;
  toggleExpansion: () => void;
  currentPage: number;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  paginatedNews: any[];
  colorMap: Record<string, string>;
}

export function SelectedEventDetails({
  event,
  isExpanded,
  toggleExpansion,
  currentPage,
  goToNextPage,
  goToPrevPage,
  paginatedNews,
  colorMap,
}: SelectedEventDetailsProps) {
  // Calculate total pages
  const totalPages = Math.ceil((event.Event.news_list?.length || 0) / 5);

  return (
    <div className="mt-6 animate-fadeIn">
      <h3 className="text-lg font-medium mb-3">Selected Event Details</h3>
      <Card
        className="transition-colors border-l-4 shadow-sm hover:shadow-md"
        style={{ borderLeftColor: colorMap[event.id] || "#3b82f6" }}
      >
        <CardContent className="p-4">
          <div
            className="flex items-start justify-between cursor-pointer"
            onClick={toggleExpansion}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-blue-800 dark:text-blue-300">
                  {event.Event.summary
                    ? event.Event.summary.substring(0, 60) + (event.Event.summary.length > 60 ? "..." : "")
                    : `Event ${event.id.substring(0, 8)}...`}
                </h4>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              {event.Event.summary && (
                <p className="text-sm text-muted-foreground mt-1">
                  {event.Event.summary.length > 150
                    ? `${event.Event.summary.substring(0, 150)}...`
                    : event.Event.summary}
                </p>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                <span>{event.Event.news_list.length} related news items</span>
              </div>
            </div>
            <div className="text-right">
              <Badge
                variant="secondary"
                className="font-medium"
                style={{
                  backgroundColor: `${colorMap[event.id]}20`,
                  color: colorMap[event.id],
                }}
              >
                {event.Percentage}% Impact
              </Badge>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t space-y-3">
              {/* News items */}
              {paginatedNews.map((news, index) => (
                <NewsItem key={index} news={news} />
              ))}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
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
  );
}