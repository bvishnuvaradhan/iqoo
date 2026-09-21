const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Using string IDs like 'stu_1' for demo continuity
  name: String,
  firstName: String,
  semester: String,
  program: String,
  university: String,
  gpa: Number
});

module.exports = mongoose.model('Student', StudentSchema);
