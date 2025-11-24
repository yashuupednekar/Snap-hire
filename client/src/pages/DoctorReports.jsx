import React from "react";
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
} from "recharts";

const DoctorReports = ({ appointments }) => {
  // Data for Bar Chart (Appointments by Status)
  const statusData = [
    {
      name: "Completed",
      value: appointments.filter((a) => a.status === "Completed").length,
    },
    {
      name: "Cancelled",
      value: appointments.filter((a) => a.status === "Cancelled").length,
    },
    {
      name: "Pending",
      value: appointments.filter((a) => a.status === "Pending").length,
    },
  ];

  // Data for Pie Chart (Appointments by Time Slot)
  const timeSlotData = appointments.reduce((acc, appt) => {
    acc[appt.timeSlot] = (acc[appt.timeSlot] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(timeSlotData).map((key) => ({
    name: key,
    value: timeSlotData[key],
  }));

  // Data for Line Chart (Revenue Over Time)
  const revenueData = appointments
    .filter((a) => a.status === "Completed")
    .map((a) => ({
      date: new Date(a.date).toLocaleDateString(),
      revenue: 100, // Assuming $100 per completed appointment
    }));

  return (
    <div>
      <h2>Reports</h2>
      <div className="row mt-4">
        {/* Bar Chart - Appointments by Status */}
        <div className="col-md-6">
          <h4>Booking by Status</h4>
          <BarChart width={500} height={300} data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Pie Chart - Appointments by Time Slot */}
        <div className="col-md-6">
          <h4>Booking by Time Slot</h4>
          <PieChart width={500} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Line Chart - Revenue Over Time */}
      <div className="row mt-4">
        <div className="col-md-12">
          <h4>Revenue Over Time</h4>
          <LineChart width={800} height={300} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default DoctorReports;
// const handleAppointmentAction = async (appointmentId, status) => {
//   const token = localStorage.getItem("token");
//   try {
//     const response = await fetch(
//       `https://snap-hire.onrender.com/api/doctors/appointments/${appointmentId}/status`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status }),
//       }
//     );

//     if (!response.ok) throw new Error("Failed to update appointment status");

//     alert(`Appointment marked as ${status}!`);
//     fetchAppointments(); // Refresh appointments list after update
//   } catch (error) {
//     console.error("Error updating appointment:", error);
//     alert("Something went wrong!");
//   }
// }; case "dashboard":
// return (
//   <div>
//     <h2>Welcome, {doctorName}!</h2>
//     <p className="text-muted">Your upcoming appointments:</p>
//     <div className="table-responsive">
//       <table className="table table-striped">
//         <thead className="table-dark">
//           <tr>
//             <th>#</th>
//             <th>Patient</th>
//             <th>Date</th>
//             <th>Time</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {appointments.length > 0 ? (
//             appointments.map((appt, index) => (
//               <tr key={appt._id}>
//                 <td>{index + 1}</td>
//                 <td>{appt.patientId.name}</td>
//                 <td>{new Date(appt.date).toLocaleDateString()}</td>
//                 <td>{appt.timeSlot}</td>
//                 <td>
//                   <span
//                     className={`badge ${
//                       appt.status === "Completed"
//                         ? "bg-success"
//                         : appt.status === "Cancelled"
//                         ? "bg-danger"
//                         : "bg-warning"
//                     }`}
//                   >
//                     {appt.status}
//                   </span>
//                 </td>
//                 <td>
//                   {appt.status === "Pending" && (
//                     <>
//                       <button
//                         className="btn btn-success btn-sm me-2"
//                         onClick={() =>
//                           handleAppointmentAction(appt._id, "Completed")
//                         }
//                       >
//                         Accept
//                       </button>
//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={() =>
//                           handleAppointmentAction(appt._id, "Cancelled")
//                         }
//                       >
//                         Reject
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" className="text-center text-muted">
//                 No upcoming appointments.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );
// const fetchAppointments = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await fetch(
//       `https://snap-hire.onrender.com/api/doctors/appointments`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//           "Cache-Control": "no-cache", // Disable caching
//           Pragma: "no-cache", // Disable caching
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to fetch appointments");
//     }

//     const data = await response.json();
//     setAppointments(data.appointments || []); // Ensure appointments is an array
//   } catch (err) {
//     console.error("Error fetching appointments:", err);
//     alert("Failed to fetch appointments. Please try again.");
//   }
// };