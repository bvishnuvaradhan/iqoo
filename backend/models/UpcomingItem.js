const mongoose = require('mongoose');

const UpcomingItemSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  subject_id: { type: String, ref: 'Subject' },
  title: String,
  type: String, // 'exam', 'quiz', 'assignment', 'class'
  date: String,
  priority: String,
  source: { type: String, default: 'system' },
  source_ref: String
});

module.exports = mongoose.model('UpcomingItem', UpcomingItemSchema);
