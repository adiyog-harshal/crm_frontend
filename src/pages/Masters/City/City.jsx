import React, { useEffect, useState } from "react";
import "./City.css";
import { Pencil, Trash2 } from "lucide-react";
import api from "../../../services/api";



const City = () => {

    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    



const [newCity, setNewCity] = useState({
  state: "",
  city_name: "",
  city_code: "",
  status: true,
});

const fetchCities = async () => {
  try {
    const response = await api.get("city/");

    console.log("Cities response:", response.data);

    setCities(response.data);
  } catch (error) {
    console.error("Error loading cities:", error);
  }
};

useEffect(() => {
  fetchCities();
}, []);

const handleAddCity = async (e) => {
  e.preventDefault();

  if (
    !newCity.state ||
    !newCity.city_name.trim() ||
    !newCity.city_code.trim()
  ) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const response = await api.post("city/add/", {
      state: Number(newCity.state),
      city_name: newCity.city_name.trim(),
      city_code: newCity.city_code.trim().toUpperCase(),
      status: newCity.status,
    });

    console.log("Backend response:", response.data);

    // Reload cities from database
    await fetchCities();

    setNewCity({
      state: "",
      city_name: "",
      city_code: "",
      status: true,
    });

    setIsModalOpen(false);

    alert("City added successfully");

  } catch (error) {
    console.error("Error adding city:", error);
    console.error("Backend error:", error.response?.data);

    alert(
      error.response?.data
        ? JSON.stringify(error.response.data)
        : "Cannot connect to backend"
    );
  }
};





const handleEdit = (city) => {
  setEditingId(city.id);

  setNewCity({
    city_name: city.city_name || "",
    city_code: city.city_code || "",
    state: city.state || "",
    status: city.status,
  });

  setIsEditing(true);
  setIsModalOpen(true);
};
// delete
const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this city?"
  );

  if (!confirmed) return;

  try {
    await api.delete(`city/${id}/delete/`);

    alert("City deleted successfully!");

    await fetchCities();

  } catch (error) {
    console.error("DELETE ERROR:", error);
    alert("Failed to delete city.");
  }
};

useEffect(() => {
  fetch("https://crm-backend-39kt.onrender.com/api/states/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load states");
      }
      return response.json();
    })
    .then((data) => {
      setStates(data);
    })
    .catch((error) => {
      console.error("Error loading states:", error);
    });
}, []);



return (
    <div className="contacts-container">
      <div className="contacts-page-header">
        <div>
          <h2>City</h2>
          <p>Manage and organize cities</p>
        </div>

        <button
        className="contacts-add-btn"
        onClick={() => setIsModalOpen(true)}
        >
            Add City
       </button>
      </div>



      <div className="contacts-card">
        <h3>City List</h3>

        <div className="contacts-page-header">

        </div>

        <table className="contacts-table">
          <thead>
            <tr>
                <th>State</th>
                <th>City Name</th>
                <th>City Code</th>
                <th>Status</th>
                <th className="actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            {cities.map((city) => (
                <tr key={city.id}>
                <td>
                  {states.find((state) => state.id === city.state)?.state_name || "Unknown"}

                </td>
                <td>{city.city_name}</td>
                <td>{city.city_code}</td>
                <td>{city.status ? "Active" : "Inactive"}</td>
                <td className="actions-column">
                  <div className="master-actions">

                    <button
                      type="button"
                      className="action-btn edit-btn"
                      title="Edit City"
                      onClick={() => handleEdit(city)}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      className="action-btn delete-btn"
                      title="Delete City"
                      onClick={() => handleDelete(city.id)}
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>
                </td>
                </tr>
            ))}
          </tbody>

            
          
        </table>

        {isModalOpen && (
  <div className="contacts-modal-overlay">
    <div className="contacts-modal-card">
      <div className="contacts-modal-header">
        <h3>{isEditing ? "Edit City" : "Add City"}</h3>

        <button
          className="contacts-close-btn"
          onClick={() => setIsModalOpen(false)}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleAddCity} className="contacts-modal-form">

        <div className="contacts-input-group">
            <label>State</label>

            <select
                value={newCity.state}
                onChange={(e) =>
                setNewCity({
                    ...newCity,
                    state: e.target.value,
                })
                }
            >
                <option value="">Select State</option>
                 {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.state_name}
              </option>
              ))}
            </select>
        </div>

        <div className="contacts-input-group">
        <label>City Name</label>

        <input
            type="text"
            placeholder="Enter city name"
            value={newCity.city_name}
            onChange={(e) =>
            setNewCity({
                ...newCity,
                city_name: e.target.value,
            })
            }
            required
        />
        </div>

        <div className="contacts-input-group">
        <label>City Code</label>

        <input
            type="text"
            value={newCity.city_code}
            onChange={(e) =>
            setNewCity({
                ...newCity,
                city_code: e.target.value,
            })
            }
        />
        </div>

        <div className="contacts-input-group">
          <label>Status</label>

      
        <select
        value={newCity.status.toString()}
        onChange={(e) =>
            setNewCity({
            ...newCity,
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
    </div>
  );
};


export default City;