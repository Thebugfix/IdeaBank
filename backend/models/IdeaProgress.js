// backend/models/IdeaProgress.js
const mongoose = require('mongoose');

const IdeaProgressSchema = new mongoose.Schema({
  ideaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentStage: { type: String, required: true },
  description: { type: String, required: true },
  mentorRemark: { type: String },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Needs Improvement'], default: 'Pending' },
  progressPercent: { type: Number, min: 0, max: 100, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IdeaProgress', IdeaProgressSchema);