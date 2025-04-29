// ... existing code ...
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

    // Normalize data types to ensure consistency
    const normalizedData = data.map((item) => ({
      ...item,
      Percentage: Number(item.Percentage), // Ensure Percentage is always a number
    }));

    setEvents(normalizedData);
    // ... rest of the function
  } catch (err) {
    // ... error handling
  }
};
// ... existing code ...
