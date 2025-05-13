const express = require('express');
const router = express.Router();
const User = require('../models/User');

// get a user by uid
router.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid: uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user: ' + error.message });
  }
});

// delete an user by the uid
// DELETE user by UID
// DELETE user by MongoDB _id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
});



// fetch the all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users: ' + err.message });
  }
});

// Route to handle user sign-up
router.post('/signup', async (req, res) => {
  try {
    const { uid, name, email, phoneNumber, location } = req.body;

    const newUser = new User({
      uid,
      name,
      email,
      phoneNumber,
      location,
    });

    await newUser.save();
    res.status(200).send('User created successfully');
  } catch (error) {
    res.status(500).send('Error creating user: ' + error.message);
  }
});

router.get('/appointments/:userId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId })
      .populate('doctorId', 'doctorName specialization degree appointmentFee appointmentCount'); // Populate doctor data
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get available doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find(); // Get all doctors
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});
module.exports = router;
