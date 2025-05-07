const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String, required: true },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
