import React, { useState, useEffect } from "react";
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
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Dashboard = ({ doctorName }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, [period, startDate, endDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      let url = `https://snap-hire.onrender.com/api/doctors/appointments?period=${period}`;
      if (period === "custom" && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentAction = async (appointmentId, status) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://snap-hire.onrender.com/api/doctors/appointments/${appointmentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) throw new Error("Failed to update status");
      fetchAppointments();
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  const downloadPDF = () => {
    const input = document.getElementById("dashboard-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("dashboard-report.pdf");
    });
  };

  const downloadCSV = () => {
    const csvData = [
      ["Patient", "Date", "Time", "Status"],
      ...appointments.map((appt) => [
        appt.patientId?.name || "Unknown",
        new Date(appt.date).toLocaleDateString(),
        appt.timeSlot,
        appt.status,
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "appointments-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p>Loading Booking</p>;
  if (error) return <p>Error: {error}</p>;

  const statusData = ["Completed", "Cancelled", "Pending"].map((status) => ({
    name: status,
    value: appointments.filter((a) => a.status === status).length,
  }));

  const timeSlotData = appointments.reduce((acc, appt) => {
    acc[appt.timeSlot] = (acc[appt.timeSlot] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(timeSlotData).map(([key, value]) => ({
    name: key,
    value,
  }));

  const revenueData = appointments
    .filter((a) => a.status === "Completed")
    .map((a) => ({
      date: new Date(a.date).toLocaleDateString(),
      revenue: 100,
    }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div id="dashboard-content" className="container-fluid">
      <h2 className="text-primary">Welcome, {doctorName}!</h2>

      {/* Download Buttons */}
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={downloadPDF}>
          Download PDF Report
        </button>
        <button className="btn btn-secondary" onClick={downloadCSV}>
          Download CSV Report
        </button>
      </div>

      {/* Period Filter */}
      <div className="mb-3">
        <label className="form-label">Select Period:</label>
        <select
          className="form-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom Date Range</option>
        </select>
        {period === "custom" && (
          <div className="mt-2">
            <label>Start Date:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label>End Date:</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Appointments Table */}
      <div className="table-responsive mb-4">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appt, index) => (
                <tr key={appt._id}>
                  <td>{index + 1}</td>
                  <td>{appt.patientId?.name || "Unknown"}</td>
                  <td>{new Date(appt.date).toLocaleDateString()}</td>
                  <td>{appt.timeSlot}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        appt.status === "Completed"
                          ? "success"
                          : appt.status === "Cancelled"
                          ? "danger"
                          : "warning"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    {appt.status === "Pending" && (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() =>
                            handleAppointmentAction(appt._id, "Completed")
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleAppointmentAction(appt._id, "Cancelled")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No Booking available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Graphs Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h4>Appointment Status</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="col-md-6">
          <h4>Appointment Time Slots</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-12">
          <h4>Revenue Over Time</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
