import React from "react";
import "./Analytics.css";
import {
  ResponsiveContainer,
  LineChart,
  PieChart,
  Pie,
  Legend,
  Cell,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
const dealStatus = [
  { name: "Open", value: 18 },
  { name: "Negotiation", value: 10 },
  { name: "Won", value: 15 },
  { name: "Lost", value: 7 },
];
const COLORS = [
  "#4F46E5",
  "#22C55E",
  "#F59E0B",
  "#EF4444"
];
const monthlyLeads = [
  { month: "Jan", leads: 18 },
  { month: "Feb", leads: 24 },
  { month: "Mar", leads: 20 },
  { month: "Apr", leads: 32 },
  { month: "May", leads: 28 },
  { month: "Jun", leads: 36 },
  { month: "Jul", leads: 42 },
];

const taskStatus = [
  { name: "Completed", tasks: 24 },
  { name: "Pending", tasks: 8 },
];

const Analytics = () => {
  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <h2>Analytics</h2>
        <p>CRM Overview & Performance</p>
      </div>

      {/* Summary Cards */}

      <div className="summary-cards">

        <div className="card">
          <h4>Total Leads</h4>
          <h2>245</h2>
          <span>+12 this week</span>
        </div>

        <div className="card">
          <h4>Total Contacts</h4>
          <h2>180</h2>
          <span>+6 this week</span>
        </div>

        <div className="card">
          <h4>Total Deals</h4>
          <h2>52</h2>
          <span>8 Active</span>
        </div>

        <div className="card">
          <h4>Total Accounts</h4>
          <h2>35</h2>
          <span>3 New</span>
        </div>

      </div>

      {/* Charts */}

      <div className="chart-section">

        {/* Monthly Leads */}

        <div className="chart-card">

          <h3>Monthly Leads</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyLeads}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#4F46E5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

        {/* Task Status */}

        <div className="chart-card">

          <h3>Task Status</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#10B981"  />
            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* Lead card */}
<div className="chart-card">
  <h3>Deal Status</h3>

  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={dealStatus}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={90}
        label
      >
        {dealStatus.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>


        {/* Bottom Section */}

      <div className="bottom-section">

        {/* Lead Conversion */}

        <div className="card progress-card">

          <h3>Lead By Stage</h3>

          <div className="progress-item">
            <p>Qualified Leads</p>
            <progress value="75" max="100"></progress>
            <span>75%</span>
          </div>

          <div className="progress-item">
            <p>Deals Closed</p>
            <progress value="60" max="100"></progress>
            <span>60%</span>
          </div>

          <div className="progress-item">
            <p>Meeting Scheduled</p>
            <progress value="82" max="100"></progress>
            <span>82%</span>
          </div>

        </div>

        {/* Upcoming Meetings */}

        <div className="card meeting-card">

          <h3>Upcoming Meetings</h3>

          <div className="meeting-item">
            <h4>ABC Technologies</h4>
            <p>Today • 10:00 AM</p>
          </div>

          <div className="meeting-item">
            <h4>XYZ Pvt Ltd</h4>
            <p>Today • 3:30 PM</p>
          </div>

          <div className="meeting-item">
            <h4>PQR Solutions</h4>
            <p>Tomorrow • 11:00 AM</p>
          </div>

        </div>

      </div>

      {/* Recent Activities */}

      <div className="card recent-card">

        <h3>Recent Activities</h3>

        <ul>

          <li> New Lead added - Rahul Sharma</li>

          <li> Contact updated - Priya Patel</li>

          <li> Deal moved to Negotiation</li>

          <li> Meeting scheduled with ABC Technologies</li>

          <li> Task completed by Team</li>

        </ul>

      </div>

    </div>
    </div>
      
  )
}
export default Analytics
    
