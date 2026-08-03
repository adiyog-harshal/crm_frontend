import React, { useState } from 'react';
import './Meetings.css';



const Meetings = () => {
  const [showModal , setShowModal] = useState(false)
  
  
  return(
    <div classsName = "meeting-page">

      {/* Top Bar */}

      <div className = "meeting-topbar"> 
        <h2> Meetings </h2>
        <div className = "topbar-row">
          <input type = "text" placeholder = "Search records.." className = "top-search" />
          <button className = "create-btn" onClick={() =>setShowModal(true)}> + Create Meeting </button>
        </div>
      </div>

      
      

      {/* Toolbar */}

     <div className = "meeting-toolbar">
      <div className="toolbar-top">
          <span className="all-records-label">All Meetings</span>
        </div>
      <div className = "toolbar-icons">
        
        <button> Filter</button>
        <h4 className='sort-toolbar'> Sort</h4>
       
      </div>
     </div>

     <div className = "meeting-body">

      {/* Left Filter Panel */}
      <div>
      <div className = "filter-panel">
        <h4> Filter Meetings By</h4>
        <input type = "text" placeholder = "Search" className="filter-search" />

        <p className = "filter-heading" >System Defined Filter </p>
        <ul>
          <li><input type = "checkbox" /> Record Action </li>
          <li><input type = "checkbox" /> Related Records Action </li>
          <li><input type = "checkbox" /> Touched Records </li>
          <li><input type = "checkbox" /> Untouched Action  </li>
          <li><input type = "checkbox" /> Touched Records </li>
        </ul>
      </div>
</div>

      {/* Table Section */}

      <div className = "table-section">
        <table className = "meeting-table">
          <thead>
            <tr>
              <th> <input type = "checkbox" />Title </th>
              <th>From</th>
              <th>To</th>
              <th>Related To</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td><input type="checkbox" /> Demo</td>
              <td>15/08/2026 11.15 AM</td>
              <td>15/08/2026 12.15 PM</td>
              <td>Printing Dimension</td>
            </tr>

            
             

          </tbody>

        </table>
      </div>

     </div>

    </div>
  )
}
   

export default Meetings;