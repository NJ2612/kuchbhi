// Updated App.js with compact layout and download button behavior
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { getEventColor } from "./utils/eventUtils";
import CompletedEventsDropdown from "./components/RightPanel/CompletedEventsDropdown";
import UpcomingEventsList from "./components/RightPanel/UpcomingEventsList";
import MonthView from "./components/calendar/MonthView";
import WeekView from "./components/calendar/WeekView";
import YearView from "./components/calendar/YearView";
import EventDetails from "./components/calendar/EventDetails";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/LoginPage/SignupPage";
import EventForm from "./components/EventForm";
import "./App.css";
import "./index.css";

function Dashboard({ isAuthenticated }) {
  const navigate = useNavigate();
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [calendarView, setCalendarView] = useState("month");
  const [events, setEvents] = useState([]);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showCompletedDropdown, setShowCompletedDropdown] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("http://localhost:8000/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        const mappedEvents = data.map(ev => ({
          date: ev.date ? ev.date.split("T")[0] : "",
          title: ev.title,
          time: ev.time,
          type: ev.type || "default",
          club: ev.organizer || "",
          completed: false,
          results: ev.description || "",
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchEvents();
  }, []);

  const weekDate = calendarView === "week" && !selectedDateStr
    ? new Date()
    : selectedDateStr
      ? new Date(selectedDateStr)
      : new Date(viewYear, viewMonth, 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  });

  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  const handlePrevMonth = () => {
    setViewMonth(prevMonth => {
      const newMonth = prevMonth === 0 ? 11 : prevMonth - 1;
      const newYear = prevMonth === 0 ? viewYear - 1 : viewYear;
      setViewYear(newYear);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setViewMonth(prevMonth => {
      const newMonth = prevMonth === 11 ? 0 : prevMonth + 1;
      const newYear = prevMonth === 11 ? viewYear + 1 : viewYear;
      setViewYear(newYear);
      return newMonth;
    });
  };


  const handlePrevWeek = () => setSelectedDateStr(dateStr => {
    const d = dateStr ? new Date(dateStr) : new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });

  const handleNextWeek = () => setSelectedDateStr(dateStr => {
    const d = dateStr ? new Date(dateStr) : new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });

  const handleAddEventClick = () => {
    if (isAuthenticated) {
      navigate('/event-form');
    } else {
      navigate('/login');
    }
  };

  const handleDownloadClick = () => {
    setShowCompletedDropdown(true);
    setShowDownloadDialog(true);
  };

  const handleDownloadOption = (range) => {
    if (range) {
      const downloadUrl = `http://localhost:8000/api/reports/download?range=${range}`;
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    setShowDownloadDialog(false);
  };

  return (
    <div className="app-bg">
      <header className="app-header">
        <h1>Campus Events Calendar</h1>
        <div className="action-buttons">
          <button className={calendarView === "month" ? "active" : ""} onClick={() => setCalendarView("month")}>Month</button>
          <button className={calendarView === "week" ? "active" : ""} onClick={() => {
            setCalendarView("week");
            if (!selectedDateStr) setSelectedDateStr(new Date().toISOString().slice(0, 10));
          }}>Week</button>
          <button className={calendarView === "year" ? "active" : ""} onClick={() => setCalendarView("year")}>Year</button>
          <button onClick={handleAddEventClick}>Add an event</button>
        </div>
      </header>
      <div className="dashboard">
        <aside className="sidebar glass-panel">
          <div className="section-title">Upcoming Events</div>
          <UpcomingEventsList upcomingEvents={upcomingEvents} />
        </aside>
        <main className="calendar-panel glass-panel">
          {calendarView === "month" ? (
            <MonthView year={viewYear} month={viewMonth} selectedDateStr={selectedDateStr} onSelectDate={setSelectedDateStr} getEventColor={getEventColor} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} onGoToWeekView={() => setCalendarView("week")} events={events} />
          ) : calendarView === "week" ? (
            <WeekView weekDate={weekDate} selectedDate={selectedDateStr} onSelectDate={setSelectedDateStr} onPrevWeek={handlePrevWeek} onNextWeek={handleNextWeek} events={events} />
          ) : (
            <YearView initialYear={viewYear} setViewMonth={setViewMonth} setViewYear={setViewYear} setCalendarView={setCalendarView} />
          )}
        </main>
        <aside className="right-panel glass-panel">
          <div className="section-title">Completed Events</div>
          <div className="CompletedEventsDropdown">
            <CompletedEventsDropdown completedEvents={completedEvents} onSelect={() => { }} />
          </div>

          <button className="download-btn" onClick={handleDownloadClick}><span className="button-content">Download Report</span></button>
          {!showCompletedDropdown && (
            <div className="section-title" style={{ marginTop: 1 }}>Events on Selected Day</div>
          )}
          <EventDetails dateStr={selectedDateStr} getEventColor={getEventColor} events={events} />
        </aside>
      </div>
      {showDownloadDialog && (
        <div id="download-dialog" className="modal">
          <div className="modal-content">
            <h3>Select Report Period</h3>
            <button className="download-mode" onClick={() => handleDownloadOption('week')}>Weekly</button>
            <button className="download-mode" onClick={() => handleDownloadOption('month')}>Monthly</button>
            <button className="download-mode" onClick={() => handleDownloadOption('year')}>Yearly</button>
            <button className="download-mode" onClick={() => handleDownloadOption(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/event-form" element={isAuthenticated ? <EventForm /> : <Navigate to="/login" />} />
        <Route path="/" element={<Dashboard isAuthenticated={isAuthenticated} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
