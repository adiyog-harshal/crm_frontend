import { useEffect, useState } from 'react';
import api from "../../api/axiosConfig";
import './Contacts.css'
import { Users, UserPlus, Trash2, Plus, Search, X, Mail, Phone, Building2, Download } from "lucide-react";
import Button from '../../components/ui/Button'
import SearchInput from '../../components/ui/SearchInput';





const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newContact, setNewContact] = useState({
  name: "",
  company: "",
  email: "",
  phone: "",
  status: true,
});

  // =========================
  // GET CONTACTS
  // =========================
  useEffect(() => {
  fetchContacts();
}, []);

const fetchContacts = async () => {
  try {
    const response = await api.get("contacts/");
    setContacts(response.data);
  } catch (error) {
    console.error("GET error:", error);
  }
};
  // =========================
  // DYNAMIC STATISTICS
  // =========================
  const totalContacts = contacts.length;

  const activeContacts = contacts.filter(
    (c) => c.status === "Active"
  ).length;

  const inactiveContacts = contacts.filter(
    (c) => c.status === "Inactive"
  ).length;

  const uniqueCompanies = new Set(
    contacts
      .map((c) => c.company_name)
      .filter(Boolean)
      .map((company) => company.trim().toLowerCase())
  ).size;

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
    },
  ];

  // =========================
  // ADD CONTACT - POST API
  // =========================
const handleAddContact = async (e) => {
  e.preventDefault();

  console.log("Sending data:", newContact);

  try {
    const companiesResponse = await api.get("companies/");

const company = companiesResponse.data.find(
  (c) =>
    (c.company_name || "").trim().toLowerCase() ===
    newContact.company.trim().toLowerCase()
);

if (!company) {
  alert("Company not found. Please enter an existing company name.");
  return;
}

const contactData = {
  ...newContact,
  company: company.id,
};

const response = await api.post(
  "contacts/add/",
  contactData
);

    console.log("Success:", response.data);

    alert("Contact added successfully!");

    await fetchContacts();

    setNewContact({
      name: "",
      company: "",
      email: "",
      phone: "",
      status: true,
    });

    setIsModalOpen(false);

  } catch (error) {
    console.error("POST ERROR:", error);

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log(
        "BACKEND ERROR:", 
        JSON.stringify(error.response.data, null, 2)
      );

      alert(
        "Backend Error:\n" +
        JSON.stringify(error.response.data, null, 2)
      );
    }
  }
};

  // =========================
  // UPDATE CONTACT STATUS
  // =========================
  const handleUpdateContactStatus = (id, newStatus) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id
          ? { ...contact, status: newStatus }
          : contact
      )
    );
  };

  // =========================
  // DELETE CONTACT
  // =========================
  const handleDeleteContact = (id) => {
    setContacts((prev) =>
      prev.filter((contact) => contact.id !== id)
    );
  };

  // =========================
  // EXPORT CSV
  // =========================
  const handleExportCSV = () => {
    const headers =
      "ID,Name,Company,Email,Phone,Status\n";

    const rows = contacts
      .map(
        (c) =>
          `"${c.id}","${c.name || ""}","${
            c.company_name || c.company || ""
          }","${c.email || ""}","${c.phone || ""}","${
            c.status || ""
          }"`
      )
      .join("\n");

    const blob = new Blob(
      [headers + rows],
      { type: "text/csv;charset=utf-8;" }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.setAttribute(
      "download",
      `Adiyog_CRM_Contacts_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // =========================
  // SEARCH + STATUS FILTER
  // =========================
  const filteredContacts = contacts.filter((contact) => {
    const name = contact.name || 
      `${contact.name || ""} ${contact.name || ""}`;

    const company =
      contact.company_name ||
      contact.company ||
      "";

    const email = contact.email || "";

    const matchesSearch =
      name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      company
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      contact.status === statusFilter;

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
                    <td className="contact-name-cell">
                      {contact.name ||
                        contact.full_name ||
                        `${contact.first_name || ""} ${contact.last_name || ""}`.trim()}
                    </td>
                    <td>{contact.company_name || contact.company}</td>
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
                        className={`contacts-status-select ${contact.status ? "active" : "inactive"}`}
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
                onChange={e =>
                  setNewContact(prev => ({
                    ...prev,
                    name: e.target.value
                  }))
                }
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
                <label>Phone Number *</label>

                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newContact.phone || ""}
                  onChange={(e) =>
                    setNewContact((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="contacts-input-group">
                <label>Status</label>
                <select
                value={newContact.status ? "true" : "false"}
                onChange={(e) =>
                  setNewContact((prev) => ({
                    ...prev,
                    status: e.target.value === "true",
                  }))
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
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