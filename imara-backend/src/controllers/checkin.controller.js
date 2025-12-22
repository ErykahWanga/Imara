const CheckIn = require('../models/CheckIn');
const User = require('../models/User');

// @desc    Create daily check-in
// @route   POST /api/checkins
// @access  Private
const createCheckIn = async (req, res, next) => {
  try {
    const { sleep, food, focus, mood, notes, tags } = req.body;

    // Check if user already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await CheckIn.findOne({
      user: req.user.id,
      date: today
    });

    if (existingCheckIn) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked in today'
      });
    }

    // Create check-in
    const checkIn = await CheckIn.create({
      user: req.user.id,
      date: today,
      sleep,
      food,
      focus,
      mood,
      notes,
      tags
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.totalCheckIns': 1 }
    });

    // Calculate and update streak
    await updateUserStreak(req.user.id);

    res.status(201).json({
      success: true,
      data: checkIn
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user check-ins
// @route   GET /api/checkins
// @access  Private
const getCheckIns = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const checkIns = await CheckIn.find({ user: req.user.id })
      .sort({ date: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await CheckIn.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: total,
      data: checkIns,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single check-in
// @route   GET /api/checkins/:id
// @access  Private
const getCheckIn = async (req, res, next) => {
  try {
    const checkIn = await CheckIn.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: 'Check-in not found'
      });
    }

    res.status(200).json({
      success: true,
      data: checkIn
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update check-in
// @route   PUT /api/checkins/:id
// @access  Private
const updateCheckIn = async (req, res, next) => {
  try {
    const checkIn = await CheckIn.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: 'Check-in not found'
      });
    }

    // Only allow updating notes and tags
    const { notes, tags } = req.body;
    const updateData = {};
    
    if (notes !== undefined) updateData.notes = notes;
    if (tags !== undefined) updateData.tags = tags;

    const updatedCheckIn = await CheckIn.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedCheckIn
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete check-in
// @route   DELETE /api/checkins/:id
// @access  Private
const deleteCheckIn = async (req, res, next) => {
  try {
    const checkIn = await CheckIn.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: 'Check-in not found'
      });
    }

    await checkIn.deleteOne();

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.totalCheckIns': -1 }
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get check-in statistics
// @route   GET /api/checkins/stats
// @access  Private
const getCheckInStats = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const checkIns = await CheckIn.find({
      user: req.user.id,
      date: { $gte: startDate }
    });

    // Calculate statistics
    const stats = {
      totalCheckIns: checkIns.length,
      averageMood: calculateAverageMood(checkIns),
      moodDistribution: calculateMoodDistribution(checkIns),
      sleepDistribution: calculateSleepDistribution(checkIns),
      focusDistribution: calculateFocusDistribution(checkIns),
      foodDistribution: calculateFoodDistribution(checkIns),
      weeklyProgress: calculateWeeklyProgress(checkIns)
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
const updateUserStreak = async (userId) => {
  const checkIns = await CheckIn.find({ user: userId })
    .sort({ date: -1 })
    .limit(30);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < checkIns.length; i++) {
    const checkInDate = new Date(checkIns[i].date);
    checkInDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (checkInDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  await User.findByIdAndUpdate(userId, {
    'stats.currentStreak': streak,
    'stats.longestStreak': Math.max(streak, await User.findById(userId).then(u => u.stats.longestStreak))
  });
};

const calculateAverageMood = (checkIns) => {
  const moodValues = {
    'tired': 1, 'neutral': 2, 'calm': 3,
    'overwhelmed': 1, 'happy': 4, 'energetic': 5
  };

  if (checkIns.length === 0) return 0;

  const total = checkIns.reduce((sum, checkIn) => sum + moodValues[checkIn.mood], 0);
  return (total / checkIns.length).toFixed(1);
};

const calculateMoodDistribution = (checkIns) => {
  const distribution = {};
  checkIns.forEach(checkIn => {
    distribution[checkIn.mood] = (distribution[checkIn.mood] || 0) + 1;
  });
  return distribution;
};

const calculateSleepDistribution = (checkIns) => {
  const distribution = {};
  checkIns.forEach(checkIn => {
    distribution[checkIn.sleep] = (distribution[checkIn.sleep] || 0) + 1;
  });
  return distribution;
};

const calculateFocusDistribution = (checkIns) => {
  const distribution = {};
  checkIns.forEach(checkIn => {
    distribution[checkIn.focus] = (distribution[checkIn.focus] || 0) + 1;
  });
  return distribution;
};

const calculateFoodDistribution = (checkIns) => {
  const distribution = {};
  checkIns.forEach(checkIn => {
    distribution[checkIn.food] = (distribution[checkIn.food] || 0) + 1;
  });
  return distribution;
};

const calculateWeeklyProgress = (checkIns) => {
  const weeklyData = {};
  const today = new Date();
  
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (i * 7));
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekCheckIns = checkIns.filter(checkIn => {
      const checkInDate = new Date(checkIn.date);
      return checkInDate >= weekStart && checkInDate <= weekEnd;
    });
    
    weeklyData[`week_${i}`] = weekCheckIns.length;
  }
  
  return weeklyData;
};

module.exports = {
  createCheckIn,
  getCheckIns,
  getCheckIn,
  updateCheckIn,
  deleteCheckIn,
  getCheckInStats
};
