import React from "react";

// Helper to get week range (Sunday-Saturday) for a given date
function getWeekRange(date) {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeekView({
  weekDate,           // JS Date for any day in the week (e.g., today)
  selectedDate,       // JS Date or string (YYYY-MM-DD)
  onSelectDate,       // function(dateStr)
  onPrevWeek,         // function()
  onNextWeek,         // function()
  events = []         // [{ date: "YYYY-MM-DD", ... }]
}) {
  const { start, end } = getWeekRange(weekDate);

  // Format week label
  const weekLabel = `${start.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} - ${end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;

  // Get date strings for each day in the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  // Helper
  function formatDate(date) {
    return date.toISOString().slice(0, 10);
  }

  return (
    <div className="weekview-container">
      <div className="calendar-topbar">
        <button className="calendar-nav-btn" onClick={onPrevWeek}>&lt;</button>
        <span className="calendar-month-label">{weekLabel}</span>
        <button className="calendar-nav-btn" onClick={onNextWeek}>&gt;</button>
      </div>
      <div className="weekview-list">
        {weekDays.map((date, idx) => {
          const dateStr = formatDate(date);
          const dayEvents = events.filter(ev => ev.date === dateStr);
          const isSelected = selectedDate === dateStr;
          return (
            <div
              key={dateStr}
              className={`weekview-day-row${isSelected ? " selected" : ""}`}
              onClick={() => onSelectDate(dateStr)}
            >
              <div className="weekview-day-label">
                <span className="weekview-day-name">{WEEKDAYS[date.getDay()]}</span>
                <span className="weekview-day-number">{date.getDate()}</span>
              </div>
              <div className="weekview-events">
                {dayEvents.length === 0 ? (
                  <span className="weekview-no-events">No events</span>
                ) : (
                  dayEvents.map(ev => (
                    <span key={ev.title} className="weekview-event-title">{ev.title}</span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
