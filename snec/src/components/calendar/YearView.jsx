import React, { useState } from "react";

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Generate a matrix representing the days of a month
function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const firstDayIndex = firstDay.getDay();
  const lastDay = new Date(year, month + 1, 0);
  const numberOfDays = lastDay.getDate();

  const matrix = [];
  let week = Array(firstDayIndex).fill(null);

  for (let day = 1; day <= numberOfDays; day++) {
    week.push(day);
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }

  return matrix;
}

export default function YearView({
  initialYear = new Date().getFullYear(),
  setViewDate,
  setCalendarView
}) {
const [year, setYear] = useState(initialYear);
const [quarter, setQuarter] = useState(0); // 0: Jan-Apr, 1: May-Aug, 2: Sep-Dec

const monthsToShow = [quarter * 4, quarter * 4 + 1, quarter * 4 + 2, quarter * 4 + 3];

const handlePrevQuarter = () => {
  if (quarter === 0) {
    setQuarter(2);
    setYear(prev => prev - 1);
    setViewDate(prev => ({ ...prev, year: prev.year - 1 }));
  } else {
    setQuarter(prev => prev - 1);
  }
};

const handlePrevYear = () => {
  setYear(prev => prev - 1);
  setViewDate(prev => ({ ...prev, year: prev.year - 1 }));
};

const handleNextQuarter = () => {
  if (quarter === 2) {
    setQuarter(0);
    setYear(prev => prev + 1);
    setViewDate(prev => ({ ...prev, year: prev.year + 1 }));
  } else {
    setQuarter(prev => prev + 1);
  }
};

const handleNextYear = () => {
  setYear(prev => prev + 1);
  setViewDate(prev => ({ ...prev, year: prev.year + 1 }));
};

const handleMonthClick = (monthIndex) => {
  setViewDate(prev => ({ ...prev, year: year, month: monthIndex }));
  setCalendarView("month");
};

return (
  <div className="yearview-container">
    <div className="yearview-topbar">
      <button className="calendar-nav-btn" onClick={handlePrevQuarter}>{"<"}</button>
      <span className="calendar-month-label">{year}</span>
      <button className="calendar-nav-btn" onClick={handleNextQuarter}>{">"}</button>
    </div>

    <div className="yearview-grid">
      {monthsToShow.map((monthIdx) => (
        <div
          className="yearview-month-block"
          key={monthIdx}
          onClick={() => handleMonthClick(monthIdx)}
        >
          <div className="yearview-month-title">{MONTHS[monthIdx]}</div>
          <div className="yearview-month-calendar">
            <div className="yearview-weekdays">
              {WEEKDAYS.map((day) => (
                <span key={day} className="yearview-weekday">{day}</span>
              ))}
            </div>
            <div className="yearview-days">
              {getMonthMatrix(year, monthIdx).map((week, i) => (
                <div className="yearview-week" key={i}>
                  {week.map((day, j) => (
                    <span
                      key={j}
                      className={`yearview-day ${day === null ? "yearview-day-empty" : ""}`}
                    >
                      {day !== null ? day : ""}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}
