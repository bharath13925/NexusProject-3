const express = require('express');
const router = express.Router();
const AdminSettings = require('../models/AdminSettings');

// @route   GET /api/admin/settings/:uid
// @desc    Get admin settings by UID
router.get('/settings/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const settings = await AdminSettings.findOne({ uid });

    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/settings
// @desc    Create or update admin settings
router.post('/settings', async (req, res) => {
  try {
    const { uid, notification, appearance } = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'UID is required' });
    }

    const updatedSettings = await AdminSettings.findOneAndUpdate(
      { uid },
      { $set: { notification, appearance } },
      { upsert: true, new: true }
    );

    res.json({ message: 'Settings saved successfully', settings: updatedSettings });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
