// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  }, // Store uid directly (String) instead of ObjectId
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  doctorName: { 
    type: String, 
    required: true 
  },
  appointmentDate: { 
    type: Date, 
    required: true 
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Appointment', appointmentSchema);
