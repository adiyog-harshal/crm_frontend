import React, { useState, useEffect } from "react";
import "./Leads.css";
import api from "../../services/api";
import {
  Users,
  UserPlus,
  Briefcase,
  IndianRupee,
  Trash2,
  Plus,
  Search,
  X,
  Mail,
  Phone,
  Download,
} from "lucide-react";

import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [customLocation, setCustomLocation] = useState({
    country: "",
    state: "",
    city: "",
  });
  const [newLead, setNewLead] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    source: "",
    status: true,
    country: "",
    state: "",
    city: "",
  });

  useEffect(() => {
    fetchLeads();
    fetchCountries();
    fetchStates();
    fetchCities();
  }, []);
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await api.get("leads/");
      setLeads(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch leads.");
    } finally {
      setLoading(false);
    }
  };
  const fetchCountries = async () => {
    try {
      const response = await api.get("masters/countries/");
      setCountries(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchStates = async () => {
    try {
      const response = await api.get("masters/states/");
      setStates(response.data);
    } catch (error) {
      console.error("Unable to fetch states:", error);
    }
  };
  const fetchCities = async () => {
    try {
      const response = await api.get("masters/city/");
      setCities(response.data);
    } catch (error) {
      console.error("Unable to fetch cities:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setNewLead({
      ...newLead,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const resetForm = () => {
    setNewLead({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      source: "",
      status: true,
      country: "",
      state: "",
      city: "",
    });
    setCustomLocation({ country: "", state: "", city: "" });
    setEditingId(null);
    setIsEditing(false);
  };

  const createCode = (value) => value.trim().replace(/\s+/g, "").slice(0, 10).toUpperCase();

  const resolveLocationIds = async () => {
    const countryName = customLocation.country.trim();
    const stateName = customLocation.state.trim();
    const cityName = customLocation.city.trim();

    // -------------------------
    // FIND COUNTRY
    // -------------------------
    let country = countries.find(
      (item) =>
        item.country_name?.trim().toLowerCase() ===
        countryName.toLowerCase()
    );

    if (!country) {
      throw new Error(`Country "${countryName}" not found.`);
    }

    // -------------------------
    // FIND OR CREATE STATE
    // -------------------------
    let state = states.find(
      (item) =>
        Number(item.country) === Number(country.id) &&
        item.state_name?.trim().toLowerCase() ===
          stateName.toLowerCase()
    );

    if (!state) {
      const stateResponse = await api.post("masters/states/", {
        country: country.id,
        state_name: stateName,
        state_code: createCode(stateName),
        status: true,
      });

      state = stateResponse.data.data;

      // Keep frontend state list updated
      setStates((prev) => [...prev, state]);
    }

    // -------------------------
    // FIND OR CREATE CITY
    // -------------------------
    let city = cities.find(
      (item) =>
        Number(item.state) === Number(state.id) &&
        item.city_name?.trim().toLowerCase() ===
          cityName.toLowerCase()
    );

    if (!city) {
      const cityResponse = await api.post("masters/city/add/", {
        state: state.id,
        city_name: cityName,
        city_code: createCode(cityName),
        status: true,
      });

      city = cityResponse.data.data;

      // Keep frontend city list updated
      setCities((prev) => [...prev, city]);
    }

    return {
      country: country.id,
      state: state.id,
      city: city.id,
    };
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const locationIds = await resolveLocationIds();
      const payload = {
        ...newLead,
        ...locationIds,
        status: newLead.status === true || newLead.status === "true",
      };
      if (isEditing) {
        await api.put(
          `leads/update/${editingId}/`,
          payload
        );
        alert("Lead Updated Successfully");
      } else {
        await api.post(
          "leads/add/",
          payload

        );
        alert("Lead Added Successfully");
      }
      fetchLeads();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      console.log(error.response?.data);
      alert("Unable to save lead.");
    }
  };

  const handleDeleteLead = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this Lead?"
    );
    if (!confirmDelete) return;
    try {
      await api.delete(
        `leads/delete/${id}/`
      );
      alert("Lead Deleted Successfully");
      fetchLeads();
    } catch (error) {
      console.error(error);
      alert("Unable to delete lead.");
    }
  };

  const handleEditLead = (lead) => {
    setNewLead({
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      status: lead.status,
      country: lead.country,
      state: lead.state,
      city: lead.city,

    });
    setCustomLocation({
      country: countries.find((item) => Number(item.id) === Number(lead.country))?.country_name || "",
      state: states.find((item) => Number(item.id) === Number(lead.state))?.state_name || "",
      city: cities.find((item) => Number(item.id) === Number(lead.city))?.city_name || "",
    });
    setEditingId(lead.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleUpdateLeadStatus = async (
    id,
    status
  ) => {

    const lead = leads.find(
      (item) => item.id === id
    );
    if (!lead) return;
    try {
      await api.put(
        `leads/update/${id}/`,
        {
          ...lead,
          status,
        }
      );
      fetchLeads();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const fullName =
      `${lead.first_name} ${lead.last_name}`;

    const matchesSearch =
      fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      lead.company
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      lead.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      String(lead.status) ===
        String(statusFilter);
    return (
      matchesSearch && matchesStatus
    );
  });


const computedStats = [

  {
    title: "Total Leads",
    value: leads.length,
    icon: <UserPlus size={24} />,
    color: "#1e293b",
  },

  {
    title: "Active Leads",
    value: leads.filter(l => l.status).length,
    icon: <Users size={24} />,
    color: "#16a34a",
  },

  {
    title: "Inactive Leads",
    value: leads.filter(l => !l.status).length,
    icon: <Briefcase size={24} />,
    color: "#dc2626",
  },

  {
    title: "Companies",
    value: new Set(leads.map(l => l.company)).size,
    icon: <IndianRupee size={24} />,
    color: "#2563eb",
  },

];

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
              onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
              }}
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
                    <td className="lead-name-cell">
                      {lead.first_name} {lead.last_name}
                    </td>
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
                    {lead.status ? (
                      <span className="status-active">
                        Active
                      </span>
                    ) : (
                      <span className="status-inactive">
                        Inactive
                      </span>
                    )}
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditLead(lead)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteLead(lead.id)}
                      >
                        Delete
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
              <h3>
                {isEditing ? "Edit Lead" : "Add New Lead"}
              </h3>
              <button className="leads-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddLead} className="leads-modal-form">
              <div className="leads-input-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={newLead.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="leads-input-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={newLead.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="leads-input-group">
                <label>Company *</label>
                <input
                  type="text"
                  name="company"
                  value={newLead.company}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="leads-input-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={newLead.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="leads-input-group">
                <label>Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={newLead.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="leads-input-group">
                <label>Lead Source</label>
                <input
                  type="text"
                  name="source"
                  value={newLead.source}
                  onChange={handleChange}
                  placeholder="Website, Referral, LinkedIn..."
                />
              </div>
              <div className="leads-input-group">
                <label>Country</label>
                <input
                  type="text"
                  value={customLocation.country}
                  onChange={(event) => setCustomLocation({ ...customLocation, country: event.target.value })}
                  placeholder="Type country"
                  required
                />
              </div>

              <div className="leads-input-group">
                <label>State</label>
                <input
                  type="text"
                  value={customLocation.state}
                  onChange={(event) => setCustomLocation({ ...customLocation, state: event.target.value })}
                  placeholder="Type state"
                  required
                />
              </div>

              <div className="leads-input-group">
                <label>City</label>
                <input
                  type="text"
                  value={customLocation.city}
                  onChange={(event) => setCustomLocation({ ...customLocation, city: event.target.value })}
                  placeholder="Type city"
                  required
                />
              </div>

              <div className="leads-input-group">
                <label>Status</label>

                <select
                  name="status"
                  value={newLead.status}
                  onChange={handleChange}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>

              <div className="leads-modal-actions">

                <button
                  type="button"
                  className="leads-btn-cancel"
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="leads-btn-submit"
                >
                  {isEditing ? "Update Lead" : "Add Lead"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Leads
