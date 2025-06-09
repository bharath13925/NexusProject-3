import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateDoctor.css';

const CreateDoctor = () => {
  const [formData, setFormData] = useState({
    uid: '', // Added uid field
    doctorName: '',
    specialization: '',
    degree: '',
    appointmentFee: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${apiUrl}/api/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Doctor created:', data);
        setFormData({
          uid: '',
          doctorName: '',
          specialization: '',
          degree: '',
          appointmentFee: ''
        });
        navigate('/doctors');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create doctor');
      }
    } catch (error) {
      console.error('Error creating doctor:', error);
      setError('Server Error. Try again later.');
    }
  };

  return (
    <div className="create-doctor-container">
      <h2>Create Doctor</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="uid"
          value={formData.uid}
          onChange={handleChange}
          placeholder="Doctor ID"
          required
        />
        <input
          name="doctorName"
          value={formData.doctorName}
          onChange={handleChange}
          placeholder="Doctor Name"
          required
        />
        <input
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          placeholder="Specialization"
          required
        />
        <input
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          placeholder="Degree"
          required
        />
        <input
          name="appointmentFee"
          type="number"
          value={formData.appointmentFee}
          onChange={handleChange}
          placeholder="Appointment Fee"
          required
        />
        <button type="submit">Create</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default CreateDoctor;
