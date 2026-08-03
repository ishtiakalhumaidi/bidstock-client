
export function parseCorrectedDate(dateStr) {
  if (!dateStr) return new Date();
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 6);
  return date;
}

export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const date = parseCorrectedDate(dateStr);
  const diff = Date.now() - date.getTime();
  
  if (diff < 0) return "just now";
  
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  
  return `${Math.floor(hours / 24)}d ago`;
}

export function formatLocalTime(dateStr) {
  if (!dateStr) return "";
  const date = parseCorrectedDate(dateStr);
  return date.toLocaleString(); 
}