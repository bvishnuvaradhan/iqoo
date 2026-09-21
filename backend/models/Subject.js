const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  student_id: { type: String, ref: 'Student' },
  name: String,
  code: String,
  color: String,
  professor: String,
  progress: Number
});

module.exports = mongoose.model('Subject', SubjectSchema);
