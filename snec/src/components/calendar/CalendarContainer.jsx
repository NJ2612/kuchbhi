import React, { useState, useEffect } from "react";
import YearView from "./YearView";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import EventDetails from "./EventDetails";
import { getEventColor } from "../../utils/eventUtils";

export default function CalendarContainer() {
  const [calendarView, setCalendarView] = useState("year");
  const [viewDate, setViewDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [weekDate, setWeekDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("http://localhost:8000/api/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data.map(ev => ({
          date: ev.date?.split("T")[0] || "",
          title: ev.title,
          time: ev.time,
          type: ev.type || "default",
          club: ev.organizer || "",
          completed: false,
          results: ev.description || "",
        })));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchEvents();
  }, []);

  // Simple month navigation
  function handlePrevMonth() {
    setViewDate(prev => {
      const { year, month } = prev;
      console.log("handlePrevMonth before update:", year, month);
      if (month === 0) {
        if (year <= 1) return prev; // Don't go below year 1
        const newState = { year: year - 1, month: 11 };
        console.log("handlePrevMonth newState:", newState);
        return newState;
      } else {
        const newState = { year, month: month - 1 };
        console.log("handlePrevMonth newState:", newState);
        return newState;
      }
    });
    setSelectedDate(null);
  }

  function handleNextMonth() {
    setViewDate(prev => {
      const { year, month } = prev;
      console.log("handleNextMonth before update:", year, month);
      if (month === 11) {
        if (year >= 9999) return prev; // Don't go above year 9999
        const newState = { year: year + 1, month: 0 };
        console.log("handleNextMonth newState:", newState);
        return newState;
      } else {
        const newState = { year, month: month + 1 };
        console.log("handleNextMonth newState:", newState);
        return newState;
      }
    });
    setSelectedDate(null);
  }

  // Simple week navigation
  function handlePrevWeek() {
    const newDate = new Date(weekDate);
    newDate.setDate(newDate.getDate() - 7);
    if (newDate.getFullYear() < 1) return; // Don't go below year 1
    setWeekDate(newDate);
    setSelectedDate(null);
  }

  function handleNextWeek() {
    const newDate = new Date(weekDate);
    newDate.setDate(newDate.getDate() + 7);
    if (newDate.getFullYear() > 9999) return; // Don't go above year 9999
    setWeekDate(newDate);
    setSelectedDate(null);
  }

  // Date selection
  function handleSelectDate(dateStr) {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      console.error('Invalid date format:', dateStr);
      return;
    }
    setSelectedDate(dateStr);
  }

  // Go to week view
  function handleGoToWeekView(dateStr) {
    if (!dateStr) return;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      setWeekDate(date);
      setSelectedDate(dateStr);
      setViewDate({ year: date.getFullYear(), month: date.getMonth() });
      setCalendarView("week");
    } catch (error) {
      console.error('Error in handleGoToWeekView:', error);
    }
  }

  return (
    <div className="calendar-container">
      {calendarView === "year" && (
        <YearView
          initialYear={viewDate.year}
          setViewDate={setViewDate}
          setCalendarView={setCalendarView}
        />
      )}

      {calendarView === "month" && (
        <MonthView
          year={viewDate.year}
          month={viewDate.month}
          selectedDateStr={selectedDate}
          onSelectDate={handleSelectDate}
          getEventColor={getEventColor}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onGoToWeekView={handleGoToWeekView}
          events={events}
        />
      )}



      {calendarView === "week" && (
        <WeekView
          weekDate={weekDate}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          events={events}
        />
      )}

      {selectedDate && (
        <div className="event-details-container">
          <button onClick={() => {
            setCalendarView("year");
            setSelectedDate(null);
          }}>Back to Year View</button>
          <EventDetails
            dateStr={selectedDate}
            getEventColor={getEventColor}
            events={events}
          />
        </div>
      )}
    </div>
  );
}