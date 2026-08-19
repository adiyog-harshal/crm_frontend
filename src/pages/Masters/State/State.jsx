
import React, { useEffect, useState } from "react";
import "./State.css";

const STATE_API = "http://127.0.0.1:8000/api/states/";
const STATE_ADD_API = "http://127.0.0.1:8000/api/states/add/";
const COUNTRY_API = "http://127.0.0.1:8000/api/countries/";

const State = () => {
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newState, setNewState] = useState({
    country: "",
    state_name: "",
    state_code: "",
    status: true,
  });

  // ================================
  // LOAD STATES
  // ================================
  const loadStates = async () => {
    try {
      const response = await fetch(STATE_API);

      const text = await response.text();

      console.log("STATE GET STATUS:", response.status);
      console.log("STATE GET RESPONSE:", text);

      if (!response.ok) {
        console.error("Unable to load states");
        return;
      }

      const data = JSON.parse(text);

      setStates(data);
    } catch (error) {
      console.error("Error loading states:", error);
    }
  };

  // ================================
  // LOAD COUNTRIES
  // ================================
  const loadCountries = async () => {
    try {
      const response = await fetch(COUNTRY_API);

      const text = await response.text();

      console.log("COUNTRY GET STATUS:", response.status);
      console.log("COUNTRY GET RESPONSE:", text);

      if (!response.ok) {
        console.error("Unable to load countries");
        return;
      }

      const data = JSON.parse(text);

      setCountries(data);
    } catch (error) {
      console.error("Error loading countries:", error);
    }
  };

  // ================================
  // LOAD DATA WHEN PAGE OPENS
  // ================================
  useEffect(() => {
    loadStates();
    loadCountries();
  }, []);

  // ================================
  // ADD STATE
  // ================================
  const handleAddState = async (e) => {
    e.preventDefault();

    // Validation
    if (!newState.country) {
      alert("Please select Country");
      return;
    }

    if (!newState.state_name.trim()) {
      alert("Please enter State Name");
      return;
    }

    if (!newState.state_code.trim()) {
      alert("Please enter State Code");
      return;
    }

    try {
      const requestData = {
        country: Number(newState.country),
        state_name: newState.state_name.trim(),
        state_code: newState.state_code.trim().toUpperCase(),
        status: newState.status,
      };

      console.log("STATE POST DATA:", requestData);

      const response = await fetch(STATE_ADD_API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(requestData),
      });

      const text = await response.text();

      console.log("STATE POST STATUS:", response.status);
      console.log("STATE POST RESPONSE:", text);

      // --------------------------------
      // BACKEND ERROR
      // --------------------------------
      if (!response.ok) {
        let errorData;

        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = text;
        }

        console.error("STATE SAVE ERROR:", errorData);

        alert(
          
          "State was not saved.\n\n" +
            JSON.stringify(errorData)
        );

        return;
      }


      // --------------------------------
      // SUCCESS RESPONSE
      // --------------------------------
      let result;

      try {
        result = JSON.parse(text);
      } catch {
        console.error("Backend returned invalid JSON:", text);

        alert("Backend returned invalid response.");

        return;
      }

      console.log("STATE SUCCESS:", result);

      // Backend response:
      // {
      //   message: "...",
      //   data: {...}
      // }

      if (result.data) {
        setStates((previousStates) => [
          ...previousStates,
          result.data,
        ]);
      } else {
        // If backend directly returns state object
        setStates((previousStates) => [
          ...previousStates,
          result,
        ]);
      }

      // Clear form
      setNewState({
        country: "",
        state_name: "",
        state_code: "",
        status: true,
      });

      // Close modal
      setIsModalOpen(false);

      alert("State Added Successfully");
    } catch (error) {
      console.error("STATE CONNECTION ERROR:", error);

      alert(
        "Frontend cannot connect to backend.\n\n" +
          error.message
      );
    }
  };

  // ================================
  // GET COUNTRY NAME
  // ================================
  const getCountryName = (countryId) => {
    const country = countries.find(
      (item) => Number(item.id) === Number(countryId)
    );

    return country
      ? country.country_name
      : countryId;
  };

  return (
    <div className="contacts-page">

      {/* ================================
          PAGE HEADER
      ================================= */}

      <div className="contacts-page-header">

        <div>
          <h2>State</h2>

          <p>
            Manage and organize states
          </p>
        </div>

        <button
          type="button"
          className="contacts-add-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Add State
        </button>

      </div>


      {/* ================================
          STATE LIST
      ================================= */}

      <div className="contacts-card">

        <h3>State List</h3>

        <table className="contacts-table">

          <thead>

            <tr>
              <th>Country</th>
              <th>State Name</th>
              <th>State Code</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {states.length === 0 ? (

              <tr>
                <td colSpan="4">
                  No states found
                </td>
              </tr>

            ) : (

              states.map((state) => (

                <tr key={state.id}>

                  <td>
                    {getCountryName(state.country)}
                  </td>

                  <td>
                    {state.state_name}
                  </td>

                  <td>
                    {state.state_code}
                  </td>

                  <td>
                    {state.status
                      ? "Active"
                      : "Inactive"}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      {/* ================================
          ADD STATE MODAL
      ================================= */}

      {isModalOpen && (

        <div className="contacts-modal-overlay">

          <div className="contacts-modal">

            {/* MODAL HEADER */}

            <div className="contacts-modal-header">

              <h3>
                Add State
              </h3>

              <button
                type="button"
                className="contacts-close-btn"
                onClick={() =>
                  setIsModalOpen(false)
                }
              >
                ✕
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleAddState}
              className="contacts-modal-form"
            >

              {/* COUNTRY */}

              <div className="contacts-input-group">

                <label>
                  Country
                </label>

                <select
                  value={newState.country}
                  onChange={(e) =>
                    setNewState({
                      ...newState,
                      country: e.target.value,
                    })
                  }
                >

                  <option value="">
                    Select Country
                  </option>

                  {countries.map((country) => (

                    <option
                      key={country.id}
                      value={country.id}
                    >
                      {country.country_name}
                    </option>

                  ))}

                </select>

              </div>


              {/* STATE NAME */}

              <div className="contacts-input-group">

                <label>
                  State Name
                </label>

                <input
                  type="text"
                  value={newState.state_name}
                  onChange={(e) =>
                    setNewState({
                      ...newState,
                      state_name: e.target.value,
                    })
                  }
                  placeholder="Enter State Name"
                />

              </div>


              {/* STATE CODE */}

              <div className="contacts-input-group">

                <label>
                  State Code
                </label>

                <input
                  type="text"
                  value={newState.state_code}
                  onChange={(e) =>
                    setNewState({
                      ...newState,
                      state_code: e.target.value,
                    })
                  }
                  placeholder="Enter State Code"
                />

              </div>


              {/* STATUS */}

              <div className="contacts-input-group">

                <label>
                  Status
                </label>

                <select
                  value={String(newState.status)}
                  onChange={(e) =>
                    setNewState({
                      ...newState,
                      status:
                        e.target.value === "true",
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


              {/* BUTTONS */}

              <div className="contacts-modal-actions">

                <button
                  type="button"
                  className="contacts-btn-cancel"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
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

export default State;

