import React, { useState, useEffect } from 'react';
import '../styles/DoctorsList.css';
const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('doctorName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [specializations, setSpecializations] = useState([]);

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
      
      // Extract unique specializations for the filter dropdown
      const uniqueSpecializations = [...new Set(data.map(doctor => doctor.specialization))];
      setSpecializations(uniqueSpecializations);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter doctors based on search term and specialization
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.degree.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = filterSpecialization === 'all' || 
                                 doctor.specialization === filterSpecialization;
    
    return matchesSearch && matchesSpecialization;
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

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) return <div className="doctors-loading">Loading doctors...</div>;
  if (error) return <div className="doctors-error">{error}</div>;

  return (
    <div className="doctors-list-container">
      <h2>Doctors List</h2>
      
      <div className="doctors-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by name, specialization, or degree..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select 
            value={filterSpecialization} 
            onChange={(e) => setFilterSpecialization(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Specializations</option>
            {specializations.map((specialization, index) => (
              <option key={index} value={specialization}>
                {specialization}
              </option>
            ))}
          </select>
        </div>
        
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

export default DoctorsList;