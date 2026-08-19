import React, { useEffect, useState } from "react";
import "./Role.css";

const API_URL = "http://127.0.0.1:8000/api/role/";
const ADD_URL = "http://127.0.0.1:8000/api/role/add/";

const Role = () => {
    
  const [roles, setRoles] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newRole, setNewRole] = useState({
    role_name: "",
    role_code: "",
    status: true,
});

useEffect(() => {
  fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load roles");
      }

      return response.json();
    })
    .then((data) => {
      console.log("Roles from backend:", data);
      setRoles(data);
    })
    .catch((error) => {
      console.error("Error loading roles:", error);
    });
}, []);

const handleAddRole = async (e) => {
  e.preventDefault();

  if (
    !newRole.role_name.trim() ||
    !newRole.role_code.trim()
  ) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const response = await fetch(ADD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role_name: newRole.role_name.trim(),
        role_code: newRole.role_code.trim().toUpperCase(),
        status: newRole.status,
      }),
    });

    const result = await response.json();

    console.log("Status:", response.status);
    console.log("Backend response:", result);

    if (!response.ok) {
      alert(JSON.stringify(result));
      return;
    }

    setRoles((prev) => [...prev, result.data]);

    setNewRole({
      role_name: "",
      role_code: "",
      status: true,
    });

    setIsModalOpen(false);

    alert("Role added successfully");

  } catch (error) {
    console.error("Error adding role:", error);
    alert("Cannot connect to backend");
  }
};


return (
  <div>
    {/* Page Header */}
    <div className="contacts-page-header">
      <div>
        <h2>Role</h2>
        <p>Manage and organize roles</p>
      </div>

      <button
        className="contacts-add-btn"
        onClick={() => setIsModalOpen(true)}
      >
        Add Role
      </button>
    </div>

    {/* Role List */}
    <div className="contacts-card">
      <div className="contacts-card-header">
        <h3>Role List</h3>
      </div>

      <table className="contacts-table">
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Role Code</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {roles.length > 0 ? (
            roles.map((role) => (
              <tr key={role.id}>
                <td>{role.role_name}</td>
                <td>{role.role_code}</td>
                <td>
                  {role.status ? "Active" : "Inactive"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="contacts-empty-state">
                No roles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Add Role Modal */}
    {isModalOpen && (
      <div className="contacts-modal-overlay">
        <div className="contacts-modal-card">

          {/* Modal Header */}
          <div className="contacts-modal-header">
            <h3>Add New Role</h3>

            <button
              className="contacts-close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleAddRole}
            className="contacts-modal-form"
          >

            <div className="contacts-input-group">

              <label>Role Name</label>

              <input
                type="text"
                placeholder="Enter role name"
                value={newRole.role_name}
                onChange={(e) =>
                  setNewRole({
                    ...newRole,
                    role_name: e.target.value,
                  })
                }
                required
              />

            </div>


            <div className="contacts-input-group">

              <label>Role Code</label>

              <input
                type="text"
                placeholder="Enter role code"
                value={newRole.role_code}
                onChange={(e) =>
                  setNewRole({
                    ...newRole,
                    role_code: e.target.value,
                  })
                }
                required
              />

            </div>


            <div className="contacts-input-group">

              <label>Status</label>

              <select
                value={newRole.status.toString()}
                onChange={(e) =>
                  setNewRole({
                    ...newRole,
                    status: e.target.value === "true",
                  })
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

            </div>


            <div className="contacts-modal-actions">

              <button
                type="button"
                className="contacts-btn-cancel"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="contacts-btn-submit"
              >
                Save
              </button>

            </div>

          </form>
        </div>
      </div>
    )}
  </div>
);
}

export default Role;