import React from "react";
import { getEventColor } from "../../utils/eventUtils";

export default function CompletedEventsDropdown({ completedEvents, onSelect }) {
  return (
    <select
      style={{
        padding: "8px 12px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        cursor: "pointer",
        borderBlockColor: "white",
        boxShadow: "none",
        width: "180px"
      }}
      onChange={e => {
        const idx = e.target.value;
        if (idx === "") {
          onSelect(null);
        } else {
          onSelect(completedEvents[parseInt(idx)]);
        }
      }}
    >
      <option value="">Select Event</option>
      {completedEvents.map((e, i) => (
        <option key={e.title + e.date} value={i} style={{ color: getEventColor(e.type) }}>
          {e.title} ({e.date})
        </option>
      ))}
    </select>
  );
}
