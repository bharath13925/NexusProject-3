import React from 'react';

const DoctorCard = ({ doctor, onClick }) => (
  <div className="doctor-card" onClick={() => onClick(doctor._id)}>
    <h3>{doctor.doctorName}</h3>
    <p>Specialization: {doctor.specialization}</p>
    <p>Degree: {doctor.degree}</p>
    <p>Fee: ₹{doctor.appointmentFee}</p>
  </div>
);

export default DoctorCard;
