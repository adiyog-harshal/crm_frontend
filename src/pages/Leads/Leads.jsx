import React, { useState, useEffect } from "react";
import api from "../../services/api";
console.log("API BASE URL:", api.defaults.baseURL);
import "./Leads.css";

import {
  Users,
  UserPlus,
  Briefcase,
  IndianRupee,
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
  // ===============================
  // STATES
  // ===============================

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

  // ===============================
  // FETCH LEADS
  // ===============================

  const fetchLeads = async () => {
  try {
    setLoading(true);

    const response = await api.get(
      "http://127.0.0.1:8000/api/lead/"
    );

    console.log("LEADS:", response.data);

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.results || [];

    setLeads(data);
  } catch (error) {
    console.error("LEAD FETCH ERROR:", error);
    console.error("URL:", error.config?.url);
    console.error("BACKEND:", error.response?.data);
  } finally {
    setLoading(false);
  }
};

  // ===============================
  // FETCH COUNTRIES
  // ===============================

 const fetchCountries = async () => {
  try {
    const response = await api.get("http://127.0.0.1:8000/api/countries/");
    console.log("COUNTRIES:", response.data);

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.results || response.data.data || [];

    setCountries(data);
  } catch (error) {
    console.error("COUNTRY FETCH ERROR:", error.response?.data || error);
  }
};

const fetchStates = async () => {
  try {
    const response = await api.get("http://127.0.0.1:8000/api/states/");
    console.log("STATES:", response.data);

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.results || response.data.data || [];

    setStates(data);
  } catch (error) {
    console.error("STATE FETCH ERROR:", error.response?.data || error);
  }
};

const fetchCities = async () => {
  try {
    const response = await api.get("http://127.0.0.1:8000/api/city/");
    console.log("CITIES:", response.data);

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.results || response.data.data || [];

    setCities(data);
  } catch (error) {
    console.error("CITY FETCH ERROR:", error.response?.data || error);
  }
};

  // ===============================
  // INITIAL LOAD
  // ===============================

  useEffect(() => {
    fetchLeads();
    fetchCountries();
    fetchStates();
    fetchCities();
  }, []);

  // ===============================
  // HANDLE INPUT
  // ===============================

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "country") {
    setNewLead((prev) => ({
      ...prev,
      country: value,
      state: "",
      city: "",
    }));
    return;
  }

  if (name === "state") {
    setNewLead((prev) => ({
      ...prev,
      state: value,
      city: "",
    }));
    return;
  }

  setNewLead((prev) => ({
    ...prev,
    [name]: name === "status" ? value === "true" : value,
  }));
};

  // ===============================
  // RESET FORM
  // ===============================

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

    setEditingId(null);
    setIsEditing(false);
  };

  // ===============================
  // ADD / UPDATE LEAD
  // ===============================

  const handleAddLead = async (e) => {
    e.preventDefault();

    try {
      // Validate location
      if (
        !newLead.country ||
        !newLead.state ||
        !newLead.city
      ) {
        alert("Please select Country, State and City.");
        return;
      }

      const payload = {
        first_name: newLead.first_name,
        last_name: newLead.last_name,
        email: newLead.email,
        phone: newLead.phone,
        company: newLead.company,
        source: newLead.source,

        status:
          newLead.status === true ||
          newLead.status === "true",

        country: Number(newLead.country),
        state: Number(newLead.state),
        city: Number(newLead.city),
      };

      console.log("FINAL LEAD PAYLOAD:", payload);

      let response;

      // UPDATE
      if (isEditing) {
        response = await api.put(
          `http://127.0.0.1:8000/api/lead/update/${editingId}/`,
          payload
        );

        console.log(
          "LEAD UPDATED:",
          response.data
        );

        alert("Lead Updated Successfully");
      }

      // ADD
      else {
        response = await api.post(
         "http://127.0.0.1:8000/api/lead/add/",
          payload
        );

        console.log(
          "LEAD CREATED:",
          response.data
        );

        alert("Lead Added Successfully");
      }

      // Refresh table
      await fetchLeads();

      // Close modal
      resetForm();
      setIsModalOpen(false);

    } catch (error) {
  console.log("========== LEAD SAVE ERROR ==========");
  console.log("STATUS:", error.response?.status);
  console.log("URL:", error.config?.url);
  console.log("DATA:", error.response?.data);
  console.log("PAYLOAD ERROR:", error.response?.data);

  alert(
    JSON.stringify(
      error.response?.data || error.message,
      null,
      2
    )
  );
}
  };

  // ===============================
  // EDIT LEAD
  // ===============================

  const handleEditLead = (lead) => {
    setNewLead({
      first_name: lead.first_name || "",
      last_name: lead.last_name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      company: lead.company || "",
      source: lead.source || "",
      status: Boolean(lead.status),
      country: lead.country || "",
      state: lead.state || "",
      city: lead.city || "",
    });

    setEditingId(lead.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // ===============================
  // DELETE LEAD
  // ===============================

  const handleDeleteLead = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Lead?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(
         `http://127.0.0.1:8000/api/lead/delete/${id}/`
      );

      alert("Lead Deleted Successfully");

      await fetchLeads();

    } catch (error) {
      console.error(
        "DELETE LEAD ERROR:",
        error
      );

      console.error(
        "BACKEND:",
        error.response?.data
      );

      alert("Unable to delete lead.");
    }
  };

  // ===============================
  // UPDATE STATUS
  // ===============================

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
        `lead/update/${id}/`,
        {
          ...lead,
          status,
        }
      );

      await fetchLeads();

    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );
    }
  };

  // ===============================
  // FILTER
  // ===============================

  const filteredLeads = leads.filter(
    (lead) => {
      const fullName =
        `${lead.first_name || ""} ${
          lead.last_name || ""
        }`;

      const search =
        searchQuery.toLowerCase();

      const matchesSearch =
        fullName
          .toLowerCase()
          .includes(search) ||
        (lead.company || "")
          .toLowerCase()
          .includes(search) ||
        (lead.email || "")
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        String(lead.status) ===
          String(statusFilter);

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // ===============================
  // STATISTICS
  // ===============================

  const computedStats = [
    {
      title: "Total Leads",
      value: leads.length,
      icon: <UserPlus size={24} />,
      color: "#1e293b",
    },
    {
      title: "Active Leads",
      value: leads.filter(
        (lead) => lead.status
      ).length,
      icon: <Users size={24} />,
      color: "#16a34a",
    },
    {
      title: "Inactive Leads",
      value: leads.filter(
        (lead) => !lead.status
      ).length,
      icon: <Briefcase size={24} />,
      color: "#dc2626",
    },
    {
      title: "Companies",
      value: new Set(
        leads.map(
          (lead) => lead.company
        )
      ).size,
      icon: <IndianRupee size={24} />,
      color: "#2563eb",
    },
  ];

  // ===============================
  // JSX
  // ===============================

  return (
    <>
      <div className="leads-container">

        {/* HEADER */}
        <div className="leads-page-header">

          <div>
            <h2>Leads</h2>
            <p>
              Track and convert incoming
              customer leads
            </p>
          </div>

          <div className="header-actions">

            <SearchInput
              placeholder="Search name, company, email..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
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

        {/* STATS */}
        <div className="leads-stats-grid">

          {computedStats.map(
            (item, index) => (
              <div
                className="leads-stat-card"
                key={index}
              >
                <div
                  className="leads-stat-icon"
                  style={{
                    background:
                      item.color,
                  }}
                >
                  {item.icon}
                </div>

                <div className="leads-stat-content">
                  <p>{item.title}</p>
                  <h2>{item.value}</h2>
                </div>
              </div>
            )
          )}

        </div>

        {/* MANAGEMENT */}
        <div className="leads-card">

          <div className="leads-card-header">

            <div className="header-left-group">

              <h3>
                Leads Management
              </h3>

              <div className="filter-pills">

                {[
                  "All",
                  "New",
                  "Contacted",
                  "Qualified",
                  "Lost",
                ].map(
                  (status) => (
                    <button
                      key={status}
                      className={`filter-pill ${
                        statusFilter ===
                        status
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setStatusFilter(
                          status
                        )
                      }
                    >
                      {status}
                    </button>
                  )
                )}

              </div>

            </div>
          </div>

          {/* TABLE */}

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

              {loading ? (

                <tr>
                  <td
                    colSpan="6"
                    className="leads-empty-state"
                  >
                    Loading leads...
                  </td>
                </tr>

              ) : filteredLeads.length > 0 ? (

                filteredLeads.map(
                  (lead) => (

                    <tr key={lead.id}>

                      <td className="lead-name-cell">
                        {lead.first_name}{" "}
                        {lead.last_name}
                      </td>

                      <td>
                        {lead.company}
                      </td>

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
                          onClick={() =>
                            handleEditLead(
                              lead
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteLead(
                              lead.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>
                  <td
                    colSpan="6"
                    className="leads-empty-state"
                  >
                    No leads found.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* ===============================
          ADD / EDIT MODAL
      =============================== */}

      {isModalOpen && (

        <div className="leads-modal-overlay">

          <div className="leads-modal-card">

            <div className="leads-modal-header">

              <h3>
                {isEditing
                  ? "Edit Lead"
                  : "Add New Lead"}
              </h3>

              <button
                className="leads-close-btn"
                onClick={() => {
                  resetForm();
                  setIsModalOpen(false);
                }}
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleAddLead}
              className="leads-modal-form"
            >

              {/* FIRST NAME */}

              <div className="leads-input-group">
                <label>
                  First Name *
                </label>

                <input
                  type="text"
                  name="first_name"
                  value={
                    newLead.first_name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              {/* LAST NAME */}

              <div className="leads-input-group">
                <label>
                  Last Name *
                </label>

                <input
                  type="text"
                  name="last_name"
                  value={
                    newLead.last_name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              {/* COMPANY */}

              {/* COMPANY */}
              <div className="leads-input-group">
                <label>Company *</label>

                <input
                  type="text"
                  name="company"
                  value={newLead.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />
              </div>

        

              {/* EMAIL */}

              <div className="leads-input-group">
                <label>
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    newLead.email
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              {/* PHONE */}

              <div className="leads-input-group">
                <label>
                  Phone *
                </label>

                <input
                  type="text"
                  name="phone"
                  value={
                    newLead.phone
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              {/* SOURCE */}

              <div className="leads-input-group">
                <label>Lead Source *</label>

                <input
                  type="text"
                  name="source"
                  value={newLead.source}
                  onChange={handleChange}
                  placeholder="Website, Referral, LinkedIn..."
                  required
                />
              </div>

              {/* COUNTRY */}

              {/* ================= COUNTRY ================= */}
<div className="leads-input-group">
  <label>Country *</label>

  <select
    name="country"
    value={newLead.country}
    onChange={handleChange}
    required
  >
    <option value="">Select Country</option>

    {countries.map((country) => (
      <option key={country.id} value={country.id}>
        {country.country_name}
      </option>
    ))}
  </select>
</div>


{/* ================= STATE ================= */}
<div className="leads-input-group">
  <label>State *</label>

  <select
    name="state"
    value={newLead.state}
    onChange={handleChange}
    required
    disabled={!newLead.country}
  >
    <option value="">
      {newLead.country
        ? "Select State"
        : "Select Country First"}
    </option>

    {states
      .filter(
        (state) =>
          Number(state.country) ===
          Number(newLead.country) &&
          state.status
      )
      .map((state) => (
        <option key={state.id} value={state.id}>
          {state.state_name}
        </option>
      ))}
  </select>
</div>

{/* ================= CITY ================= */}
<div className="leads-input-group">
  <label>City *</label>

  <select
    name="city"
    value={newLead.city}
    onChange={handleChange}
    required
    disabled={!newLead.state}
  >
    <option value="">
      {newLead.state
        ? "Select City"
        : "Select State First"}
    </option>

    {cities
      .filter(
        (city) =>
          Number(city.state) ===
          Number(newLead.state) &&
          city.status
      )
      .map((city) => (
        <option key={city.id} value={city.id}>
          {city.city_name}
        </option>
      ))}
  </select>
</div>




              {/* STATUS */}

              <div className="leads-input-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={
                    String(
                      newLead.status
                    )
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="true">
                    Active
                  </option>

                  <option value="false">
                    Inactive
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

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
                  {isEditing
                    ? "Update Lead"
                    : "Add Lead"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}
    </>
  );
};

export default Leads;