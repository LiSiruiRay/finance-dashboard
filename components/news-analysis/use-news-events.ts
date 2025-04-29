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
        const response = await fetch(
          "https://finance-insight.api.slray.com/api/news"
        );
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();

        // DEBUG: Check for duplicate IDs
        console.log("Total events received:", data.length);
        const idMap: Record<string, { index: number; event: EventItem }> = {};
        const duplicateIds: Array<{
          id: string;
          indices: number[];
          events: EventItem[];
        }> = [];

        // Map event_id to id for consistency
        const mappedData = data.map((event: any, index: number) => {
          // Use event_id from the Event object as the id property
          const eventId = event.Event.event_id;
          return {
            ...event,
            id: eventId, // Add id at top level for consistency
          };
        });

        // Now check for duplicates with the correct id
        mappedData.forEach((event: EventItem, index: number) => {
          const id = event.id;
          console.log(`Event ${index}: ID = ${id}, Type: ${typeof id}`);

          if (idMap[id]) {
            duplicateIds.push({
              id,
              indices: [idMap[id].index, index],
              events: [idMap[id].event, event],
            });
            console.warn(
              `DUPLICATE ID FOUND: ${id} at indices ${idMap[id].index} and ${index}`
            );
          } else {
            idMap[id] = { index, event };
          }
        });

        // Log duplicate info if any
        if (duplicateIds.length > 0) {
          console.error("Found duplicate IDs:", duplicateIds);
          console.table(
            duplicateIds.map((dup) => ({
              ID: dup.id,
              "First Index": dup.indices[0],
              "Second Index": dup.indices[1],
              "Event Summary 1":
                dup.events[0].Event.summary?.substring(0, 30) + "...",
              "Event Summary 2":
                dup.events[1].Event.summary?.substring(0, 30) + "...",
            }))
          );
        } else {
          console.log("No duplicate IDs found");
        }

        // Use the mapped data with consistent id property
        setEvents(mappedData);

        // Initialize expanded state for each event (all collapsed)
        const initialExpandedState: Record<string, boolean> = {};
        mappedData.forEach((item: EventItem) => {
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
