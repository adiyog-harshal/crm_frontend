import React, { useState, useEffect } from 'react';
import './Meetings.css';

const normalizeMeeting = (m) => ({
  id: m.id,
  title: m.title || "Untitled Meeting",
  date: m.meeting_date || "",
  time: m.start_time || "",
  type: m.meeting_type || "",
  status: m.status,
});

const Meetings = () => {
  const [showModal, setShowModal] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOnline, setFilterOnline] = useState(false);
  const [filterOffline, setFilterOffline] = useState(false);
  const [filterUpcoming, setFilterUpcoming] = useState(false);
  const [filterPast, setFilterPast] = useState(false);

  const [meetingForm, setMeetingForm] = useState({
    title: "",
    meeting_date: "",
    start_time: "",
    meeting_type: "Online",
    agenda: ""
  });

  const fetchMeetings = () => {
    fetch('https://crm-backend-39kt.onrender.com/api/meeting/')
      .then(res => res.json())
      .then(data => {
        const normalized = Array.isArray(data) ? data.map(normalizeMeeting) : [];
        setMeetings(normalized);
      })
      .catch(err => console.error("Error fetching Meetings:", err));
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleAddMeeting = (e) => {
    e.preventDefault();
    if (!meetingForm.title || !meetingForm.meeting_date || !meetingForm.start_time) return;

    fetch('https://crm-backend-39kt.onrender.com/api/meeting/add/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingForm)
    })
      .then(res => res.json())
      .then(data => {
        setMeetings(prev => [normalizeMeeting(data), ...prev]);
        setMeetingForm({ title: "", meeting_date: "", start_time: "", meeting_type: "Online", agenda: "" });
        setShowModal(false);
      })
      .catch(err => console.error("Error adding meeting:", err));
  };

  const handleDeleteMeeting = (id) => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      fetch(`https://crm-backend-39kt.onrender.com/api/meeting/delete/${id}/`, {
        method: 'DELETE',
      })
        .then(() => {
          setMeetings(prev => prev.filter(m => m.id !== id));
        })
        .catch(err => console.error("Error deleting meeting:", err));
    }
  };

  // Filtering logic
  const today = new Date().toISOString().split('T')[0];

  const filteredMeetings = meetings.filter(m => {
    // Search filter (by title)
    if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Type filters (if any type checkbox is checked, meeting must match one of them)
    if (filterOnline || filterOffline) {
      const matchesType =
        (filterOnline && m.type === "Online") ||
        (filterOffline && m.type === "Offline");
      if (!matchesType) return false;
    }

    // Date filters (if any date checkbox is checked, meeting must match one of them)
    if (filterUpcoming || filterPast) {
      const isUpcoming = m.date >= today;
      const matchesDate =
        (filterUpcoming && isUpcoming) ||
        (filterPast && !isUpcoming);
      if (!matchesDate) return false;
    }

    return true;
  });

  return (
    <div className="meeting-page">

      {/* Top Bar */}
      <div className="meeting-topbar">
        <h2> Meetings </h2>
        <div className="topbar-row">
          <input type="text" placeholder="Search records.." className="top-search" />
          <button className="create-btn" onClick={() => setShowModal(true)}> + Create Meeting </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="meeting-toolbar">
        <div className="toolbar-top">
          <span className="all-records-label">All Meetings</span>
        </div>
        <div className="toolbar-icons">
          <button> Filter</button>
          <h4 className='sort-toolbar'> Sort</h4>
        </div>
      </div>

      <div className="meeting-body">

        {/* Left Filter Panel */}
        <div>
          <div className="filter-panel">
            <h4> Filter Meetings By</h4>
            <input
              type="text"
              placeholder="Search by title"
              className="filter-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <p className="filter-heading">Meeting Type</p>
            <ul>
              <li>
                <input type="checkbox" checked={filterOnline} onChange={(e) => setFilterOnline(e.target.checked)} /> Online
              </li>
              <li>
                <input type="checkbox" checked={filterOffline} onChange={(e) => setFilterOffline(e.target.checked)} /> Offline
              </li>
            </ul>

            <p className="filter-heading">Schedule</p>
            <ul>
              <li>
                <input type="checkbox" checked={filterUpcoming} onChange={(e) => setFilterUpcoming(e.target.checked)} /> Upcoming
              </li>
              <li>
                <input type="checkbox" checked={filterPast} onChange={(e) => setFilterPast(e.target.checked)} /> Past
              </li>
            </ul>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-section">
          <table className="meeting-table">
            <thead>
              <tr>
                <th> Title </th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredMeetings.length === 0 ? (
                <tr><td colSpan="5">No meetings found</td></tr>
              ) : (
                filteredMeetings.map((m) => (
                  <tr key={m.id}>
                    <td>{m.title}</td>
                    <td>{m.date}</td>
                    <td>{m.time}</td>
                    <td>{m.type}</td>
                    <td>
                      <button onClick={() => handleDeleteMeeting(m.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Create Meeting Modal */}
      {showModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', width: '400px' }}>
            <h3>Create New Meeting</h3>
            <form onSubmit={handleAddMeeting}>
              <div style={{ marginBottom: '12px' }}>
                <label>Title *</label>
                <input
                  type="text"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Date *</label>
                <input
                  type="date"
                  value={meetingForm.meeting_date}
                  onChange={(e) => setMeetingForm({ ...meetingForm, meeting_date: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Time *</label>
                <input
                  type="time"
                  value={meetingForm.start_time}
                  onChange={(e) => setMeetingForm({ ...meetingForm, start_time: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Type</label>
                <select
                  value={meetingForm.meeting_type}
                  onChange={(e) => setMeetingForm({ ...meetingForm, meeting_type: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', background: '#4338ca', color: 'white', border: 'none', borderRadius: '4px' }}>Create Meeting</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Meetings;
