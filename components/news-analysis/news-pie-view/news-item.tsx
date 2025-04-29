"use client";

import { Clock, ExternalLink } from "lucide-react";
import { formatPostTime, getDomainFromUrl } from "../utils";

interface NewsItemProps {
  news: {
    title: string;
    link: string;
    post_time: string;
    summary?: string;
  };
}

export function NewsItem({ news }: NewsItemProps) {
  return (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm hover:shadow border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all">
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
  );
}