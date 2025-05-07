const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Book Appointment
router.post('/book/:doctorId', async (req, res) => {
  const { doctorId } = req.params;
  const { uid, doctorName, appointmentDate } = req.body; // Added appointmentDate
  console.log(uid, doctorName, appointmentDate);
  
  try {
    // Find User by UID
    const user = await User.findOne({ uid: uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new Appointment with selected date or default to current date
    const appointmentDateTime = appointmentDate ? new Date(appointmentDate) : new Date();
    
    const newAppointment = new Appointment({
      doctorName,
      doctorId,
      userId: uid,
      appointmentDate: appointmentDateTime
    });

    await newAppointment.save();

    // Increase Doctor Appointment Count
    const doctor = await Doctor.findById(doctorId);
    doctor.appointmentCount += 1;
    await doctor.save();

    res.status(201).json({ 
      message: 'Appointment booked successfully', 
      appointment: newAppointment 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error booking appointment', error });
  }
});

// delete an appointment by id

router.delete('/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;
    await Appointment.findByIdAndDelete(appointmentId);
    res.send('Appointment deleted');
  } catch (err) {
    res.status(500).send('Error deleting appointment');
  }
});

// Reschedule Appointment
router.put('/reschedule/:appointmentId', async (req, res) => {
    const { appointmentId } = req.params;
    const { appointmentDate } = req.body;
    
    if (!appointmentDate) {
      return res.status(400).json({ message: 'New appointment date is required' });
    }
    
    try {
      const appointment = await Appointment.findById(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      // Update the appointment date
      appointment.appointmentDate = new Date(appointmentDate);
      await appointment.save();
      
      res.json({ 
        message: 'Appointment rescheduled successfully',
        appointment 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error rescheduling appointment', error });
    }
  });
  
  // Cancel Appointment
  router.delete('/cancel/:appointmentId', async (req, res) => {
    const { appointmentId } = req.params;
    
    try {
      const appointment = await Appointment.findById(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      // Get doctor ID from the appointment to update appointment count
      const doctorId = appointment.doctorId;
      
      // Delete the appointment
      await Appointment.findByIdAndDelete(appointmentId);
      
      // Decrease Doctor Appointment Count
      const doctor = await Doctor.findById(doctorId);
      if (doctor) {
        doctor.appointmentCount = Math.max(0, doctor.appointmentCount - 1);
        await doctor.save();
      }
      
      res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error cancelling appointment', error });
    }
  });
  
// Get All Appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

module.exports = router;