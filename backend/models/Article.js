const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, required: true },
  date: { type: Date, required: true },
  snippet: { type: String, required: true },
  saved: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
