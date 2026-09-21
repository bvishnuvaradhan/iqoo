const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  subject_id: { type: String, ref: 'Subject' },
  topic_id: { type: String, ref: 'Topic' },
  title: String,
  type: String, // 'syllabus', 'handout', 'notes'
  content_snippet: String
});

module.exports = mongoose.model('Material', MaterialSchema);
