const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  uid: {
    type: String, 
    required: true 
  },
  doctorName: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  appointmentFee: {
    type: Number,
    required: true
  },
  appointmentCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);
