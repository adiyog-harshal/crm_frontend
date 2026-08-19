import React, { useEffect, useState } from "react";
import "./Analytics.css";
import api from "../../services/api";

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

const COLORS = [
  "#4F46E5",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
];

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api
      .get("analytics/dashboard/")
      .then((response) => {
        setDashboard(response.data);
      })
      .catch((error) => {
        console.error("Unable to load analytics:", error);
      });
  }, []);

  const liveMonthlyLeads = (dashboard?.monthly_leads || []).map((item) => ({
    month: new Date(item.month).toLocaleString("en", {
      month: "short",
    }),
    leads: item.leads,
  }));

  const liveDealStatus = (dashboard?.deal_status || []).map((item) => ({
    name: item.stage,
    value: item.value,
  }));

  const liveTaskStatus = [
    {
      name: "Completed",
      tasks: dashboard?.completed_tasks || 0,
    },
    {
      name: "Pending",
      tasks: dashboard?.pending_tasks || 0,
    },
  ];

  const upcomingMeetings = dashboard?.upcoming_meetings || [];

  return (
    <div>

      {/* Header */}
      <div className="analytics-header">
        <h2>Analytics</h2>
        <p>CRM Overview & Performance</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">

        <div className="card">
          <h4>Total Leads</h4>
          <h2>{dashboard?.total_leads ?? "—"}</h2>
          <span>
            {dashboard
              ? `${dashboard.total_leads} Total`
              : "Loading..."}
          </span>
        </div>

        <div className="card">
          <h4>Total Contacts</h4>
          <h2>{dashboard?.total_contacts ?? "—"}</h2>
          <span>
            {dashboard
              ? `${dashboard.total_contacts} Total`
              : "Loading..."}
          </span>
        </div>

        <div className="card">
          <h4>Total Deals</h4>
          <h2>{dashboard?.total_deals ?? "—"}</h2>
          <span>
            {dashboard
              ? `${dashboard.total_deals} Total`
              : "Loading..."}
          </span>
        </div>

      </div>

      {/* Charts */}
      <div className="chart-section">

        {/* Monthly Leads */}
        <div className="chart-card">

          <h3>Monthly Leads</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={liveMonthlyLeads}>

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
            <BarChart data={liveTaskStatus}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="tasks"
                fill="#10B981"
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* Deal Status */}
        <div className="chart-card">

          <h3>Deal Status</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>

              <Pie
                data={liveDealStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {liveDealStatus.map((entry, index) => (
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

      </div>

      {/* Bottom Section */}
      <div className="bottom-section">

        {/* Task Summary */}
        <div className="card progress-card">

          <h3>Task Summary</h3>

          <div className="progress-item">
            <p>Completed Tasks</p>

            <progress
              value={dashboard?.completed_tasks || 0}
              max={dashboard?.total_tasks || 1}
            />

            <span>
              {dashboard?.completed_tasks || 0}
            </span>
          </div>

          <div className="progress-item">
            <p>Pending Tasks</p>

            <progress
              value={dashboard?.pending_tasks || 0}
              max={dashboard?.total_tasks || 1}
            />

            <span>
              {dashboard?.pending_tasks || 0}
            </span>
          </div>

          <div className="progress-item">
            <p>Total Tasks</p>

            <span>
              {dashboard?.total_tasks ?? "—"}
            </span>
          </div>

        </div>

        {/* Upcoming Meetings */}
        <div className="card meeting-card">

          <h3>Upcoming Meetings</h3>

          {upcomingMeetings.length > 0 ? (
            upcomingMeetings.map((meeting, index) => (
              <div
                className="meeting-item"
                key={index}
              >
                <h4>{meeting.title}</h4>

                <p>
                  {meeting.meeting_date} •{" "}
                  {meeting.start_time}
                </p>
              </div>
            ))
          ) : (
            <p>No upcoming meetings.</p>
          )}

        </div>

      </div>

      {/* Recent Activities */}
      <div className="card recent-card">

        <h3>Recent Activities</h3>

        <ul>

          <li>
            Total Leads: {dashboard?.total_leads ?? 0}
          </li>

          <li>
            Total Deals: {dashboard?.total_deals ?? 0}
          </li>

          <li>
            Total Meetings: {dashboard?.total_meetings ?? 0}
          </li>

          <li>
            Completed Tasks: {dashboard?.completed_tasks ?? 0}
          </li>

          <li>
            Pending Tasks: {dashboard?.pending_tasks ?? 0}
          </li>

        </ul>

      </div>

    </div>
  );
};

export default Analytics;