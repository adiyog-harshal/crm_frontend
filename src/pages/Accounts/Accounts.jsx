import React, { useEffect, useState } from "react";
import "./Accounts.css";
import api from "../../services/api";

const Accounts = () => {

  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    account_name: "",
    account_number: "",
    account_type: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    status: true,
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {

    const filtered = accounts.filter((item) =>
      item.account_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredAccounts(filtered);
  }, [accounts, search]);

  const fetchAccounts = async () => {

    try {
      setLoading(true);
      const response = await api.get("accounts/");
      setAccounts(response.data);
      setFilteredAccounts(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch accounts.");
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
      account_name: "",
      account_number: "",
      account_type: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      status: true,
    });
    setEditingId(null);
    setIsEditing(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(
          `accounts/update/${editingId}/`,
          formData
        );
        alert("Account Updated Successfully");
      } else {
        await api.post(
          "accounts/add/",
          formData
        );
        alert("Account Created Successfully");
      }
      resetForm();
      setShowModal(false);
      fetchAccounts();
    } catch (error) {
      console.error(error);
      alert("Unable to save account");
    }
  };
  const handleEdit = (account) => {
    setFormData(account);
    setEditingId(account.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this account?"
    );
    if (!confirmDelete) return;
    try {
      await api.delete(
        `accounts/delete/${id}/`
      );
      alert("Account Deleted Successfully");
      fetchAccounts();
    } catch (error) {
      console.error(error);
      alert("Unable to delete account");
    }
  };
  return (
    <div className="account-page">
      {/* Top Bar */}
      <div className="account-topbar">
        <h2>Accounts</h2>
        <div className="topbar-row">

          <input
            type="text"
            placeholder="Search Accounts..."
            className="top-search"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
          <button
            className="create-btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Create Account
          </button>
        </div>
      </div>
      {showModal && (
  <div className="modal-overlay">
    <div className="modal">

      <h3>
        {isEditing ? "Edit Account" : "Create Account"}
      </h3>

      <form onSubmit={handleSubmit}>

        <div className="form-grid">

          <div className="form-group">
            <label>Account Name</label>
            <input
              type="text"
              name="account_name"
              value={formData.account_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Account Type</label>
            <input
              type="text"
              name="account_type"
              value={formData.account_type}
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
              placeholder="+91 9876543210"
              maxLength={14}
              required
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
            {isEditing ? "Update Account" : "Save"}
          </button>

        </div>

      </form>

    </div>
  </div>
)}

<div className="account-toolbar">
  <div className="toolbar-top">
    <span className="all-records-label">
      All Accounts
    </span>
  </div>
  <div className="toolbar-icons">
    <button>Filter</button>
    <button>Sort</button>
  </div>
</div>
<div className="table-section">
  <table className="account-table">
    <thead>
      <tr>
        <th>Account Name</th>
        <th>Account Number</th>
        <th>Account Type</th>
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
          <td colSpan="10" className="empty-row">
            Loading Accounts...
          </td>
        </tr>
      ) : filteredAccounts.length === 0 ? (
        <tr>
          <td colSpan="10" className="empty-row">
            No Accounts Found
          </td>
        </tr>
      ) : (
        filteredAccounts.map((account) => (
                    <tr key={account.id}>
            <td>{account.account_name}</td>
            <td>{account.account_number}</td>
            <td>{account.account_type}</td>
            <td>{account.email}</td>
            <td>{account.phone}</td>
            <td>{account.city}</td>
            <td>{account.state}</td>
            <td>{account.country}</td>
            <td>
              {account.status ? (

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
                onClick={() => handleEdit(account)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(account.id)}
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
export default Accounts;