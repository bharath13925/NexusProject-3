const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const adminsRoutes = require('./routes/admins');
const doctors = require('./routes/doctors');
const appointments=require('./routes/appointments');
const adminRoutes = require('./routes/adminSettings');
const articleRoutes = require('./routes/articleRoutes');
// Create the Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/hospital-db')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
// Routes
app.use('/api/users', usersRoutes);
app.use('/api/admins', adminsRoutes);
app.use('/api/doctors',doctors);
app.use('/api/appointments',appointments);
app.use('/api/admin', adminRoutes);
app.use('/api/bookmarks/articles', articleRoutes);
// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
