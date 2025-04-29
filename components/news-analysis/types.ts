// Define types for the API data
export interface NewsItem {
  link: string;
  post_time: string;
  summary: string;
  title: string;
}

export interface Event {
  event_id: string;
  summary?: string;
  news_list: NewsItem[];
}

export interface EventItem {
  Event: Event;
  Percentage: number; // Changed to capital P to match API response
  id: string;
}

// Data for pie chart - will be updated based on API data later
export const sentimentData = [
  { name: "Positive", value: 4, color: "#22c55e" },
  { name: "Neutral", value: 2, color: "#f59e0b" },
  { name: "Negative", value: 4, color: "#ef4444" },
];

export type ViewType = "list" | "pie" | "graph";
