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

const Payment = ({ doctorName }) => {
  const [payments, setPayments] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (period === "custom") {
      // Only fetch data if both startDate and endDate are provided
      if (startDate && endDate) {
        fetchPayments();
      }
    } else {
      // Fetch data for other periods (daily, weekly, monthly)
      fetchPayments();
    }
  }, [period, startDate, endDate]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      let url = `http://localhost:5000/api/doctors/payments?period=${period}`;
      if (period === "custom" && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      setPayments(data.payments || []);
      setGraphData(data.graphData || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const input = document.getElementById("payment-dashboard-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("payment-report.pdf");
    });
  };

  const downloadCSV = () => {
    const csvData = [
      ["Patient", "Date", "Amount", "Status", "Payment Method"],
      ...payments.map((payment) => [
        payment.patientId?.name || "Unknown",
        new Date(payment.createdAt).toLocaleDateString(),
        `$${payment.amount}`,
        payment.status || "N/A",
        payment.paymentMethod || "N/A",
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payments-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p>Error: {error}</p>;

  // Graph Data
  const statusData = Object.entries(graphData.byStatus || {}).map(
    ([status, value]) => ({
      name: status,
      value,
    })
  );

  const paymentMethodData = Object.entries(graphData.byPaymentMethod || {}).map(
    ([method, value]) => ({
      name: method,
      value,
    })
  );

  const earningsByDate = Object.entries(graphData.byDate || {}).map(
    ([date, earnings]) => ({
      date,
      earnings,
    })
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div id="payment-dashboard-content" className="container-fluid">
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

      {/* Metrics Section */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Payments</h5>
              <p className="card-text">{graphData.totalPayments || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Earnings</h5>
              <p className="card-text">₹{graphData.totalEarnings || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Avg. Earnings per Payment</h5>
              <p className="card-text">
                ₹{graphData.averageEarningsPerPayment?.toFixed(2) || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h4>Payment Status</h4>
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
          <h4>Payment Methods</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
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
                {paymentMethodData.map((entry, index) => (
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
          <h4>Earnings Over Time</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={earningsByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="earnings" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payments Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <tr key={payment._id}>
                  <td>{index + 1}</td>
                  <td>{payment.patientId?.name || "Unknown"}</td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td>₹{payment.amount}</td>
                  <td>{payment.paymentMethod || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No payments available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;
