const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Create a doctor
router.post('/', async (req, res) => {
  try {
    const { uid, doctorName, specialization, degree, appointmentFee } = req.body;

    if (!doctorName || !specialization || !degree || !appointmentFee) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const doctor = new Doctor({
      uid,
      doctorName,
      specialization,
      degree,
      appointmentFee
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor created successfully', doctor });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// (Optional) Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Increment appointment count
router.post('/:id/increment', async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  doctor.appointmentCount += 1;
  await doctor.save();
  res.json(doctor);
});

module.exports = router;
