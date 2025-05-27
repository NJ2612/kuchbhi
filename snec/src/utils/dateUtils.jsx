export function pad(n) {
  return n < 10 ? '0' + n : n;
}

export function formatDate(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function getWeekStartDate(date) {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  return start;
}
