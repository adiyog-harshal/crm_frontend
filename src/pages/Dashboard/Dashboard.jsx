import React, { useState, useEffect  } from 'react'
import './Dashboard.css'
import api from "../../services/api";
import { Building,RotateCw,MoreHorizontal,MoreVertical,ChevronDown,Settings,ArrowUpDown} from "lucide-react";

const Dashboard = () => {

  // 1. STATE DEFINITIONS
  const [selectedHome, setSelectedHome] = useState("Sanket Baghel's Home");
  const [refreshCount, setRefreshCount] = useState(0);

  // Lists state
  const [tasks, setTasks] = useState([]);
  
  const [meetings, setMeetings] = useState([]);

  const [leads, setLeads] = useState([]);
   
  const [deals, setDeals] = useState([]);

  const [todayContacts, settodayContacts] = useState([]);

  useEffect(() => {
  const loadDashboardData = async () => {
    try {
      const [
        tasksResponse,
        meetingsResponse,
        leadsResponse,
        dealsResponse,
        contactsResponse,
      ] = await Promise.all([
        api.get("tasks/list/"),
        api.get("meeting/"),
        api.get("lead/"),
        api.get("deal/"),
        api.get("contacts/"),
      ]);

      console.log("TASKS:", tasksResponse.data);
      console.log("MEETINGS:", meetingsResponse.data);
      console.log("LEADS:", leadsResponse.data);
      console.log("DEALS:", dealsResponse.data);
      console.log("CONTACTS:", contactsResponse.data);

      setTasks(tasksResponse.data);
      setMeetings(meetingsResponse.data);
      setLeads(leadsResponse.data);
      setDeals(dealsResponse.data);
      settodayContacts(contactsResponse.data);

    } catch (error) {
      console.error(
        "DASHBOARD API ERROR:",
        error.response?.data || error
      );
    }
  };

  loadDashboardData();
}, []);

  // Sort states
  const [tasksSortAsc, setTasksSortAsc] = useState(true);
  const [meetingsSortAsc, setMeetingsSortAsc] = useState(true);

  // 2. HANDLERS
  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  const handleSortTasks = () => {
    setTasks(prev => {
      const sorted = [...prev].sort((a, b) => {
        if (tasksSortAsc) {
          return a.subject.localeCompare(b.subject);
        } else {
          return b.subject.localeCompare(a.subject);
        }
      });
      return sorted;
    });
    setTasksSortAsc(!tasksSortAsc);
  };

  const handleSortMeetings = () => {
    setMeetings(prev => {
      const sorted = [...prev].sort((a, b) => {
        if (meetingsSortAsc) {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      });
      return sorted;
    });
    setMeetingsSortAsc(!meetingsSortAsc);
  };

  const handleUpdateTaskStatus = (id, status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleUpdateDealStage = (id, stage) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, stage } : d));
  };

  // 3. STATS CALCULATION
  const myOpenDeals = deals.filter(d => d.stage !== "Closed Won" && d.stage !== "Closed Lost").length;
  const myUntouchedDeals = deals.filter(d => d.stage === "Proposal").length;
  const myCallsToday = meetings.length;
  const myLeads = leads.length;

  return (
    <div className="dashboard">
      {/* A. WELCOME HEADER BAR */}
      <div className="welcome-bar">
        <div className="welcome-left">
          <div className="building-icon-wrapper">
            <Building size={20} />
          </div>
          <h2>Welcome </h2>
        </div>
        <div className="welcome-right">
          <button className="icon-action-btn" title="Refresh Dashboard" onClick={handleRefresh}>
            <RotateCw size={16}  />
          </button>
        </div>
      </div>

      {/* B. SIMPLIFIED STATS ROW */}
      <div className="stats-grid">
        <div className="stats-card">
          <p className="card-label">My Open Deals</p>
          <h2 className="card-value">{myOpenDeals}</h2>
        </div>
        <div className="stats-card">
          <p className="card-label">My Untouched Deals</p>
          <h2 className="card-value">{myUntouchedDeals}</h2>
        </div>
        <div className="stats-card">
          <p className="card-label">My Calls Today</p>
          <h2 className="card-value">{myCallsToday}</h2>  
        </div>
        <div className="stats-card">
          <p className="card-label">My Leads</p>
          <h2 className="card-value">{myLeads}</h2>
        </div>
      </div>

      {/* C. DUAL-COLUMN PANELS */}
      <div className="dashboard-sections-grid">
        
        {/* ROW 1: TASKS & MEETINGS */}
        <div className="section-card">
          <div className="section-header">
            <div className="header-left">
              <h3>My Open Tasks</h3>
            </div>
             <button className="header-more-btn">
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="section-actions-bar">
            <button className="sort-action-btn" onClick={handleSortTasks}>
              <ArrowUpDown size={12} />
              <span>Sort</span>
            </button>
          </div>
          <div className="table-responsive-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(tasks || []).map(task => (
                  <tr key={task.id}>
                    <td className="subject-cell">{task.subject}</td>
                    <td>{task.dueDate}</td>
                    <td>
                      <select 
                        value={task.status} 
                        onChange={e => handleUpdateTaskStatus(task.id, e.target.value)}
                        className="inline-status-select"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Waiting Input">Waiting Input</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="section-footer">
            <span>Total Records {tasks.length}</span>
          </div>
        </div>

        <div className="section-card">
          <div className="section-header">
            <div className="header-left">
              <h3>My Meetings</h3>
            </div>
            <button className="header-more-btn">
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="section-actions-bar">
            <button className="sort-action-btn" onClick={handleSortMeetings}>
              <ArrowUpDown size={12} />
              <span>Sort</span>
            </button>
          </div>
          <div className="table-responsive-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>From</th>
                  <th>To</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(meetings || []).map(meeting => (
                  <tr key={meeting.id}>
                    <td className="meeting-title-cell">{meeting.title}</td>
                    <td>{meeting.from}</td>
                    <td>{meeting.to}</td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="section-footer">
            <span>Total Records {meetings.length}</span>
          </div>
        </div>

        {/* ROW 2: LEADS & CLOSING DEALS */}
        <div className="section-card">
          <div className="section-header">
            <div className="header-left">
              <h3>Today's Leads</h3>
            </div>
             <button className="header-more-btn">
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="section-actions-bar empty-actions"></div>
          <div className="table-responsive-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(leads || []).map(lead => (
                  <tr key={lead.id}>
                    <td className="bold-cell">{lead.name}</td>
                    <td>{lead.company}</td>
                    <td>{lead.email}</td>
                    <td>{lead.phone}</td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="section-footer">
            <span>Total Records {leads.length}</span>
          </div>
        </div>

        <div className="section-card">
          <div className="section-header">
            <div className="header-left">
              <h3>My Deals Closing This Month</h3>
            </div>
             <button className="header-more-btn">
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="section-actions-bar empty-actions"></div>
          <div className="table-responsive-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Deal Name</th>
                  <th>Amount</th>
                  <th>Stage</th>
                  <th>Close Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(deals || []).map(deal => (
                  <tr key={deal.id}>
                    <td className="bold-cell">{deal.name}</td>
                    <td>₹{Number(deal.amount || 0).toFixed(2)}L</td>
                    <td>
                      <select 
                        value={deal.stage} 
                        onChange={e => handleUpdateDealStage(deal.id, e.target.value)}
                        className="inline-status-select"
                      >
                        <option value="Proposal">Proposal</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Closed Won">Closed Won</option>
                        <option value="Closed Lost">Closed Lost</option>
                      </select>
                    </td>
                    <td>{deal.closeDate}</td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="section-footer">
            <span>Total Records {deals.length}</span>
          </div>
        </div>
        <div className="section-card">
          <div className="section-header">
            <div className="header-left">
              <h3>Today Contact</h3>
            </div>
            <button className="header-more-btn">
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="section-actions-bar empty-actions"></div>
          <div className="table-responsive-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>company</th>
                  <th>Number</th>
                  <th>email</th>
                  <th>Follow UP</th>
                </tr>
              </thead>
              <tbody>
                {(todayContacts || []).map(contact => (
                    <tr key={contact.id}>
                      <td className="bold-cell">
                        {contact.name || 
                          contact.full_name || 
                            `${contact.first_name || ""} ${contact.last_name || ""}`.trim()}</td>
                      <td>{contact.company_name || contact.company}</td>
                      <td>{contact.phone}</td>
                      <td>{contact.email}</td>
                      <td>
                        <select
                          value={contact.stage || "Proposal"}
                          onChange={e => handleUpdateDealStage(contact.id, e.target.value)}
                          className="inline-status-select"
                        >
                        <option value="Proposal">Done</option>
                        <option value="Negotiation">Pending</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="section-footer">
            <span>Total Records {todayContacts.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard