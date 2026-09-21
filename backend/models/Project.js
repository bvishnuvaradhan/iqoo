const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  student_id: { type: String, ref: 'Student' },
  name: String,
  description: String,
  status: String,
  deadline: String,
  progress: Number,
  subjects: [{ type: String, ref: 'Subject' }],
  members: [{
    _id: { type: String, required: true },
    name: String,
    role: String,
    responsibility: String
  }]
});

module.exports = mongoose.model('Project', ProjectSchema);
