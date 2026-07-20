import React, { useState } from 'react'
import './Leads.css'
import { Users, UserPlus, Briefcase, IndianRupee, Trash2, Plus, Search, X, Mail, Phone, Download } from "lucide-react";
import Button from '../components/ui/Button';
import SearchInput from '../components/ui/SearchInput';

const Leads = () => {
  const [leads, setLeads] = useState([
    { id: 1, name: "Rahul Sharma", company: "Infosys", email: "rahul.sharma@infosys.com", phone: "+91 98765 43210", status: "New" },
    { id: 2, name: "Priya Singh", company: "TCS", email: "priya.singh@tcs.com", phone: "+91 87654 32109", status: "Qualified" },
    { id: 3, name: "Amit Patel", company: "HCL", email: "amit.patel@hcl.com", phone: "+91 76543 21098", status: "Contacted" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", company: "", email: "", phone: "", status: "New" });

  // Dynamic calculations based on state
  const computedStats = [
    {
      title: "Total Leads",
      value: leads.length.toString(),
      icon: <UserPlus size={24} />,
      color: "#1e293b",
    },
    {
      title: "Customers",
      value: leads.filter(l => l.status === "Qualified").length.toString(),
      icon: <Users size={24} />,
      color: "#1e293b",
    },
    {
      title: "Active Deals",
      value: leads.filter(l => l.status === "Contacted").length.toString(),
      icon: <Briefcase size={24} />,
      color: "#1e293b",
    },
    {
      title: "Revenue (Est.)",
      value: `₹${(leads.filter(l => l.status === "Qualified").length * 1.5).toFixed(1)}L`,
      icon: <IndianRupee size={24} />,
      color: "#1e293b",
    }
  ];

  // Lead Handlers
  const handleUpdateLeadStatus = (id, newStatus) => {
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
  };

  const handleDeleteLead = (id) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  const handleAddLead = (e) => {
    e.preventDefault();
    if (!newLead.name.trim() || !newLead.company.trim()) return;
    setLeads(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newLead.name.trim(),
        company: newLead.company.trim(),
        email: newLead.email.trim() || `${newLead.name.toLowerCase().replace(/\s+/g, '.')}@${newLead.company.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: newLead.phone.trim() || "+91 99999 88888",
        status: newLead.status
      }
    ]);
    setNewLead({ name: "", company: "", email: "", phone: "", status: "New" });
    setIsModalOpen(false);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="leads-container">
        {/* Top Action Header */}
        <div className="leads-page-header">
          <div>
            <h2>Leads</h2>
            <p>Track and convert incoming customer leads</p>
          </div>
          <div className="header-actions">
            <SearchInput
              placeholder="Search name, company, email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="leads-search-bar"
            />
            <Button
              variant="success"
              icon={<Download size={16} />}
              className="leads-Export-btn"
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={() => setIsModalOpen(true)}
              className="leads-add-btn"
            >
              Add Lead
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="leads-stats-grid">
           {computedStats.map((item, index) => (
            <div className="leads-stat-card" key={index}>
              <div className='leads-stat-icon' style={{background: item.color}}>
                {item.icon}
              </div>
              <div className='leads-stat-content'>
                <p>{item.title}</p>
                <h2>{item.value}</h2>
              </div>
            </div>
           ))}
        </div>

        {/* Management Card */}
        <div className='leads-card'>
          <div className="leads-card-header">
            <div className="header-left-group">
              <h3>Leads Management</h3>
              
              {/* Status Filters */}
              <div className="filter-pills">
                {["All", "New", "Contacted", "Qualified", "Lost"].map(status => (
                  <button
                    key={status}
                    className={`filter-pill ${statusFilter === status ? 'active' : ''}`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <table className="leads-table">
            <thead>
              <tr>
                 <th>Name</th>
                 <th>Company</th>
                 <th>Email</th>
                 <th>Phone</th>
                 <th>Status</th>
                 <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map(lead => (
                  <tr key={lead.id}>
                    <td className="lead-name-cell">{lead.name}</td>
                    <td>{lead.company}</td>
                    <td>
                      <span className="info-badge">
                        <Mail size={12} />
                        {lead.email}
                      </span>
                    </td>
                    <td>
                      <span className="info-badge">
                        <Phone size={12} />
                        {lead.phone}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`leads-status-select ${lead.status.toLowerCase()}`}
                        value={lead.status}
                        onChange={e => handleUpdateLeadStatus(lead.id, e.target.value)}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td>
                      <button className="leads-delete-btn" onClick={() => handleDeleteLead(lead.id)} title="Delete Lead">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="leads-empty-state">No leads found matching current criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {isModalOpen && (
        <div className="leads-modal-overlay">
          <div className="leads-modal-card">
            <div className="leads-modal-header">
              <h3>Add New Lead</h3>
              <button className="leads-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddLead} className="leads-modal-form">
              <div className="leads-input-group">
                <label>Lead Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newLead.name}
                  onChange={e => setNewLead(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="leads-input-group">
                <label>Company *</label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={newLead.company}
                  onChange={e => setNewLead(prev => ({ ...prev, company: e.target.value }))}
                  required
                />
              </div>
              <div className="leads-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={newLead.email}
                  onChange={e => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="leads-input-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 XXXXX XXXXX"
                  value={newLead.phone}
                  onChange={e => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="leads-input-group">
                <label>Status</label>
                <select
                  value={newLead.status}
                  onChange={e => setNewLead(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div className="leads-modal-actions">
                <button type="button" className="leads-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="leads-btn-submit">Add Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Leads