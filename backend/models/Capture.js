const mongoose = require('mongoose');

const CaptureSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  student_id: { type: String, ref: 'Student' },
  subject_id: { type: String, ref: 'Subject' },
  topic_id: { type: String, ref: 'Topic' },
  title: String,
  type: String,
  extracted_text: String,
  timestamp: String,
  confidence: Number,
  status: String
});

module.exports = mongoose.model('Capture', CaptureSchema);
