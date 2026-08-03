import React, { useState } from 'react';
import './Tasks.css';

const Tasks = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="tasks-page">

      {/* Top Bar */}
      <div className="tasks-topbar">
        <h2> Tasks </h2>
        <div className="topbar-row">
          <input type="text" placeholder="Search records.." className="top-search" />
          <button className="create-btn" onClick={() => setShowModal(true)}> + Create Task </button>
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <form action="">
          <h3> Create Task</h3>
          <label>Subject:</label>
          <input type="text" placeholder="Enter Task Subject" />

          <label>Due Date:</label>
          <input type="date" />

          <label>Status:</label>
          <input type="text" />

          <label>Priority:</label>
          <input type="text" />

          <label>Assigned To:</label>
          <input type="text" />
        </form>
      )}

      {/* Toolbar */}
      <div className="tasks-toolbar">
        <div className="toolbar-top">
          <span className="all-records-label">All Tasks</span>
        </div>
        <div className="toolbar-icons">
          <button> Filter</button>
          <h4 className="sort-toolbar"> Sort</h4>
        </div>
      </div>

      <div className="tasks-body">

        {/* Left Filter Panel */}
        <div className="filter-panel">
          <h4> Filter Tasks By</h4>
          <input type="text" placeholder="Search" className="filter-search" />

          <p className="filter-heading">System Defined Filter</p>
          <ul>
            <li><input type="checkbox" /> Cadences</li>
            <li><input type="checkbox" /> Locked</li>
            <li><input type="checkbox" /> Record Action</li>
            <li><input type="checkbox" /> Related Record Action</li>
            <li><input type="checkbox" /> Touched Records</li>
            <li><input type="checkbox" /> Untouched Records</li>
          </ul>
        </div>

        {/* Table Section */}
        <div className="table-section">
          <table className="tasks-table">
            <thead>
              <tr>
                <th><input type="checkbox" /> Subject</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Completed CRM Getting Started steps</td>
                <td>13/05/2026</td>
                <td>Completed</td>
                <td>Highest</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default Tasks;