import React, { useState, useEffect } from "react";
import "./Analytics.css";
import { getDashboardStats } from "../../api/analyticsApi";
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

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [dealStatus, setDealStatus] = useState([]);
  const [monthlyLeads, setMonthlyLeads] = useState([]);
  const [taskStatus, setTaskStatus] = useState([]);
  const [progressStats, setProgressStats] = useState({ qualifiedPct: 0, dealsClosedPct: 0, meetingsCount: 0 });
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching analytics:", err));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/deal/')
      .then(res => res.json())
      .then(data => {
        const deals = Array.isArray(data) ? data : [];
        const counts = {};
        deals.forEach(d => {
          const stage = d.stage || "Unknown";
          counts[stage] = (counts[stage] || 0) + 1;
        });
        setDealStatus(Object.keys(counts).map(key => ({ name: key, value: counts[key] })));

        const wonCount = deals.filter(d => d.stage === "Won").length;
        const dealsClosedPct = deals.length > 0 ? Math.round((wonCount / deals.length) * 100) : 0;
        setProgressStats(prev => ({ ...prev, dealsClosedPct }));

        setRecentActivities(prev => {
          const dealActs = deals.slice(0, 3).map(d => `Deal added - ${d.deal_name || "Untitled"}`);
          return mergeActivities(prev, dealActs);
        });
      })
      .catch(err => console.error("Error fetching deal status:", err));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/lead/')
      .then(res => res.json())
      .then(data => {
        const leads = Array.isArray(data) ? data : (data.results || []);
        const monthCounts = {};
        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        leads.forEach(l => {
          const dateStr = l.created_at;
          if (dateStr) {
            const d = new Date(dateStr);
            if (!isNaN(d)) {
              const key = monthNames[d.getMonth()];
              monthCounts[key] = (monthCounts[key] || 0) + 1;
            }
          }
        });

        const chartData = monthNames.filter(m => monthCounts[m]).map(m => ({ month: m, leads: monthCounts[m] }));
        setMonthlyLeads(chartData.length > 0 ? chartData : [{ month: "No Data", leads: 0 }]);

        const activeCount = leads.filter(l => l.status === true).length;
        const qualifiedPct = leads.length > 0 ? Math.round((activeCount / leads.length) * 100) : 0;
        setProgressStats(prev => ({ ...prev, qualifiedPct }));

        const sortedLeads = [...leads].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const leadActs = sortedLeads.slice(0, 3).map(l => `New Lead added - ${l.first_name || ""} ${l.last_name || ""}`.trim());
        setRecentActivities(prev => mergeActivities(prev, leadActs));
      })
      .catch(err => console.error("Error fetching monthly leads:", err));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tasks/')
      .then(res => res.json())
      .then(data => {
        const tasks = Array.isArray(data) ? data : (data.results || []);
        let completed = 0;
        let pending = 0;
        tasks.forEach(t => {
          const status = t.status || t.task_status || "";
          const isDone = t.completed === true || String(status).toLowerCase().includes("complet") || String(status).toLowerCase() === "done";
          if (isDone) completed++;
          else pending++;
        });
        setTaskStatus([
          { name: "Completed", tasks: completed },
          { name: "Pending", tasks: pending },
        ]);
      })
      .catch(err => console.error("Error fetching task status:", err));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/meeting/')
      .then(res => res.json())
      .then(data => {
        const meetings = Array.isArray(data) ? data : [];
        setProgressStats(prev => ({ ...prev, meetingsCount: meetings.length }));

        const today = new Date().toISOString().split('T')[0];
        const upcoming = meetings
          .filter(m => m.meeting_date >= today)
          .sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date))
          .slice(0, 3);
        setUpcomingMeetings(upcoming);

        const sortedMeetings = [...meetings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const meetingActs = sortedMeetings.slice(0, 2).map(m => `Meeting scheduled - ${m.title || "Untitled"}`);
        setRecentActivities(prev => mergeActivities(prev, meetingActs));
      })
      .catch(err => console.error("Error fetching meetings:", err));
  }, []);

  const mergeActivities = (prev, newItems) => {
    const combined = [...prev, ...newItems];
    return combined.slice(0, 6);
  };

  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <h2>Analytics</h2>
        <p>CRM Overview & Performance</p>
      </div>

      <div className="summary-cards">
        <div className="card">
          <h4>Total Leads</h4>
          <h2>{stats ? stats.total_leads : "..."}</h2>
        </div>
        <div className="card">
          <h4>Total Contacts</h4>
          <h2>{stats ? stats.total_contacts : "..."}</h2>
        </div>
        <div className="card">
          <h4>Total Deals</h4>
          <h2>{stats ? stats.total_deals : "..."}</h2>
        </div>
        <div className="card">
          <h4>Total Companies</h4>
          <h2>{stats ? stats.total_companies : "..."}</h2>
        </div>
      </div>

      <div className="chart-section">

        <div className="chart-card">
          <h3>Monthly Leads</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyLeads}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Task Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Deal Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dealStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {dealStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bottom-section">

          <div className="card progress-card">
            <h3>Overview By Stage</h3>
            <div className="progress-item">
              <p>Active Leads</p>
              <progress value={progressStats.qualifiedPct} max="100"></progress>
              <span>{progressStats.qualifiedPct}%</span>
            </div>
            <div className="progress-item">
              <p>Deals Won</p>
              <progress value={progressStats.dealsClosedPct} max="100"></progress>
              <span>{progressStats.dealsClosedPct}%</span>
            </div>
            <div className="progress-item">
              <p>Total Meetings</p>
              <progress value={Math.min(progressStats.meetingsCount, 100)} max="100"></progress>
              <span>{progressStats.meetingsCount}</span>
            </div>
          </div>

          <div className="card meeting-card">
            <h3>Upcoming Meetings</h3>
            {upcomingMeetings.length === 0 ? (
              <p>No upcoming meetings</p>
            ) : (
              upcomingMeetings.map((m) => (
                <div className="meeting-item" key={m.id}>
                  <h4>{m.title}</h4>
                  <p>{m.meeting_date} • {m.start_time}</p>
                </div>
              ))
            )}
          </div>

        </div>

        <div className="card recent-card">
          <h3>Recent Activities</h3>
          <ul>
            {recentActivities.length === 0 ? (
              <li>No recent activity</li>
            ) : (
              recentActivities.map((act, idx) => <li key={idx}>{act}</li>)
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Analytics;