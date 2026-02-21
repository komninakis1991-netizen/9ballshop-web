export function timeAgo(dateString: string): { key: string; value?: number } {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return { key: "justNow" };

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return { key: "minutesAgo", value: minutes };

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { key: "hoursAgo", value: hours };

  const days = Math.floor(hours / 24);
  return { key: "daysAgo", value: days };
}
