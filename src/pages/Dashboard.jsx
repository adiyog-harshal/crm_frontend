import React, { useState } from 'react'
import './Dashboard.css'
import { Building,RotateCw,MoreHorizontal,MoreVertical,ChevronDown,Settings,ArrowUpDown} from "lucide-react";

const Dashboard = () => {

  // 1. STATE DEFINITIONS
  const [selectedHome, setSelectedHome] = useState("Sanket Baghel's Home");
  const [refreshCount, setRefreshCount] = useState(0);

  // Lists state
  const [tasks, setTasks] = useState([
    { id: 1, subject: "Follow up with ABC Pvt Ltd", dueDate: "2026-07-16", status: "In Progress" },
    { id: 2, subject: "Send quotation to Infosys", dueDate: "2026-07-17", status: "Not Started" },
    { id: 3, subject: "Client meeting at 3 PM", dueDate: "2026-07-16", status: "In Progress" },
    { id: 4, subject: "Update weekly sales report", dueDate: "2026-07-18", status: "Waiting Input" },
    { id: 5, subject: "Send quotation to Infosys (Follow-up)", dueDate: "2026-07-17", status: "Not Started" },
    { id: 6, subject: "Client meeting at 3 PM (Follow-up)", dueDate: "2026-07-16", status: "In Progress" },
    { id: 7, subject: "Update weekly sales report (Follow-up)", dueDate: "2026-07-18", status: "Waiting Input" },
    { id: 8, subject: "Send quotation to Infosys (Final)", dueDate: "2026-07-17", status: "Not Started" },
    { id: 9, subject: "Client meeting at 3 PM (Final)", dueDate: "2026-07-16", status: "In Progress" },
    { id: 10, subject: "Update weekly sales report (Final)", dueDate: "2026-07-18", status: "Waiting Input" }
  ]);

  const [meetings, setMeetings] = useState([
    { id: 1, title: "Discovery Call - Rahul Sharma", from: "11:00 AM", to: "11:30 AM" },
    { id: 2, title: "Proposal Pitch - Priya Singh", from: "02:30 PM", to: "03:15 PM" },
    { id: 3, title: "Contract Review - Amit Patel", from: "04:00 PM", to: "04:30 PM" },
    { id: 4, title: "Proposal Pitch - Priya Singh (Follow-up)", from: "02:30 PM", to: "03:15 PM" },
    { id: 5, title: "Contract Review - Amit Patel (Follow-up)", from: "04:00 PM", to: "04:30 PM" }
  ]);

  const [leads, setLeads] = useState([
    { id: 1, name: "Rahul Sharma", company: "Infosys", email: "rahul@infosys.com", phone: "+91 98765 43210" },
    { id: 2, name: "Priya Singh", company: "TCS", email: "priya@tcs.com", phone: "+91 98765 12345" },
    { id: 3, name: "Amit Patel", company: "HCL", email: "amit@hcl.com", phone: "+91 99988 77766" },
    { id: 4, name: "Priya Singh (Backup)", company: "TCS", email: "priya@tcs.com", phone: "+91 98765 12345" },
    { id: 5, name: "Amit Patel (Backup)", company: "HCL", email: "amit@hcl.com", phone: "+91 99988 77766" },
    { id: 6, name: "Priya Singh (Backup 2)", company: "TCS", email: "priya@tcs.com", phone: "+91 98765 12345" },
    { id: 7, name: "Amit Patel (Backup 2)", company: "HCL", email: "amit@hcl.com", phone: "+91 99988 77766" },
  ]);

  const [deals, setDeals] = useState([
    { id: 1, name: "Enterprise CRM", company: "Infosys", amount: 5.0, stage: "Proposal", closeDate: "2026-07-28" },
    { id: 2, name: "Integration Services", company: "TCS", amount: 2.5, stage: "Negotiation", closeDate: "2026-07-30" },
    { id: 3, name: "Cloud Management", company: "HCL", amount: 1.0, stage: "Closed Won", closeDate: "2026-07-15" },
    { id: 4, name: "Integration Services (Follow-up)", company: "TCS", amount: 2.5, stage: "Negotiation", closeDate: "2026-07-30" },
    { id: 5, name: "Cloud Management (Follow-up)", company: "HCL", amount: 1.0, stage: "Closed Won", closeDate: "2026-07-15" },
    { id: 6, name: "Integration Services (Final)", company: "TCS", amount: 2.5, stage: "Negotiation", closeDate: "2026-07-30" },
    { id: 7, name: "Cloud Management (Final)", company: "HCL", amount: 1.0, stage: "Closed Won", closeDate: "2026-07-15" }
  ]);

  const [todayContacts, settodayContacts] = useState([
    {id: 1, name: "Rahul singh", company: "xyz", email: "rahul@infosys.com", phone: "+91 98765 43210"},
    {id: 2, name: "Priya Singh", company: "TCS", email: "priya@tcs.com", phone: "+91 98765 12345"},
    {id: 3, name: "Amit Patel", company: "ABC", email: "amit@hcl.com", phone: "+91 99988 77766"},
    {id: 4, name: "Rahul singh (Follow-up)", company: "xyz", email: "rahul@infosys.com", phone: "+91 98765 43210"},
    {id: 5, name: "Priya Singh (Follow-up)", company: "TCS", email: "priya@tcs.com", phone: "+91 98765 12345"},
    {id: 6, name: "Amit Patel (Follow-up)", company: "ABC", email: "amit@hcl.com", phone: "+91 99988 77766"}
  ])

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
          <h2>Welcome Sanket Baghel</h2>
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
                {tasks.map(task => (
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
                {meetings.map(meeting => (
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
                {leads.map(lead => (
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
                {deals.map(deal => (
                  <tr key={deal.id}>
                    <td className="bold-cell">{deal.name}</td>
                    <td>₹{deal.amount.toFixed(1)}L</td>
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
                {todayContacts.map(todayContact => (
                  <tr key={todayContact.id}>
                    <td className="bold-cell">{todayContact.name}</td>
                    <td>{todayContact.company}L</td>
                    <td>{todayContact.phone}</td>
                    <td>{todayContact.email}</td>
                    <td>
                      <select 
                        value={todayContact.stage} 
                        onChange={e => handleUpdateDealStage(todayContact.id, e.target.value)}
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