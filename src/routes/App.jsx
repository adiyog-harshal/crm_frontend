import './App.css'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Login from '../pages/Login/Login'
import ForgetPassword from '../pages/ForgetPassword/ForgetPassword'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Dashboard from '../pages/Dashboard/Dashboard'
import Leads from '../pages/Leads/Leads'
import Contacts from '../pages/Contacts/Contacts'
import Reports from '../pages/Reports/Reports'
import Deals from '../pages/Deals/Deals'
import Accounts from '../pages/Accounts/Accounts'
import Tasks from '../pages/Tasks/Tasks'
import Meetings from '../pages/Meetings/Meetings'
import Analytics from '../pages/Analytics/Analytics'
import Country from "../pages/Masters/Country/Country";
import State from "../pages/Masters/State/State";
import City from "../pages/Masters/City/City";
import Role from "../pages/Masters/Role/Role";

// Layout for Dashboard sections
const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// Generic page placeholder
const PagePlaceholder = ({ name }) => {
  return (
    <div className="page">
     
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        
        {/* Nested Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/leads" element={<Leads/>} />
          <Route path="/reports" element={<Reports/>} />
          <Route path="/contacts" element={<Contacts/>} />
          <Route path="/deals" element={<Deals/>} />
          <Route path="/accounts" element={<Accounts/>} />
          <Route path="/tasks" element={<Tasks/>} />
          <Route path="/meetings" element={<Meetings/>} />
          <Route path="/analytics" element={<Analytics/>} />
          <Route path="/masters/country" element={<Country />} />
          <Route path="/masters/state" element={<State />} />
          <Route path="/masters/city" element={<City />}  />
          <Route path="/masters/role"element={<Role />} />
          <Route path="/help" element={<PagePlaceholder name="Help & Support" />} />
        </Route>

        {/* Fallback route to redirect any unmatched nested urls to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

