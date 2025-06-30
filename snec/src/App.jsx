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
import React from "react";

function Dashboard({ isAuthenticated, refetchEventsRef }) {
  const navigate = useNavigate();
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [calendarView, setCalendarView] = useState("month");
  const [events, setEvents] = useState([]);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showCompletedDropdown, setShowCompletedDropdown] = useState(false);
  const [customRangeMode, setCustomRangeMode] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [selectedCompletedEvent, setSelectedCompletedEvent] = useState(null);

  // Ref for refetching events from outside
  const fetchEvents = async () => {
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
  };

  // Expose fetchEvents to parent via ref
  if (refetchEventsRef) {
    refetchEventsRef.current = fetchEvents;
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const weekDate = calendarView === "week" && !selectedDateStr
    ? new Date()
    : selectedDateStr
      ? new Date(selectedDateStr)
      : new Date(viewYear, viewMonth, 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    const eventDateTime = new Date(e.date + 'T' + (e.time || '00:00'));
    const now = new Date();
    
    // If event is on a future date, it's upcoming
    if (eventDate > today) {
      return true;
    }
    
    // If event is today, check if the time hasn't passed yet
    if (eventDate.getTime() === today.getTime()) {
      return eventDateTime > now;
    }
    
    return false;
  });

  // Filter completed events for current month only (previous events only)
  const completedEventsCurrentMonth = events.filter(e => {
    const eventDate = new Date(e.date);
    const eventDateTime = new Date(e.date + 'T' + (e.time || '00:00'));
    const now = new Date();
    
    // Check if event is in the current month and year
    const isCurrentMonth = eventDate.getMonth() === viewMonth && eventDate.getFullYear() === viewYear;
    
    // Only include events that are on past dates (not today)
    if (eventDate < today) {
      return isCurrentMonth;
    }
    
    // Don't include today's events even if they've passed
    return false;
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
    if (range === "custom") {
      setCustomRangeMode(true);
      return;
    }
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
    setCustomRangeMode(false);
    setCustomStart("");
    setCustomEnd("");
  };

  const handleCustomDownload = () => {
    if (!customStart || !customEnd) {
      alert("Please select both start and end dates.");
      return;
    }
    const range = JSON.stringify({ start: customStart, end: customEnd });
    const downloadUrl = `http://localhost:8000/api/reports/download?range=${encodeURIComponent(range)}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setShowDownloadDialog(false);
    setCustomRangeMode(false);
    setCustomStart("");
    setCustomEnd("");
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
          <div style={{ width: "100%", marginTop: "20px" }}>
            <div className="section-title">Completed Events (This Month)</div>
            <div className="CompletedEventsDropdown">
              <CompletedEventsDropdown 
                completedEvents={completedEventsCurrentMonth} 
                onSelect={setSelectedCompletedEvent} 
              />
            </div>
            <div className="completed-event-card-outer" style={{ width: '100%', maxWidth: '220px', minHeight: '60px', margin: '8px auto 0 auto', background: 'none', border: 'none', display: 'flex', justifyContent: 'center' }}>
              {selectedCompletedEvent && (
                <div
                  className="event-item"
                  style={{
                    borderLeft: `6px solid ${getEventColor(selectedCompletedEvent.type)}`,
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px #0001',
                    padding: '0',
                    margin: '0 auto',
                    width: '100%',
                    minWidth: 0,
                    maxWidth: '220px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                  }}
                >
                  <div style={{
                    padding: '16px',
                    maxHeight: '80px',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                  className="completed-event-card-scroll">
                    <div className="event-title" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: getEventColor(selectedCompletedEvent.type) }}>
                      {selectedCompletedEvent.title}
                      <span className={`event-dot ${selectedCompletedEvent.type}`} style={{ marginLeft: 5, background: getEventColor(selectedCompletedEvent.type), display: 'inline-block', width: 10, height: 10, borderRadius: '50%' }} />
                    </div>
                    <div className="event-time">{selectedCompletedEvent.time || "Time not specified"}</div>
                    <div className="event-desc" style={{ fontSize: '0.95rem', color: '#333', textAlign: 'left' }}>
                      {selectedCompletedEvent.club && <>By <strong>{selectedCompletedEvent.club}</strong><br /></>}
                      {selectedCompletedEvent.results && <><strong>Results:</strong> {selectedCompletedEvent.results}<br /></>}
                      {selectedCompletedEvent.desc || "No description provided."}
                    </div>
                  </div>
                  <style>{`
                    .completed-event-card-scroll::-webkit-scrollbar { display: none; }
                    .completed-event-card-scroll { scrollbar-width: none; -ms-overflow-style: none; }
                  `}</style>
                </div>
              )}
            </div>
          </div>
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
            <button className="download-mode" onClick={() => handleDownloadOption('custom')}>Custom Range</button>
            <button className="download-mode" onClick={() => handleDownloadOption(null)}>Cancel</button>
            {customRangeMode && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label>Start Date: <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} /></label>
                <label>End Date: <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} /></label>
                <button className="download-mode" style={{ background: '#1976d2' }} onClick={handleCustomDownload}>Download Custom Range</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const refetchEventsRef = React.useRef(null);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/event-form" element={isAuthenticated ? <EventForm onEventAdded={() => {
          if (refetchEventsRef.current) refetchEventsRef.current();
        }} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Dashboard isAuthenticated={isAuthenticated} refetchEventsRef={refetchEventsRef} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
