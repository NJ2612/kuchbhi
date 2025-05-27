import React from "react";

export default function UpcomingEventsList({ upcomingEvents }) {
  return (
    <ul>
      {upcomingEvents.map(e => (
        <li key={e.title + e.date}>
          <strong>{e.title}</strong> ({e.date})<br />
          <span>{e.time} | {e.club}</span>
        </li>
      ))}
    </ul>
  );
}