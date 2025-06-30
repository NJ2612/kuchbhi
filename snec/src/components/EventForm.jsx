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
    title: '', organizer: '', date: '', time: '', location: '', link: '', description: '', type: 'workshop'
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
      if (!res.ok) throw new Error('Failed to submit event');
      alert('🎉 Event Submitted!');
      setForm({ title: '', organizer: '', date: '', time: '', location: '', link: '', description: '', type: 'workshop' });
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
          {/* Other fields */}
          {['title', 'organizer', 'date', 'time', 'location', 'link', 'description'].map((field, idx) => (
            <div className="form-group" key={idx}>
              <label htmlFor={field}>{field.replace(/^[a-z]/, c => c.toUpperCase())}</label>
              {field !== 'description' ? (
                <input
                  type={field === 'date' ? 'date' : field === 'time' ? 'time' : field === 'link' ? 'url' : 'text'}
                  id={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field === 'link' ? 'https://event-link.com' : ''}
                  required={field !== 'link'}
                />
              ) : (
                <textarea
                  id={field}
                  rows="5"
                  value={form[field]}
                  onChange={handleChange}
                  placeholder="Describe what your event is about..."
                  required
                />
              )}
            </div>
          ))}
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
          <p><strong>Location:</strong> {form.location || 'Location'}</p>
          <p><strong>Link:</strong> {form.link || '-'}</p>
          <p><strong>Type:</strong> {form.type}</p>
          <p><strong>Description:</strong><br />{form.description || 'Event description will appear here.'}</p>
        </div>
      </div>
    </div>
  );
}