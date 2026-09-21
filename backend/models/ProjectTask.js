const mongoose = require('mongoose');

const ProjectTaskSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  project_id: { type: String, ref: 'Project' },
  title: String,
  description: String,
  assignee: String,
  status: String,
  priority: String,
  deadline: String
});

module.exports = mongoose.model('ProjectTask', ProjectTaskSchema);
