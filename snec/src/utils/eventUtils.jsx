import { eventTypeColors } from "../data/eventTypeColors";
// Removed static events import

export function getEventsForDate(dateStr, events) {
  return events.filter(ev => ev.date === dateStr);
}

export function getEventColor(type) {
  return eventTypeColors[type] || "#00bfff";
}

export function getEventsForMonth(year, month, events) {
  return events.filter(ev => {
    const [evYear, evMonth] = ev.date.split('-').map(Number);
    return evYear === year && evMonth - 1 === month;
  });
}
