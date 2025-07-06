import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./EventForm.css";
import { eventTypeColors } from "../data/eventTypeColors";

const EVENT_TYPES = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'fest', label: 'Fest' },
  { value: 'sports', label: 'Sports' }
];

export default function EventForm({ onEventAdded }) {
  const [form, setForm] = useState({
    title: '', organizer: '', date: '', time: '', duration: '', location: '', link: '', description: '', type: 'workshop'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    setForm(prev => ({ ...prev, [id || name]: value }));
  };

  const handleTypeClick = (value) => {
    setForm(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the date to YYYY-MM-DD
      const formattedDate = new Date(form.date).toISOString().split('T')[0];
      const eventData = {
        ...form,
        date: formattedDate
      };

      const res = await fetch('http://localhost:8000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 409) {
          // Event clash detected
          alert(`❌ ${errorData.message}\n\nConflicting Event:\nTitle: ${errorData.conflictingEvent.title}\nTime: ${errorData.conflictingEvent.time}\nDuration: ${errorData.conflictingEvent.duration} minutes\nLocation: ${errorData.conflictingEvent.location}\nDate: ${errorData.conflictingEvent.date}`);
        } else {
          throw new Error(errorData.message || 'Failed to submit event');
        }
        return;
      }
      
      alert('🎉 Event Submitted!');
      setForm({ title: '', organizer: '', date: '', time: '', duration: '', location: '', link: '', description: '', type: 'workshop' });
      if (onEventAdded) onEventAdded();
      navigate('/');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="main">
      <div id="particles-js"></div>
      <div className="form-container">
        <div className="form-header">
          <h1><span id="h1-span">Submit Your Event</span> </h1>
          <p>Promote your event to the college community!</p>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Custom Event Type Selector */}
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              {EVENT_TYPES.map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleTypeClick(opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: form.type === opt.value ? '2px solid #e63946' : '1px solid #ccc',
                    background: form.type === opt.value ? 'rgba(230,57,70,0.12)' : 'rgba(255,255,255,0.08)',
                    color: 'white',
                    fontWeight: form.type === opt.value ? 'bold' : 'normal',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'border 0.2s, background 0.2s',
                  }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: eventTypeColors[opt.value],
                    marginRight: 8,
                    border: '1px solid #fff',
                  }} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Organizer */}
          <div className="form-group">
            <label htmlFor="organizer">Organizer</label>
            <input
              type="text"
              id="organizer"
              value={form.organizer}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Time */}
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>

          {/* Duration */}
          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g., 60 for 1 hour"
              min="15"
              max="1440"
              required
            />
            <small style={{ color: '#ccc', fontSize: '14px', marginTop: '5px', display: 'block' }}>
              Minimum: 15 minutes | Maximum: 24 hours (1440 minutes)
            </small>
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Link */}
          <div className="form-group">
            <label htmlFor="link">Link</label>
            <input
              type="url"
              id="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://event-link.com"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="5"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what your event is about..."
              required
            />
          </div>
          <button type="submit">Submit Event 🚀</button>
        </form>
      </div>

      <div className="preview-container">
        <h2>🔍 Live Event Preview</h2>
        <div id="preview">
          <h3>{form.title || 'Event Title'}</h3>
          <p><strong>By:</strong> {form.organizer || 'Organizer'}</p>
          <p><strong>Date:</strong> {form.date || 'YYYY-MM-DD'}</p>
          <p><strong>Time:</strong> {form.time || '--:--'}</p>
          <p><strong>Duration:</strong> {form.duration ? `${form.duration} minutes` : 'Duration'}</p>
          <p><strong>Location:</strong> {form.location || 'Location'}</p>
          <p><strong>Link:</strong> {form.link || '-'}</p>
          <p><strong>Type:</strong> {form.type}</p>
          <p><strong>Description:</strong><br />{form.description || 'Event description will appear here.'}</p>
        </div>
      </div>
    </div>
  );
}