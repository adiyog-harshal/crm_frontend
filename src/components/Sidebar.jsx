
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings2,
  HelpCircle,
  BarChart3,
  Target,
  ChartNoAxesColumn,
  Building2,
  CircleCheckBig,
} from "lucide-react";

import "./Sidebar.css";

const Sidebar = () => {

  const [openMasters, setOpenMasters] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-dot"></span>
        <h2>Adiyog CRM</h2>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/home" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/leads" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
              <Users size={20} />
              <span>Leads</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/contacts" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
              <Target size={20} />
              <span>Contacts</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/deals" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
              <CreditCard size={20} />
              <span>Deals</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/companies" className={({ isActive }) =>`sidebar-item ${isActive ? "active" : ""}`}>
              <Building2 size={20} />
              <span>Companies</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
              <CircleCheckBig size={20} />
              <span>Tasks</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/meetings" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
              <Users size={20} />
              <span>Meetings</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
              <BarChart3 size={20} />
              <span>Analytics</span>
            </NavLink>
          </li>



          <li className="masters-menu-item">
            <div className="sidebar-menu-item">
              <button
                  className="sidebar-menu-button"
                  onClick={() => setOpenMasters(!openMasters)}
                >
                  <div className="sidebar-menu-left">
                    <Building2 size={20} />
                    <span>Masters</span>
                  </div>

                  <span className="masters-arrow">
                    {openMasters ? "▼" : "▶"}
                  </span>
                </button>

              {openMasters && (
                <div className="masters-submenu">

                  <NavLink to="/masters/country">
                    Country
                  </NavLink>

                  <NavLink to="/masters/state">
                    State
                  </NavLink>

                  <NavLink to="/masters/city">
                    City
                  </NavLink>

                  <NavLink to="/masters/role">
                    Role
                  </NavLink>

                </div>
              )}
            </div>

            

            
                

          </li>
          
          <li>
            <NavLink to="/reports" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
              <ChartNoAxesColumn size={20} />
              <span>Reports</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/help" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <HelpCircle size={20} />
          <span>Help & Support</span>
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar
