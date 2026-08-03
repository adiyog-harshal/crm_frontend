import React from 'react'
import { tr } from 'zod/locales'
import "./Reports.css"

  const reportsData = [{
    id : 1,
    ReportName : "Monthly Sales Report",
    Category : "Deals",
    createdBy : "Ravi Roy",
    date : "01/08/2026",
    Status : "Completed"
  },{
    id : 2, 
    ReportName : "Lead Conversion report",
    Category : "Leads",
    CreatedBy : "Akash Nile",
    date : "28/08/2026",
    Status : "Pending"
  },{
    id : "3",
    ReportName : "Weekly tasks summary",
    Category : "Tasks",
    CreatedBy : "Neha Sharma",
    date : "30/07/2026",
    Status : "Completed"
  },{
    id : "4",
    ReportName : "Meeting Overview",
    Category : "Meetings",
    CreatedBy : "Isha Kale",
    date : "02/08/2026",
    Status : "Pending"
  }]
  const Reports = () => {
  return (
    <div className='report-page'>
      <h2> Reports</h2>
      <table className = "report-table">
        <thead>
          <tr>
            <th>Report Name </th>
            <th>Category</th>
            <th>Created By</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reportsData.map((report) =>(
            <tr key={report.id}>
              <td>{report.ReportName}</td>
              <td>{report.Category}</td>
              <td>{report.CreatedBy}</td>
              <td>{report.date}</td>
              <td>{report.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Reports