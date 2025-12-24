// backend/routes/progress.js
const express = require('express');
const router = express.Router();
const IdeaProgress = require('../models/IdeaProgress');
const Idea = require('../models/Idea');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');

// Student: Update progress
router.post('/update', protect, roleMiddleware(['student']), async (req, res) => {
  const { ideaId, currentStage, description, progressPercent } = req.body;
  try {
    const idea = await Idea.findById(ideaId);

    if (!idea || idea.owner.toString() !== req.user._id.toString() || idea.status !== 'approved') {
      return res.status(403).json({ message: 'Cannot update progress' });
    }

    const progress = new IdeaProgress({
      ideaId,
      studentId: req.user._id,
      currentStage,
      description,
      progressPercent
    });
    await progress.save();

    // Notify mentor/admin
    const notif = new Notification({
      user: idea.owner, // Change to mentor if assigned
      message: `New progress update on idea "${idea.title}"`
    });
    await notif.save();

    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mentor/Admin: Pending progress needing review
router.get('/pending', protect, roleMiddleware(['mentor', 'admin']), async (req, res) => {
  try {
    const progress = await IdeaProgress.find({ status: 'Pending' })
      .populate('ideaId', 'title')
      .populate('studentId', 'name')
      .sort({ updatedAt: -1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Student: Get my progress for idea
router.get('/my/:ideaId', protect, roleMiddleware(['student']), async (req, res) => {
  try {
    const progress = await IdeaProgress.find({ ideaId: req.params.ideaId, studentId: req.user._id })
      .sort({ updatedAt: -1 });

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mentor: Review progress
router.put('/review/:progressId', protect, roleMiddleware(['mentor', 'admin']), async (req, res) => {
  const { mentorRemark, status } = req.body;
  try {
    const progress = await IdeaProgress.findById(req.params.progressId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    progress.mentorRemark = mentorRemark;
    progress.status = status;
    await progress.save();

    // Notify student
    const notif = new Notification({
      user: progress.studentId,
      message: `Your progress update has been reviewed: ${status}`
    });
    await notif.save();

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all progress
router.get('/all', protect, roleMiddleware(['admin']), async (req, res) => {
  try {
    const progress = await IdeaProgress.find({})
      .populate('ideaId', 'title')
      .populate('studentId', 'name')
      .sort({ updatedAt: -1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get progress for specific idea
router.get('/idea/:ideaId', protect, roleMiddleware(['admin']), async (req, res) => {
  try {
    const progress = await IdeaProgress.find({ ideaId: req.params.ideaId })
      .populate('studentId', 'name')
      .sort({ updatedAt: -1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single progress entry (mentor/admin or owner)
router.get('/:progressId', protect, async (req, res) => {
  try {
    const progress = await IdeaProgress.findById(req.params.progressId)
      .populate('ideaId', 'title description')
      .populate('studentId', 'name');
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    const isOwner = progress.studentId && progress.studentId._id.toString() === req.user._id.toString();
    const isPrivileged = ['mentor', 'admin'].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;