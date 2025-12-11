export const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

export const getTimeSince = (date: Date | null) => {
  if (!date) return "No training yet";
  const diffDays = Math.floor(
    (new Date().getTime() - date.getTime()) / 1000 / 60 / 60 / 24
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterdays";
  return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
};
