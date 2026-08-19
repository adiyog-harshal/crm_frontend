import React, { useState, useRef, useEffect } from 'react'
import { Bell, Search, Settings, Globe, LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import profile from '../assets/profile.png'
import './Header.css'

const Header = () => {
  const loggedInUser = JSON.parse(
  localStorage.getItem("crm_user") || "null"
);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path || path === 'home') return 'Home';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="header">
      <div className="header-left">
        <span className="breadcrumb-parent">Dashboard</span>
        <span className="breadcrumb-separator">/</span>
        <h2 className="page-title">{getPageTitle()}</h2>
      </div>

      <div className="header-center">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search records, users or settings..."
          />
        </div>
      </div>
          
      <div className="header-right">
        <button className="icon-btn badge-btn" title="Notifications">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>

        <div className="profile-container" ref={menuRef}>
          <div className="profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <img
              src={profile}
              alt="profile"
              className="profile-avatar"
            />
            <div className="profile-info">
              <h4 className="profile-name">
                {loggedInUser?.username || "User"}
              </h4>
              <span className="profile-role">
                {loggedInUser?.is_staff ? "Administrator" : "User"}
              </span>
            </div>
          </div>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <img
                  src={profile}
                  alt="profile large"
                  className="dropdown-avatar"
                />
                <div className="dropdown-user-details">
                  <span className="profile-role">
                    {loggedInUser?.is_staff ? "Administrator" : "User"}
                  </span>
                  <span className="dropdown-email">
                    {loggedInUser?.email || ""}
                  </span>
                  <span className="dropdown-badge">
                    {loggedInUser?.is_staff ? "Administrator" : "User"}
                  </span>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <ul className="dropdown-menu">
                <li className="dropdown-item">
                  <User size={16} />
                  <span>My Profile</span>
                </li>
                <li className="dropdown-item">
                  <Settings size={16} />
                  <span>Account Settings</span>
                </li>
              </ul>
              
              <div className="dropdown-divider"></div>
              
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={16}/>
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header