import React from "react";

export default function ClubSelector({ clubs, selectedClub, onChange }) {
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
     boxShadow: "none"
  }}
    value={selectedClub} onChange={e => onChange(e.target.value)}>
      <option value="">Select a Club</option>
      {Object.keys(clubs).map(club => (
        <option key={club} value={club}>{club}</option>
      ))}
    </select>
  );
}
