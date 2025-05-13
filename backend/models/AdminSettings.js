const mongoose = require('mongoose');

const AdminSettingsSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  notification: {
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
  },
  appearance: {
    theme: { type: String, default: 'light' },
    layout: { type: String, default: 'default' },
  },
}, { timestamps: true });

module.exports = mongoose.model('AdminSettings', AdminSettingsSchema);
