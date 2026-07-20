import './App.css'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import ForgetPassword from '../pages/ForgetPassword'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Dashboard from '../pages/Dashboard'
import Leads from '../pages/Leads'
import Contacts from '../pages/Contacts'
import Reports from '../pages/Reports'
import Deals from '../pages/Deals'
import Accounts from '../pages/Accounts'
import Tasks from '../pages/Tasks'
import Meetings from '../pages/Meetings'
import Analytics from '../pages/Analytics'

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
          <Route path="/help" element={<PagePlaceholder name="Help & Support" />} />
        </Route>

        {/* Fallback route to redirect any unmatched nested urls to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

