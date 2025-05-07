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
    const admin = await Admin.findOne({ uid: req.params.uid });
    if (!admin) return res.status(404).send("Admin not found");
    res.json(admin);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
