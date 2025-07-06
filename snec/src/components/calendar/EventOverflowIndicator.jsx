import React from "react";
const EventOverflowIndicator = ({ events, renderEvent }) => {
  if (!events || events.length === 0) return null;
  const maxVisible = 2;
  const visibleEvents = events.slice(0, maxVisible);
  const extraCount = events.length - maxVisible;
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center', marginTop: 2 }}>
      {visibleEvents.map((event, idx) => (
        <span key={event.id || idx}>
          {renderEvent ? renderEvent(event) : event.title || JSON.stringify(event)}
        </span>
      ))}
      {extraCount > 0 && (
        <span style={{ color: '#888', fontSize: '0.95em', marginLeft: 2 }}>+{extraCount}</span>
      )}
    </div>
  );
};

export default EventOverflowIndicator; 