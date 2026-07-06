export function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("ne-NP", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function formatViews(n) {
  if (n >= 100000) return (n / 100000).toFixed(1) + " लाख";
  if (n >= 1000) return (n / 1000).toFixed(1) + " हजार";
  return String(n);
}
