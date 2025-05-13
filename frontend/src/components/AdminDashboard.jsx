import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import '../styles/AdminDashboard.css';

import Sidebar from './AdminSidebar';
import DoctorsList from './DoctorsList';
import UsersList from './UsersList';
import ManageDoctors from './ManageDoctors';
import ManageAppointments from './ManageAdminAppointments';
import Profile from './AdminProfile';
import Settings from './AdminSettings';
import Bookmarks from './AdminBookmarks';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/adminloginform');
      } else {
        fetchData();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const doctorsResponse = await fetch('http://localhost:5000/api/doctors');
      const doctorsData = await doctorsResponse.json();

      const usersResponse = await fetch('http://localhost:5000/api/users');
      const usersData = await usersResponse.json();

      const appointmentsResponse = await fetch('http://localhost:5000/api/appointments');
      const appointmentsData = await appointmentsResponse.json();

      const processedDoctors = doctorsData.map(doctor => {
        const doctorAppointments = appointmentsData.filter(
          appointment => appointment.doctorId === doctor._id
        );
        return {
          ...doctor,
          id: doctor._id,
          appointmentCount: doctor.appointmentCount || doctorAppointments.length,
          appointments: doctorAppointments
        };
      });

      const processedUsers = usersData.map(user => {
        const userAppointments = appointmentsData.filter(
          appointment => appointment.userId === user.uid
        );

        const appointmentsWithDoctorInfo = userAppointments.map(appointment => {
          const doctor = doctorsData.find(doc => doc._id === appointment.doctorId);
          return {
            ...appointment,
            doctorName: appointment.doctorName || (doctor ? doctor.doctorName : 'Unknown Doctor')
          };
        });

        return {
          ...user,
          id: user._id,
          appointmentCount: userAppointments.length,
          appointments: appointmentsWithDoctorInfo
        };
      });

      setDoctors(processedDoctors);
      setUsers(processedUsers);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data from the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/adminloginform');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'manageUsers':
        return <UsersList users={users} appointments={appointments} />;
      case 'manageDoctors':
        return <ManageDoctors doctors={doctors} navigate={navigate} />;
      case 'manageAppointments':
        return <ManageAppointments appointments={appointments} doctors={doctors} users={users} />;
      case 'settings':
        return <Settings />;
      case 'bookmarks':
        return <Bookmarks />;
      case 'doctors':
        return <DoctorsList doctors={doctors} users={users} appointments={appointments} />;
      default:
        return <DoctorsList doctors={doctors} users={users} appointments={appointments} />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={handleLogout}
      />
      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading dashboard data...</div>
        ) : (
          <>
            <div className="tab-buttons">
              <button 
                className={activeTab === 'doctors' ? 'active' : ''} 
                onClick={() => setActiveTab('doctors')}
              >
                Show Doctors
              </button>
              <button 
                className={activeTab === 'manageUsers' ? 'active' : ''} 
                onClick={() => setActiveTab('manageUsers')}
              >
                Show Users
              </button>
              <button 
                className={activeTab === 'manageAppointments' ? 'active' : ''} 
                onClick={() => setActiveTab('manageAppointments')}
              >
                Show Appointments
              </button>
            </div>
            {renderContent()}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
