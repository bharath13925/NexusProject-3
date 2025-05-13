import React, { useState, useEffect } from 'react';
import '../styles/ManageDoctors.css';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('doctorName');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Form state for adding/editing doctors
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDoctorId, setCurrentDoctorId] = useState(null);
  const [formData, setFormData] = useState({
    uid: '',
    doctorName: '',
    specialization: '',
    degree: '',
    appointmentFee: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/doctors');
      
      if (!response.ok) {
        throw new Error(`Error fetching doctors: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDoctors(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => {
    return (
      doctor.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.degree.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort doctors
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    let valueA, valueB;
    
    if (sortBy === 'doctorName') {
      valueA = a.doctorName;
      valueB = b.doctorName;
    } else if (sortBy === 'specialization') {
      valueA = a.specialization;
      valueB = b.specialization;
    } else if (sortBy === 'appointmentFee') {
      return sortOrder === 'asc' ? a.appointmentFee - b.appointmentFee : b.appointmentFee - a.appointmentFee;
    } else if (sortBy === 'appointmentCount') {
      return sortOrder === 'asc' ? a.appointmentCount - b.appointmentCount : b.appointmentCount - a.appointmentCount;
    }
    
    return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'appointmentFee' ? Number(value) : value,
    });
  };

  const handleAddDoctor = () => {
    setIsFormVisible(true);
    setIsEditing(false);
    setFormData({
      uid: '',
      doctorName: '',
      specialization: '',
      degree: '',
      appointmentFee: '',
    });
  };

  const handleEditDoctor = (doctor) => {
    setIsFormVisible(true);
    setIsEditing(true);
    setCurrentDoctorId(doctor._id);
    setFormData({
      uid: doctor.uid,
      doctorName: doctor.doctorName,
      specialization: doctor.specialization,
      degree: doctor.degree,
      appointmentFee: doctor.appointmentFee,
    });
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/doctors/${doctorId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setDoctors(doctors.filter(doctor => doctor._id !== doctorId));
          alert('Doctor deleted successfully');
        } else {
          alert('Failed to delete doctor');
        }
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('An error occurred while deleting the doctor');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.uid || !formData.doctorName || !formData.specialization || 
        !formData.degree || formData.appointmentFee === '') {
      alert('Please fill in all fields');
      return;
    }

    try {
      let response;
      
      if (isEditing) {
        // Update existing doctor
        response = await fetch(`http://localhost:5000/api/doctors/${currentDoctorId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new doctor
        response = await fetch('http://localhost:5000/api/doctors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }
      
      if (response.ok) {
        const result = await response.json();
        
        if (isEditing) {
          setDoctors(doctors.map(doctor => 
            doctor._id === currentDoctorId ? result : doctor
          ));
          alert('Doctor updated successfully');
        } else {
          setDoctors([...doctors, result]);
          alert('Doctor added successfully');
        }
        
        setIsFormVisible(false);
        setFormData({
          uid: '',
          doctorName: '',
          specialization: '',
          degree: '',
          appointmentFee: '',
        });
      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting doctor data:', error);
      alert('An error occurred while submitting doctor data');
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) return <div className="doctors-loading">Loading doctors...</div>;
  if (error) return <div className="doctors-error">{error}</div>;

  return (
    <div className="manage-doctors-container">
      <h2>Manage Doctors</h2>
      
      <div className="doctors-actions">
        <button 
          className="add-doctor-btn"
          onClick={handleAddDoctor}
        >
          Add New Doctor
        </button>
        
        <div className="doctors-controls">
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <div className="sort-controls">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="doctorName">Name</option>
              <option value="specialization">Specialization</option>
              <option value="appointmentFee">Fee</option>
              <option value="appointmentCount">Appointment Count</option>
            </select>
            
            <button 
              onClick={toggleSortOrder}
              className="sort-order-btn"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {isFormVisible && (
        <div className="doctor-form-container">
          <h3>{isEditing ? 'Edit Doctor' : 'Add New Doctor'}</h3>
          <form onSubmit={handleSubmit} className="doctor-form">
            <div className="form-group">
              <label htmlFor="uid">User ID (UID):</label>
              <input
                type="text"
                id="uid"
                name="uid"
                value={formData.uid}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="doctorName">Doctor Name:</label>
              <input
                type="text"
                id="doctorName"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="specialization">Specialization:</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="degree">Degree:</label>
              <input
                type="text"
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="appointmentFee">Appointment Fee ($):</label>
              <input
                type="number"
                id="appointmentFee"
                name="appointmentFee"
                value={formData.appointmentFee}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="submit-btn">
                {isEditing ? 'Update Doctor' : 'Add Doctor'}
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setIsFormVisible(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {sortedDoctors.length > 0 ? (
        <div className="doctors-table-container">
          <table className="doctors-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Degree</th>
                <th>Fee</th>
                <th>Appointments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDoctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor.doctorName}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.degree}</td>
                  <td>${doctor.appointmentFee}</td>
                  <td>{doctor.appointmentCount}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditDoctor(doctor)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteDoctor(doctor._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-doctors">
          <p>No doctors found matching your criteria.</p>
        </div>
      )}
      
      <div className="doctors-summary">
        <p>Total: {sortedDoctors.length} doctors</p>
      </div>
    </div>
  );
};

export default ManageDoctors;