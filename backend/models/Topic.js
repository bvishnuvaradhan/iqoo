const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  subject_id: { type: String, ref: 'Subject' },
  name: String,
  status: String,
  module_name: String,
  importance: { type: String, default: 'medium' },
  quiz_score: Number
});

module.exports = mongoose.model('Topic', TopicSchema);
