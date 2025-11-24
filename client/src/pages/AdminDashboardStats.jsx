import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../assets/style/AdminDashboardStats.css"; // Import the CSS file

const AdminDashboardStats = () => {
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on initial load

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/report/", {
        params: {
          startDate: startDate || null, // Send null if no date is provided
          endDate: endDate || null, // Send null if no date is provided
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleExportPDF = () => {
    const input = document.getElementById("dashboard");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape");
      pdf.addImage(imgData, "PNG", 10, 10, 280, 150);
      pdf.save("dashboard.pdf");
    });
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const { appointments, payments, reviews } = data.detailedReport;

  // Prepare data for charts
  const appointmentData = Object.entries(appointments.dateWise || {}).map(
    ([date, count]) => ({ date, count })
  );
  const paymentData = Object.entries(payments.dateWise || {}).map(
    ([date, amount]) => ({
      date,
      amount,
    })
  );
  const reviewData = Object.entries(reviews.dateWise || {}).map(
    ([date, count]) => ({
      date,
      count,
    })
  );

  const pieData = [
    { name: "2025-03-02", value: appointments.dateWise?.["2025-03-02"] || 0 },
    { name: "2025-03-05", value: appointments.dateWise?.["2025-03-05"] || 0 },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  // Function to render a table for a given data object
  const renderTable = (title, data) => {
    return (
      <div className="table-container">
        <h3>{title}</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([date, count]) => (
              <tr key={date}>
                <td>{date}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div id="dashboard" className="dashboard">
      <h1>Admin Dashboard</h1>
      <div className="date-range">
        <label>Start Date: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={() => fetchData()}>Apply Date Range</button>
        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
            fetchData();
          }}
        >
          Show Lifetime Report
        </button>
      </div>
      <button className="export-button" onClick={handleExportPDF}>
        Export as PDF
      </button>

      <div className="chart-container">
        <h2>Booking</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={appointmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        {renderTable("Booking (Date-wise)", appointments.dateWise || {})}
      </div>

      <div className="chart-container">
        <h2>Payments</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={paymentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        {renderTable("Payments (Date-wise)", payments.dateWise || {})}
      </div>

      <div className="chart-container">
        <h2>Reviews</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reviewData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
        {renderTable("Reviews (Date-wise)", reviews.dateWise || {})}
      </div>

      <div className="chart-container">
        <h2>Bookings Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboardStats;
