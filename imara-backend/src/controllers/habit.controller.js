const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');

// @desc    Create habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res, next) => {
  try {
    const { name, description, emoji, category, frequency, targetDays } = req.body;

    const habit = await Habit.create({
      user: req.user.id,
      name,
      description,
      emoji,
      category,
      frequency,
      targetDays
    });

    res.status(201).json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user habits
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res, next) => {
  try {
    const { category, isActive } = req.query;
    
    // Build query
    const query = { user: req.user.id };
    
    if (category) {
      query.category = category;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const habits = await Habit.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: habits
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single habit
// @route   GET /api/habits/:id
// @access  Private
const getHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    res.status(200).json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const { name, description, emoji, category, frequency, targetDays, isActive } = req.body;
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (emoji !== undefined) updateData.emoji = emoji;
    if (category !== undefined) updateData.category = category;
    if (frequency !== undefined) updateData.frequency = frequency;
    if (targetDays !== undefined) updateData.targetDays = targetDays;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedHabit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    await habit.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle habit completion
// @route   POST /api/habits/:id/complete
// @access  Private
const toggleHabitCompletion = async (req, res, next) => {
  try {
    const { date, notes } = req.body;
    const completionDate = date ? new Date(date) : new Date();
    completionDate.setHours(0, 0, 0, 0);

    // Check if completion already exists
    const existingCompletion = await HabitCompletion.findOne({
      user: req.user.id,
      habit: req.params.id,
      date: completionDate
    });

    if (existingCompletion) {
      // Toggle existing completion
      existingCompletion.completed = !existingCompletion.completed;
      existingCompletion.completedAt = existingCompletion.completed ? new Date() : null;
      if (notes) existingCompletion.notes = notes;
      
      await existingCompletion.save();

      // Update habit stats
      await updateHabitStats(req.params.id, req.user.id);

      res.status(200).json({
        success: true,
        data: existingCompletion
      });
    } else {
      // Create new completion
      const completion = await HabitCompletion.create({
        user: req.user.id,
        habit: req.params.id,
        date: completionDate,
        completed: true,
        completedAt: new Date(),
        notes
      });

      // Update habit stats
      await updateHabitStats(req.params.id, req.user.id);

      res.status(201).json({
        success: true,
        data: completion
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get habit completions
// @route   GET /api/habits/:id/completions
// @access  Private
const getHabitCompletions = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const completions = await HabitCompletion.find({
      user: req.user.id,
      habit: req.params.id,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: completions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get habit statistics
// @route   GET /api/habits/stats
// @access  Private
const getHabitStats = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user.id, isActive: true });
    
    const stats = {
      totalHabits: habits.length,
      activeHabits: habits.filter(h => h.isActive).length,
      habitsByCategory: calculateHabitsByCategory(habits),
      overallCompletionRate: await calculateOverallCompletionRate(req.user.id),
      longestStreaks: await getLongestStreaks(req.user.id),
      monthlyProgress: await getMonthlyProgress(req.user.id)
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
const updateHabitStats = async (habitId, userId) => {
  const habit = await Habit.findById(habitId);
  const completions = await HabitCompletion.find({
    user: userId,
    habit: habitId,
    completed: true
  });

  habit.totalCompletions = completions.length;
  habit.currentStreak = calculateCurrentStreak(completions);
  habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);

  await habit.save();
};

const calculateCurrentStreak = (completions) => {
  if (completions.length === 0) return 0;

  const sortedCompletions = completions.sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i].date);
    completionDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (completionDate.getTime() === expectedDate.getTime() && sortedCompletions[i].completed) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

const calculateHabitsByCategory = (habits) => {
  const categories = {};
  habits.forEach(habit => {
    categories[habit.category] = (categories[habit.category] || 0) + 1;
  });
  return categories;
};

const calculateOverallCompletionRate = async (userId) => {
  const habits = await Habit.find({ user: userId, isActive: true });
  if (habits.length === 0) return 0;

  let totalPossible = 0;
  let totalCompleted = 0;

  for (const habit of habits) {
    const completions = await HabitCompletion.find({
      user: userId,
      habit: habit._id,
      completed: true
    });

    totalPossible += completions.length;
    totalCompleted += completions.filter(c => c.completed).length;
  }

  return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
};

const getLongestStreaks = async (userId) => {
  const habits = await Habit.find({ user: userId });
  const streaks = [];

  for (const habit of habits) {
    streaks.push({
      habitId: habit._id,
      habitName: habit.name,
      longestStreak: habit.longestStreak
    });
  }

  return streaks.sort((a, b) => b.longestStreak - a.longestStreak).slice(0, 5);
};

const getMonthlyProgress = async (userId) => {
  const habits = await Habit.find({ user: userId, isActive: true });
  const monthlyData = {};
  const today = new Date();
  
  for (let i = 0; i < 6; i++) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
    
    let monthCompletions = 0;
    let monthPossible = 0;

    for (const habit of habits) {
      const completions = await HabitCompletion.find({
        user: userId,
        habit: habit._id,
        date: { $gte: monthStart, $lte: monthEnd },
        completed: true
      });

      monthCompletions += completions.length;
      monthPossible += calculatePossibleCompletions(habit, monthStart, monthEnd);
    }

    monthlyData[`month_${i}`] = {
      completions: monthCompletions,
      possible: monthPossible,
      rate: monthPossible > 0 ? Math.round((monthCompletions / monthPossible) * 100) : 0
    };
  }
  
  return monthlyData;
};

const calculatePossibleCompletions = (habit, startDate, endDate) => {
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  switch (habit.frequency) {
    case 'daily':
      return days;
    case 'weekdays':
      return Math.floor(days * 5 / 7);
    case 'weekends':
      return Math.floor(days * 2 / 7);
    case 'weekly':
      return Math.floor(days / 7);
    default:
      return days;
  }
};

module.exports = {
  createHabit,
  getHabits,
  getHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
  getHabitCompletions,
  getHabitStats
};