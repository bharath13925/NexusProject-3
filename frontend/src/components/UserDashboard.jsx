import React, { useEffect, useState } from 'react';
import SidebarComponent from '../components/Sidebar';
import '../styles/UserDashboard.css';
import { auth } from '../firebase'; // Import Firebase auth

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDoctorName, setSelectedDoctorName] = useState('');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState('');

  useEffect(() => {
    // First, check if the user is authenticated with Firebase
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        const userUid = user.uid;
        console.log("Firebase authenticated user:", userUid);
        setUid(userUid);
        
        // Also check localStorage as a fallback
        if (!localStorage.getItem('uid')) {
          localStorage.setItem('uid', userUid);
        }
        
        // Fetch appointments for this user
        fetchAppointments(userUid);
        
        // Fetch doctors
        fetchDoctors();
      } else {
        // No user is signed in
        const storedUid = localStorage.getItem('uid');
        console.log("Retrieved UID from localStorage:", storedUid);
        
        if (storedUid) {
          setUid(storedUid);
          fetchAppointments(storedUid);
          fetchDoctors();
        } else {
          setError("User ID not found. Please log in again.");
          setLoading(false);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
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
    }
  }, [appointments, doctors]);

  const fetchAppointments = (userId) => {
    if (!userId) {
      console.error("Cannot fetch appointments: No user ID provided");
      return;
    }
    
    console.log("Fetching appointments for user:", userId);
    setLoading(true);
    
    fetch('http://localhost:5000/api/appointments')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch appointments');
        return res.json();
      })
      .then(data => {
        console.log("Appointments fetched:", data.length);
        setAppointments(data);
        
        // Filter appointments for this user
        const userAppointments = data.filter(app => app.userId === userId);
        console.log("User appointments:", userAppointments.length);
        
        // Don't show alerts for now, can be distracting
        setLoading(false);
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
      .then(data => {
        console.log("Doctors fetched:", data.length);
        setDoctors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please try again later.");
        setLoading(false);
      });
  };

  const openDateModal = (doctorId, doctorName) => {
    // Set minimum date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    setSelectedDate(formattedDate);
    setSelectedDoctorId(doctorId);
    setSelectedDoctorName(doctorName);
    setShowDateModal(true);
    setModalAction('book');
  };

  const openRescheduleModal = (appointmentId) => {
    const appointment = appointments.find(app => app._id === appointmentId);
    if (appointment) {
      // Format the date for the datetime-local input
      const appointmentDate = new Date(appointment.appointmentDate);
      const localDateString = appointmentDate.toISOString().slice(0, 16);
      
      setSelectedAppointmentId(appointmentId);
      setSelectedDoctorId(appointment.doctorId);
      setSelectedDoctorName(appointment.doctorName);
      setSelectedDate(localDateString);
      setShowRescheduleModal(true);
      setModalAction('reschedule');
    }
  };

  const openCancelConfirmModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowCancelConfirmModal(true);
  };

  const closeDateModal = () => {
    setShowDateModal(false);
    setSelectedDoctorId(null);
    setSelectedDoctorName('');
    setSelectedDate('');
  };

  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedAppointmentId(null);
    setSelectedDate('');
  };

  const closeCancelConfirmModal = () => {
    setShowCancelConfirmModal(false);
    setSelectedAppointmentId(null);
  };

  const handleBookAppointment = () => {
    // Check if uid exists before proceeding
    if (!uid) {
      alert('User ID not found. Please log in again.');
      return;
    }
    
    // Check if date is selected
    if (!selectedDate) {
      alert('Please select a date for your appointment.');
      return;
    }
    
    console.log("Booking appointment with UID:", uid, "for date:", selectedDate);
    
    fetch(`http://localhost:5000/api/appointments/book/${selectedDoctorId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        uid, 
        doctorName: selectedDoctorName,
        appointmentDate: selectedDate 
      }),
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.message || 'Failed to book appointment');
          });
        }
        return res.json();
      })
      .then(data => {
        alert('Appointment booked successfully!');
        // Close modal
        closeDateModal();
        // Refresh appointments instead of reloading the page
        fetchAppointments(uid);
        fetchDoctors();
      })
      .catch(err => {
        console.error("Booking error:", err);
        alert(err.message || 'Failed to book appointment');
      });
  };

  const handleRescheduleAppointment = () => {
    // Check if date is selected
    if (!selectedDate) {
      alert('Please select a new date for your appointment.');
      return;
    }
    
    console.log("Rescheduling appointment:", selectedAppointmentId, "for date:", selectedDate);
    
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
    console.log("Cancelling appointment:", selectedAppointmentId);
    
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

  // Custom loading spinner component
  const LoadingSpinner = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  );

  if (loading) return (
    <div className="user-dashboard">
      <div className="sidebar-container">
        <SidebarComponent />
      </div>
      <div className="main-content">
        <LoadingSpinner />
      </div>
    </div>
  );
  
  if (error) return (
    <div className="user-dashboard">
      <div className="sidebar-container">
        <SidebarComponent />
      </div>
      <div className="main-content">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.href = '/login'} className="retry-btn">
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-dashboard">
      <div className="sidebar-container">
        <SidebarComponent />
      </div>
      <div className="main-content">
        <div className="welcome-section">
          <h1>Welcome to MedCare Dashboard</h1>
          <p>Manage your appointments and healthcare needs in one place</p>
        </div>
        
        <h2 className="section-title">Available Doctors</h2>
        <div className="doctor-grid">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div className="doctor-card" key={doctor._id}>
                <h3>{doctor.doctorName}</h3>
                <p>Specialization: {doctor.specialization}</p>
                <p>Degree: {doctor.degree}</p>
                <p>Fee: ₹{doctor.appointmentFee}</p>
                <p>Appointments: {doctor.appointmentCount}</p>
                <button 
                  className="book-btn" 
                  onClick={() => openDateModal(doctor._id, doctor.doctorName)}
                  disabled={!uid}
                >
                  Book Appointment
                </button>
              </div>
            ))
          ) : (
            <p>No doctors available at the moment.</p>
          )}
        </div>
        
        <h2 className="section-title">Your Upcoming Appointments</h2>
        <div className="appointment-grid">
          {appointments.filter(app => app.userId === uid).length > 0 ? (
            appointments.filter(app => app.userId === uid).map((appointment) => (
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
              </div>
            ))
          ) : (
            <p className="no-appointments-text">You have no upcoming appointments. Book one!</p>
          )}
        </div>
      </div>

      {/* Date selection modal */}
      {showDateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Book Appointment with Dr. {selectedDoctorName}</h3>
            <div className="form-group">
              <label htmlFor="appointmentDate">Select Date and Time</label>
              <input 
                type="datetime-local" 
                id="appointmentDate" 
                value={selectedDate}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={closeDateModal}>Cancel</button>
              <button className="book-btn" onClick={handleBookAppointment}>Book Appointment</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule modal */}
      {showRescheduleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reschedule Appointment with Dr. {selectedDoctorName}</h3>
            <div className="form-group">
              <label htmlFor="rescheduleDate">Select New Date and Time</label>
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
            <p>Are you sure you want to cancel this appointment?</p>
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

export default UserDashboard;