const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Route to handle admin sign-up
router.post('/signup', async (req, res) => {
  try {
    const { uid, name, email, phoneNumber, role, location } = req.body;

    const newAdmin = new Admin({
      uid,
      name,
      email,
      phoneNumber,
      role,
      location,
    });

    await newAdmin.save();
    res.status(200).send('Admin created successfully');
  } catch (error) {
    res.status(500).send('Error creating admin: ' + error.message);
  }
});

// retrieve the admin by uid

router.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await Admin.findOne({ uid: uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user: ' + error.message });
  }
});

module.exports = router;
