import React, { useEffect, useState } from "react";
import "./Companies.css";
import api from "../../services/api";

const Companies = () => {

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    company_name: "",
    company_code: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    gst_number: "",
    status: true,
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {

    const filtered = companies.filter((item) =>
      item.company_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [companies, search]);
  const fetchCompanies = async () => {

    try {
      setLoading(true);
      const response = await api.get( "http://127.0.0.1:8000/api/companies/");
      setCompanies(response.data);
      setFilteredCompanies(response.data);
    } catch (error) {
  console.error("FETCH COMPANIES ERROR:", error);
  console.error("ERROR RESPONSE:", error.response?.data);
  console.error("ERROR STATUS:", error.response?.status);

  alert(
    JSON.stringify(
      error.response?.data || error.message
    )
  );
} finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {

    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      company_name: "",
      company_code: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      gst_number: "",
      status: true,
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = {
            ...formData,
            website:
            formData.website &&
            !formData.website.startsWith("http")
            ? `https://${formData.website}`
            : formData.website,
        };
        if (isEditing) {
        await api.put(
          `companies/update/${editingId}/`,
          payload
        );
        alert("Company Updated Successfully");
      } else {
        await api.post(
          "http://127.0.0.1:8000/api/companies/add/",
          payload
        );
        alert("Company Created Successfully");
      }

      resetForm();
      setShowModal(false);
      fetchCompanies();
    } catch (error) {
        console.error("COMPANY SAVE ERROR:", error.response?.data);
        alert(JSON.stringify(error.response?.data));
}
  };
  const handleEdit = (company) => {

    setFormData(company);

    setEditingId(company.id);

    setIsEditing(true);

    setShowModal(true);

  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this company?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `companies/delete/${id}/`
      );

      alert("Company Deleted Successfully");

      fetchCompanies();

    } catch (error) {

      console.error(error);

      alert("Unable to delete company");

    }

  };

  return (

    <div className="company-page">

      {/* Top Bar */}

      <div className="company-topbar">

        <h2>Companies</h2>

        <div className="topbar-row">

          <input
            type="text"
            className="top-search"
            placeholder="Search Companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="create-btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Create Company
          </button>

        </div>

      </div>

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>
              {isEditing ? "Edit Company" : "Create Company"}
            </h3>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Company Code</label>
                  <input
                    type="text"
                    name="company_code"
                    value={formData.company_code}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={15}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>GST Number</label>
                  <input
                    type="text"
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="status-row">
                  <label>Status</label>

                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="modal-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  {isEditing ? "Update Company" : "Save"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}
            <div className="company-toolbar">

        <div className="toolbar-top">
          <span className="all-records-label">
            All Companies
          </span>
        </div>

        <div className="toolbar-icons">
          <button>Filter</button>
          <button>Sort</button>
        </div>

      </div>

      <div className="table-section">

        <table className="company-table">

          <thead>

            <tr>

              <th>Company Name</th>
              <th>Company Code</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th>Status</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td colSpan="9" className="empty-row">
                  Loading Companies...
                </td>

              </tr>

            ) : filteredCompanies.length === 0 ? (

              <tr>

                <td colSpan="9" className="empty-row">
                  No Companies Found
                </td>

              </tr>

            ) : (

              filteredCompanies.map((company) => (

                <tr key={company.id}>

                  <td>{company.company_name}</td>

                  <td>{company.company_code}</td>

                  <td>{company.email}</td>

                  <td>{company.phone}</td>

                  <td>{company.city}</td>

                  <td>{company.state}</td>

                  <td>{company.country}</td>

                  <td>

                    {company.status ? (

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
                      onClick={() => handleEdit(company)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(company.id)}
                    >
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

  );

};

export default Companies;