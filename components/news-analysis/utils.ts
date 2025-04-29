// Format the post time to a more readable format
export const formatPostTime = (postTime: string) => {
  if (!postTime) return "Unknown time";

  try {
    // Format like "20250428T2300" to readable time
    const year = postTime.substring(0, 4);
    const month = postTime.substring(4, 6);
    const day = postTime.substring(6, 8);
    const hour = postTime.substring(9, 11);
    const minute = postTime.substring(11, 13);

    // Get current date to compare
    const now = new Date();
    const postDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);

    // If same day, just show time
    if (now.toDateString() === postDate.toDateString()) {
      return `Today at ${hour}:${minute}`;
    }

    // If recent, show relative time
    const diffDays = Math.floor(
      (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      return `Yesterday at ${hour}:${minute}`;
    }
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }

    // Otherwise, show date
    return `${day}/${month}/${year} ${hour}:${minute}`;
  } catch (e) {
    console.error("Error parsing time:", e, postTime);
    return postTime;
  }
};

// Get domain from URL for display
export const getDomainFromUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain;
  } catch (e) {
    return url;
  }
};

// Placeholder for rendering graph
export const renderGraph = (graphRef: React.RefObject<HTMLDivElement>) => {
  if (!graphRef.current) return;
  console.log("Rendering graph would go here");
};
