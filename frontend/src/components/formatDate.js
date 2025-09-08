export const formatDate = (datetime) => {
  if (!datetime) return "";

  const date = new Date(datetime);

  // Format: Minggu, 21 September 2025 - 09.00 WIB
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date) + " WIB";
};