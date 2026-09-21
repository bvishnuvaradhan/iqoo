const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  student_id: { type: String, ref: 'Student' },
  subject_id: { type: String, ref: 'Subject' },
  type: String,
  priority: String,
  title: String,
  description: String,
  estimated_time: String,
  reason: String,
  action_label: String,
  deadline: String
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
