import React, { useEffect, useState } from 'react';
import SidebarComponent from '../components/Sidebar';
import '../styles/ManageAppointments.css';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedDoctorName, setSelectedDoctorName] = useState('');
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'

  useEffect(() => {
    // Get user ID from localStorage
    const storedUid = localStorage.getItem('uid');
    
    if (storedUid) {
      setUid(storedUid);
    } else {
      setError("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    // Fetch appointments
    fetchAppointments(storedUid);
    
    // Fetch doctors
    fetchDoctors();
  }, []);

  useEffect(() => {
    // Combine appointment data with doctor details
    if (appointments.length > 0 && doctors.length > 0) {
      const detailsMap = {};
      
      appointments.forEach(appointment => {
        // Find the doctor for this appointment
        const matchedDoctor = doctors.find(doc => doc._id === appointment.doctorId);
        
        if (matchedDoctor) {
          detailsMap[appointment._id] = {
            ...appointment,
            specialization: matchedDoctor.specialization,
            degree: matchedDoctor.degree,
            appointmentFee: matchedDoctor.appointmentFee
          };
        } else {
          detailsMap[appointment._id] = {
            ...appointment,
            specialization: "Not available",
            degree: "Not available",
            appointmentFee: "Not available"
          };
        }
      });
      
      setAppointmentDetails(detailsMap);
      setLoading(false);
    }
  }, [appointments, doctors]);

  const fetchAppointments = (userId) => {
    fetch('http://localhost:5000/api/appointments')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch appointments');
        return res.json();
      })
      .then(data => {
        setAppointments(data);
      })
      .catch(err => {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again later.");
        setLoading(false);
      });
  };

  const fetchDoctors = () => {
    fetch('http://localhost:5000/api/doctors')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch doctors');
        return res.json();
      })
      .then(data => setDoctors(data))
      .catch(err => {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please try again later.");
        setLoading(false);
      });
  };

  const openRescheduleModal = (appointmentId) => {
    const appointment = appointments.find(app => app._id === appointmentId);
    if (appointment) {
      // Format the date for the datetime-local input
      const appointmentDate = new Date(appointment.appointmentDate);
      const localDateString = appointmentDate.toISOString().slice(0, 16);
      
      setSelectedAppointmentId(appointmentId);
      setSelectedDoctorName(appointment.doctorName);
      setSelectedDate(localDateString);
      setShowRescheduleModal(true);
    }
  };

  const openCancelConfirmModal = (appointmentId) => {
    const appointment = appointments.find(app => app._id === appointmentId);
    setSelectedAppointment(appointment);
    setSelectedAppointmentId(appointmentId);
    setShowCancelConfirmModal(true);
  };

  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedAppointmentId(null);
    setSelectedDate('');
  };

  const closeCancelConfirmModal = () => {
    setShowCancelConfirmModal(false);
    setSelectedAppointmentId(null);
    setSelectedAppointment(null);
  };

  const handleRescheduleAppointment = () => {
    // Check if date is selected
    if (!selectedDate) {
      alert('Please select a new date for your appointment.');
      return;
    }
    
    fetch(`http://localhost:5000/api/appointments/reschedule/${selectedAppointmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        appointmentDate: selectedDate 
      }),
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.message || 'Failed to reschedule appointment');
          });
        }
        return res.json();
      })
      .then(data => {
        alert('Appointment rescheduled successfully!');
        // Close modal
        closeRescheduleModal();
        // Refresh appointments
        fetchAppointments(uid);
      })
      .catch(err => {
        console.error("Rescheduling error:", err);
        alert(err.message || 'Failed to reschedule appointment');
      });
  };

  const handleCancelAppointment = () => {
    fetch(`http://localhost:5000/api/appointments/cancel/${selectedAppointmentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.message || 'Failed to cancel appointment');
          });
        }
        return res.json();
      })
      .then(data => {
        alert('Appointment cancelled successfully!');
        // Close modal
        closeCancelConfirmModal();
        // Refresh appointments
        fetchAppointments(uid);
        fetchDoctors(); // Refresh doctors to update appointment count
      })
      .catch(err => {
        console.error("Cancellation error:", err);
        alert(err.message || 'Failed to cancel appointment');
      });
  };

  // Format date to display in a nicer format
  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString(undefined, options);
  };

  const filterAppointments = (appointments) => {
    if (!appointments) return [];
    
    const today = new Date();
    const userAppointments = appointments.filter(app => app.userId === uid);
    
    if (filter === 'upcoming') {
      return userAppointments.filter(app => new Date(app.appointmentDate) >= today);
    } else if (filter === 'past') {
      return userAppointments.filter(app => new Date(app.appointmentDate) < today);
    } else {
      return userAppointments;
    }
  };

  const filteredAppointments = filterAppointments(appointments);

  if (loading) return (
    <div className="manage-appointments-container">
      <div className="sidebar-container">
        <SidebarComponent />
      </div>
      <div className="main-content">
        <div className="loading">Loading your appointments...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="manage-appointments-container">
      <div className="sidebar-container">
        <SidebarComponent />
      </div>
      <div className="main-content">
        <div className="error-message">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="manage-appointments-container">
      <div className="sidebar-container">
        <SidebarComponent />
      </div>
      <div className="main-content">
        <h2>Manage Your Appointments</h2>
        
        <div className="appointment-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Appointments
          </button>
          <button 
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past
          </button>
        </div>
        
        <div className="appointment-list">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div className="appointment-card" key={appointment._id}>
                <div className="appointment-header">
                  <h3>{appointment.doctorName}</h3>
                  <span className="appointment-status">Confirmed</span>
                </div>
                
                {appointmentDetails[appointment._id] && (
                  <div className="appointment-details">
                    <p><strong>Specialization:</strong> {appointmentDetails[appointment._id].specialization}</p>
                    <p><strong>Degree:</strong> {appointmentDetails[appointment._id].degree}</p>
                    {appointmentDetails[appointment._id].appointmentFee !== "Not available" && (
                      <p><strong>Fee:</strong> ₹{appointmentDetails[appointment._id].appointmentFee}</p>
                    )}
                  </div>
                )}
                
                <div className="appointment-date">
                  <p><strong>Date & Time:</strong> {formatAppointmentDate(appointment.appointmentDate)}</p>
                </div>
                
                {new Date(appointment.appointmentDate) > new Date() && (
                  <div className="appointment-actions">
                    <button 
                      className="reschedule-btn" 
                      onClick={() => openRescheduleModal(appointment._id)}
                    >
                      Reschedule
                    </button>
                    <button 
                      className="cancel-btn" 
                      onClick={() => openCancelConfirmModal(appointment._id)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-appointments-text">No {filter !== 'all' ? filter : ''} appointments found.</p>
          )}
        </div>
      </div>

      {/* Reschedule modal */}
      {showRescheduleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reschedule Appointment with Dr. {selectedDoctorName}</h3>
            <div className="form-group">
              <label htmlFor="rescheduleDate">New Date & Time:</label>
              <input 
                type="datetime-local" 
                id="rescheduleDate" 
                value={selectedDate}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={closeRescheduleModal}>Cancel</button>
              <button className="reschedule-btn" onClick={handleRescheduleAppointment}>Confirm Reschedule</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirmation modal */}
      {showCancelConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cancel Appointment</h3>
            <p>Are you sure you want to cancel your appointment with Dr. {selectedAppointment?.doctorName} on {formatAppointmentDate(selectedAppointment?.appointmentDate)}?</p>
            <div className="modal-buttons">
              <button className="book-btn" onClick={closeCancelConfirmModal}>No, Keep It</button>
              <button className="cancel-btn" onClick={handleCancelAppointment}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;