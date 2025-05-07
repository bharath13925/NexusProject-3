import React, { useState, useEffect } from 'react';
import '../styles/ManageAdminAppointments.css'; // Import the CSS file

const ManageAdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch appointments when component mounts
    fetch('http://localhost:5000/api/appointments')
      .then(response => response.json())
      .then(data => {
        setAppointments(data);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      });
  }, []);

  const handleDelete = (appointmentId) => {
    fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          // Remove the deleted appointment from the UI
          setAppointments(appointments.filter(app => app._id !== appointmentId));
        } else {
          throw new Error('Failed to delete the appointment');
        }
      })
      .catch(error => {
        console.error('Error deleting appointment:', error);
      });
  };
  

  return (
    <div className="manage-appointments-container">
      <h2>Manage Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Doctor Name</th>
            <th>Appointment Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment._id}>
              <td>{appointment.userId}</td>
              <td>{appointment.doctorName}</td>
              <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDelete(appointment._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAdminAppointments;
