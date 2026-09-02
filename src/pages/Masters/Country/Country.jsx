import React, { useEffect, useState } from "react";
import "./Country.css";
import { Pencil, Trash2 } from "lucide-react";
import api from "../../../services/api";

const API_URL = "https://crm-backend-39kt.onrender.com/api/countries/";
const ADD_URL = "https://crm-backend-39kt.onrender.com/api/countries/add/";

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);


  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [newCountry, setNewCountry] = useState({
    country_name: "",
    country_code: "",
    status: true,
  });

  const handleEdit = (country) => {
  setEditingId(country.id);

  setNewCountry({
    country_name: country.country_name || "",
    status: country.status,
  });

  setIsEditing(true);
  setIsModalOpen(true);
};


  // GET countries from backend
//   const fetchCountries = async () => {
//   try {
//     setLoading(true);

//     const response = await fetch(API_URL);
//     const data = await response.json();

//     console.log("Countries:", data);

//     if (response.ok) {
//       setCountries(data);
//     } else {
//       console.error("GET error:", data);
//     }
//   } catch (error) {
//     console.error("GET connection error:", error);
//   } finally {
//     setLoading(false);
//   }
// };

  const fetchCountries = async () => {
    try {
      const response = await api.get("countries/");
      console.log("COUNTRIES RESPONSE:", response.data);
      setCountries(response.data);
    } catch (error) {
      console.error("FETCH COUNTRIES ERROR:", error);
    }
  };




  // delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this country?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`countries/${id}/delete/`);

      alert("Country deleted successfully!");

      await fetchCountries();

    } catch (error) {
      console.error("DELETE ERROR:", error);

      alert("Failed to delete country.");
    }
  };
    

  useEffect(() => {
    fetchCountries();
  }, []);

  // ADD country
  const handleAddCountry = async (e) => {
    e.preventDefault();

    if (!newCountry.country_name.trim()) {
      alert("Please enter Country Name");
      return;
    }

    if (!newCountry.country_code.trim()) {
      alert("Please enter Country Code");
      return;
    }

    try {
      console.log("Sending:", newCountry);

      const response = await fetch(ADD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country_name: newCountry.country_name.trim(),
          country_code: newCountry.country_code.trim().toUpperCase(),
          status: newCountry.status,
        }),
      });

      const result = await response.json();

      console.log("Backend response:", result);

      if (!response.ok) {
        console.error("Save error:", result);
        alert("Country was not saved");
        return;
      }

      const handleEdit = (country) => {
        setEditingId(country.id);

        setFormData({
          country_name: country.country_name,
        });

        setIsEditing(true);
        setShowModal(true);
      };
      // Backend returns { message, data }
      setCountries((prev) => [...prev, result.data]);

      setNewCountry({
        country_name: "",
        country_code: "",
        status: true,
      });

      setIsModalOpen(false);

      alert("Country Added Successfully");

    } catch (error) {
      console.error("Connection error:", error);
      alert("Backend connection failed");
    }
  };

  return (
    <div className="contacts-page">

      {/* Header */}
      <div className="contacts-page-header">

        <div>
          <h2>Country</h2>
          <p>Manage and organize countries</p>
        </div>

        <button
          className="contacts-add-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Add Country
        </button>

      </div>


      {/* Country List */}
      <div className="contacts-card">

        <h3>Country List</h3>

        <table className="contacts-table">

          <thead>
            <tr>
              <th>Country Name</th>
              <th>Country Code</th>
              <th>Status</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "30px" }}>
                    Loading...
                  </td>
                </tr>
              ) : countries.length > 0 ? (

              countries.map((country) => (
                <tr key={country.id}>

                  <td>{country.country_name}</td>

                  <td>{country.country_code}</td>

                  <td>
                    {country.status ? "Active" : "Inactive"}
                  </td>

                  <td className="actions-column">
                  <div className="master-actions">

                    <button
                      type="button"
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(country)}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      className="action-btn delete-btn"
                      title="Delete Country"
                      onClick={() => handleDelete(country.id)}
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>
                </td>

                </tr>
              ))

            ) : (

              <tr>
                <td colSpan="3">
                  No countries found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* Add Country Modal */}
      {isModalOpen && (

        <div className="contacts-modal-overlay">

          <div className="contacts-modal">

            <div className="contacts-modal-header">

              <h3>Add Country</h3>

              <button
                type="button"
                className="contacts-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>

            </div>


            <form
              onSubmit={handleAddCountry}
              className="contacts-modal-form"
            >

              {/* Country Name */}
              <div className="contacts-input-group">

                <label>Country Name</label>

                <input
                  type="text"
                  value={newCountry.country_name}
                  onChange={(e) =>
                    setNewCountry({
                      ...newCountry,
                      country_name: e.target.value,
                    })
                  }
                />

              </div>


              {/* Country Code */}
              <div className="contacts-input-group">

                <label>Country Code</label>

                <input
                  type="text"
                  value={newCountry.country_code}
                  onChange={(e) =>
                    setNewCountry({
                      ...newCountry,
                      country_code: e.target.value,
                    })
                  }
                />

              </div>


              {/* Status */}
              <div className="contacts-input-group">

                <label>Status</label>

                <select
                  value={newCountry.status.toString()}
                  onChange={(e) =>
                    setNewCountry({
                      ...newCountry,
                      status: e.target.value === "true",
                    })
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

          

              {/* Buttons */}
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
};

export default Country;