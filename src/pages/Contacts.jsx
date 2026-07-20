import React, { useState } from 'react'
import './Contacts.css'
import { Users, UserPlus, Trash2, Plus, Search, X, Mail, Phone, Building2, Download } from "lucide-react";
import Button from '../components/ui/Button';
import SearchInput from '../components/ui/SearchInput';

const Contacts = () => {
  const [contacts, setContacts] = useState([
    { id: 1, name: "Ananya Iyer", company: "Wipro", email: "ananya.iyer@wipro.com", phone: "+91 98765 01234", status: "Active" },
    { id: 2, name: "Rohan Mehta", company: "Reliance", email: "rohan.mehta@reliance.com", phone: "+91 87654 90123", status: "Active" },
    { id: 3, name: "Sneha Reddy", company: "Flipkart", email: "sneha.reddy@flipkart.com", phone: "+91 76543 89012", status: "Inactive" },
    { id: 4, name: "Vikram Malhotra", company: "Tata Motors", email: "v.malhotra@tatamotors.com", phone: "+91 65432 78901", status: "Active" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", company: "", email: "", phone: "", status: "Active" });

  // Dynamic statistics calculations
  const totalContacts = contacts.length;
  const activeContacts = contacts.filter(c => c.status === "Active").length;
  const inactiveContacts = contacts.filter(c => c.status === "Inactive").length;
  const uniqueCompanies = new Set(contacts.map(c => c.company.trim().toLowerCase())).size;

  const computedStats = [
    {
      title: "Total Contacts",
      value: totalContacts.toString(),
      icon: <Users size={24} />,
      color: "#1e293b",
    },
    {
      title: "Active Contacts",
      value: activeContacts.toString(),
      icon: <UserPlus size={24} />,
      color: "#1e293b",
    },
    {
      title: "Inactive Contacts",
      value: inactiveContacts.toString(),
      icon: <Users size={24} />,
      color: "#1e293b",
    },
    {
      title: "Partner Companies",
      value: uniqueCompanies.toString(),
      icon: <Building2 size={24} />,
      color: "#1e293b",
    }
  ];

  // Handlers
  const handleUpdateContactStatus = (id, newStatus) => {
    setContacts(prev => prev.map(contact => contact.id === id ? { ...contact, status: newStatus } : contact));
  };

  const handleDeleteContact = (id) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContact.name.trim() || !newContact.company.trim()) return;
    setContacts(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newContact.name.trim(),
        company: newContact.company.trim(),
        email: newContact.email.trim() || `${newContact.name.toLowerCase().replace(/\s+/g, '.')}@${newContact.company.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: newContact.phone.trim() || "+91 99999 88888",
        status: newContact.status
      }
    ]);
    setNewContact({ name: "", company: "", email: "", phone: "", status: "Active" });
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = "ID,Name,Company,Email,Phone,Status\n";
    const rows = contacts.map(c => 
      `"${c.id}","${c.name.replace(/"/g, '""')}","${c.company.replace(/"/g, '""')}","${c.email.replace(/"/g, '""')}","${c.phone.replace(/"/g, '""')}","${c.status}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Adiyog_CRM_Contacts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="contacts-container">
        {/* Top Action Header */}
        <div className="contacts-page-header">
          <div>
            <h2>Contacts</h2>
            <p>Manage and organize your client contacts</p>
          </div>
          <div className="header-actions">
            <SearchInput
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="contacts-search-bar"
            />
            <Button
              variant="success"
              icon={<Download size={16} />}
              onClick={handleExportCSV}
              className="contacts-Export-btn"
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={() => setIsModalOpen(true)}
              className="contacts-add-btn"
            >
              Add Contact
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="contacts-stats-grid">
           {computedStats.map((item, index) => (
            <div className="contacts-stat-card" key={index}>
              <div className='contacts-stat-icon' style={{background: item.color}}>
                {item.icon}
              </div>
              <div className='contacts-stat-content'>
                <p>{item.title}</p>
                <h2>{item.value}</h2>
              </div>
            </div>
           ))}
        </div>

        {/* Management Card */}
        <div className='contacts-card'>
          <div className="contacts-card-header">
            <div className="header-left-group">
              <h3>Contacts List</h3>
              
              {/* Status Filters */}
              <div className="filter-pills">
                {["All", "Active", "Inactive"].map(status => (
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

          <table className="contacts-table">
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
              {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <tr key={contact.id}>
                    <td className="contact-name-cell">{contact.name}</td>
                    <td>{contact.company}</td>
                    <td>
                      <span className="info-badge">
                        <Mail size={12} />
                        {contact.email}
                      </span>
                    </td>
                    <td>
                      <span className="info-badge">
                        <Phone size={12} />
                        {contact.phone}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`contacts-status-select ${contact.status.toLowerCase()}`}
                        value={contact.status}
                        onChange={e => handleUpdateContactStatus(contact.id, e.target.value)}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>
                    <td>
                      <button className="contacts-delete-btn" onClick={() => handleDeleteContact(contact.id)} title="Delete Contact">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="contacts-empty-state">No contacts found matching current criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contact Modal */}
      {isModalOpen && (
        <div className="contacts-modal-overlay">
          <div className="contacts-modal-card">
            <div className="contacts-modal-header">
              <h3>Add New Contact</h3>
              <button className="contacts-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddContact} className="contacts-modal-form">
              <div className="contacts-input-group">
                <label>Contact Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newContact.name}
                  onChange={e => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="contacts-input-group">
                <label>Company *</label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={newContact.company}
                  onChange={e => setNewContact(prev => ({ ...prev, company: e.target.value }))}
                  required
                />
              </div>
              <div className="contacts-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={newContact.email}
                  onChange={e => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="contacts-input-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 XXXXX XXXXX"
                  value={newContact.phone}
                  onChange={e => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="contacts-input-group">
                <label>Status</label>
                <select
                  value={newContact.status}
                  onChange={e => setNewContact(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="contacts-modal-actions">
                <button type="button" className="contacts-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="contacts-btn-submit">Add Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Contacts