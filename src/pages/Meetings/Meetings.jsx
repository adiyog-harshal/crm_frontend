import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./Meetings.css";

const emptyMeeting = {
  title: "", agenda: "", meeting_date: "", start_time: "", meeting_type: "Online",
  meeting_link: "", address: "", lead: "", deal: "", notes: "", follow_up_date: "", status: true,
};

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyMeeting);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    try {
      const [meetingResponse, leadResponse, dealResponse] = await Promise.all([
        api.get("meeting/"), api.get("leads/"), api.get("deal/"),
      ]);
      setMeetings(meetingResponse.data);
      setLeads(leadResponse.data);
      setDeals(dealResponse.data);
    } catch (error) { console.error(error); alert("Unable to load meetings."); }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => { setForm(emptyMeeting); setEditingId(null); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingId(null); };
  const leadName = (id) => {
    const lead = leads.find((item) => Number(item.id) === Number(id));
    return lead ? `${lead.first_name} ${lead.last_name}` : "—";
  };
  const dealName = (id) => deals.find((item) => Number(item.id) === Number(id))?.deal_name || "—";

  const editMeeting = (meeting) => {
    setForm({ ...emptyMeeting, ...meeting, lead: meeting.lead || "", deal: meeting.deal || "" });
    setEditingId(meeting.id);
    setShowModal(true);
  };

  const saveMeeting = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title,
      agenda: form.agenda || null,
      meeting_date: form.meeting_date,
      start_time: form.start_time,
      meeting_type: form.meeting_type,
      meeting_link: form.meeting_link || null,
      address: form.address || null,
      lead: form.lead ? Number(form.lead) : null,
      deal: form.deal ? Number(form.deal) : null,
      notes: form.notes || null,
      follow_up_date: form.follow_up_date || null,
      status: form.status,
    };
    try {
      if (editingId) await api.put(`meeting/update/${editingId}/`, payload);
      else await api.post("meeting/add/", payload);
      await loadData();
      closeModal();
    } catch (error) { console.error(error); alert("Unable to save meeting. Please check the required fields."); }
  };

  const deleteMeeting = async (id) => {
    if (!window.confirm("Delete this meeting?")) return;
    try { await api.delete(`meeting/delete/${id}/`); await loadData(); }
    catch (error) { console.error(error); alert("Unable to delete meeting."); }
  };

  const visibleMeetings = meetings.filter((meeting) =>
    `${meeting.title} ${leadName(meeting.lead)} ${dealName(meeting.deal)}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="meetings-page">
      <div className="meetings-topbar">
        <div><h2>Meetings</h2><p>Schedule and manage customer meetings</p></div>
        <div className="meetings-actions"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search meetings..." /><button onClick={openCreate}>+ Create Meeting</button></div>
      </div>
      <section className="meetings-card"><h3>All Meetings <span>{meetings.length}</span></h3>
        <div className="meetings-table-wrap"><table className="meetings-table"><thead><tr><th>Title</th><th>Date & time</th><th>Type</th><th>Related to</th><th>Actions</th></tr></thead>
          <tbody>{visibleMeetings.length ? visibleMeetings.map((meeting) => <tr key={meeting.id}><td>{meeting.title}</td><td>{meeting.meeting_date} · {meeting.start_time}</td><td>{meeting.meeting_type}</td><td>{meeting.deal ? dealName(meeting.deal) : leadName(meeting.lead)}</td><td><button className="meeting-edit" onClick={() => editMeeting(meeting)}>Edit</button><button className="meeting-delete" onClick={() => deleteMeeting(meeting.id)}>Delete</button></td></tr>) : <tr><td colSpan="5" className="meeting-empty">No meetings found</td></tr>}</tbody>
        </table></div>
      </section>
      {showModal && <div className="meeting-modal-overlay"><form className="meeting-modal" onSubmit={saveMeeting}>
        <div className="meeting-modal-header"><h3>{editingId ? "Edit Meeting" : "Create Meeting"}</h3><button type="button" onClick={closeModal}>×</button></div>
        <div className="meeting-form-grid">
          <label className="meeting-full">Title *<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Date *<input required type="date" value={form.meeting_date} onChange={(e) => setForm({ ...form, meeting_date: e.target.value })} /></label>
          <label>Start time *<input required type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></label>
          <label>Meeting type *<select value={form.meeting_type} onChange={(e) => setForm({ ...form, meeting_type: e.target.value })}><option>Online</option><option>Offline</option></select></label>
          <label>Lead<select value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })}><option value="">No lead</option>{leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.first_name} {lead.last_name}</option>)}</select></label>
          <label>Deal<select value={form.deal} onChange={(e) => setForm({ ...form, deal: e.target.value })}><option value="">No deal</option>{deals.map((deal) => <option key={deal.id} value={deal.id}>{deal.deal_name}</option>)}</select></label>
          <label>Meeting link<input type="url" value={form.meeting_link || ""} onChange={(e) => setForm({ ...form, meeting_link: e.target.value })} /></label>
          <label>Address<input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
          <label className="meeting-full">Agenda<textarea value={form.agenda || ""} onChange={(e) => setForm({ ...form, agenda: e.target.value })} /></label>
        </div>
        <div className="meeting-modal-footer"><button type="button" onClick={closeModal}>Cancel</button><button type="submit">{editingId ? "Save Changes" : "Create Meeting"}</button></div>
      </form></div>}
    </div>
  );
};

export default Meetings;
