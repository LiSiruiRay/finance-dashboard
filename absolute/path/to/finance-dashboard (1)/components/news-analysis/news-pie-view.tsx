// ... existing code ...
const pieData = events.map((event) => ({
  name: getShortSummary(event),
  value: Number(event.Percentage) || 0, // Always convert to number
  id: event.id,
  // Use the stable color map
  color:
    colorMapRef.current[event.id] ||
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
}));
// ... existing code ...
