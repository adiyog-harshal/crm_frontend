import React, { useState } from 'react';
import './Accounts.css';



const Accounts = () => {
  const [showModal , setShowModal] = useState(false)
  
  
  return(
    <div classsName = "account-page">

      {/* Top Bar */}

      <div className = "account-topbar"> 
        <h2> Accounts </h2>
        <div className = "topbar-row">
          <input type = "text" placeholder = "Search reords.." className = "top-search" />
          <button className = "create-btn" onClick={() =>setShowModal(true)}> + Create Account </button>
        </div>
      </div>

      {/* Create Account Modal */}
      {showModal &&(
        <form action="">
          <h3> Create Account</h3>
          <label> Comany Name:</label>
          <input type = "text" placeholder = "Enter Company Name" />

          <label>Conatct:</label>
          <input type = "text" type="number" />

          <label>Email:</label> 
          <input type ="text" type = "email" />

          <label> Sales</label>
          <input type="text" />

          <label> Conatcts</label>
          <input type="text" />

          <label> Deal</label>
          <input type="text" />
        </form>
      )}
      

      {/* Toolbar */}

     <div className = "account-toolbar">
      <div className="toolbar-top">
          <span className="all-records-label">All Accounts</span>
        </div>
      <div className = "toolbar-icons">
        
        <button> Filter</button>
        <h4 className='sort-toolbar'> Sort</h4>
       
      </div>
     </div>

     <div className = "account-body">

      {/* Left Filter Panel */}
      <div>
      <div className = "filter-panel">
        <h4> Filter Account By</h4>
        <input type = "text" placeholder = "Search" className="filter-search" />

        <p className = "filter-heading" >System Defined Filter </p>
        <ul>
          <li><input type = "checkbox" /> Cadences </li>
          <li><input type = "checkbox" /> Locked </li>
          <li><input type = "checkbox" /> Record Action </li>
          <li><input type = "checkbox" /> Realted Record Action  </li>
          <li><input type = "checkbox" /> Touched Records </li>
          <li><input type = "checkbox" /> Untouched Records </li>
        </ul>
      </div>
</div>

      {/* Table Section */}

      <div className = "table-section">
        <table className = "account-table">
          <thead>
            <tr>
              <th> <input type = "checkbox" />Account Name
              <td> King(Sample)</td> 
              </th>
              <th>Phone
              <td>555-555-5555</td>
              </th>
              <th>Website 
                <td>any website</td>
              </th>

              <th>Account Owner
                <td>Amruta Kulkarni </td>
              </th>
            </tr>
          </thead>

          <tbody>

            
            <tr colSpan = "5" className="empty-row">
              {/* <td>No records found .  Click " + Account Create"</td> */}
            </tr>
          

          </tbody>

        </table>
      </div>

     </div>

    </div>
  )
}
   

export default Accounts;