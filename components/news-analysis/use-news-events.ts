"use client";

import { useState, useEffect } from "react";
import { EventItem } from "./types";

export function useNewsEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3010/sample_events");
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);

        // Initialize expanded state for each event (all collapsed)
        const initialExpandedState: Record<string, boolean> = {};
        data.forEach((item: EventItem) => {
          initialExpandedState[item.id] = false;
        });
        setExpandedEvents(initialExpandedState);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  return {
    events,
    expandedEvents,
    loading,
    error,
    toggleEventExpansion,
  };
}
