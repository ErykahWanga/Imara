const Journal = require('../models/Journal');

// @desc    Create journal entry
// @route   POST /api/journal
// @access  Private
const createJournalEntry = async (req, res, next) => {
  try {
    const { content, prompt, mood, tags, isPrivate } = req.body;

    const journalEntry = await Journal.create({
      user: req.user.id,
      content,
      prompt,
      mood,
      tags,
      isPrivate
    });

    res.status(201).json({
      success: true,
      data: journalEntry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user journal entries
// @route   GET /api/journal
// @access  Private
const getJournalEntries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const { mood, tags, search } = req.query;

    // Build query
    const query = { user: req.user.id };

    if (mood) {
      query.mood = mood;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $in: tagArray };
    }

    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { prompt: { $regex: search, $options: 'i' } }
      ];
    }

    const journalEntries = await Journal.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Journal.countDocuments(query);

    res.status(200).json({
      success: true,
      count: total,
      data: journalEntries,
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

// @desc    Get single journal entry
// @route   GET /api/journal/:id
// @access  Private
const getJournalEntry = async (req, res, next) => {
  try {
    const journalEntry = await Journal.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!journalEntry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: journalEntry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update journal entry
// @route   PUT /api/journal/:id
// @access  Private
const updateJournalEntry = async (req, res, next) => {
  try {
    const journalEntry = await Journal.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!journalEntry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    const { content, prompt, mood, tags, isPrivate } = req.body;
    const updateData = {};
    
    if (content !== undefined) updateData.content = content;
    if (prompt !== undefined) updateData.prompt = prompt;
    if (mood !== undefined) updateData.mood = mood;
    if (tags !== undefined) updateData.tags = tags;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    const updatedEntry = await Journal.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedEntry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
const deleteJournalEntry = async (req, res, next) => {
  try {
    const journalEntry = await Journal.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!journalEntry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    await journalEntry.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get journal statistics
// @route   GET /api/journal/stats
// @access  Private
const getJournalStats = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const journalEntries = await Journal.find({
      user: req.user.id,
      createdAt: { $gte: startDate }
    });

    const stats = {
      totalEntries: journalEntries.length,
      totalWords: journalEntries.reduce((sum, entry) => sum + entry.wordCount, 0),
      averageWordsPerEntry: journalEntries.length > 0 
        ? Math.round(journalEntries.reduce((sum, entry) => sum + entry.wordCount, 0) / journalEntries.length)
        : 0,
      moodDistribution: calculateMoodDistribution(journalEntries),
      tagFrequency: calculateTagFrequency(journalEntries),
      writingStreak: calculateWritingStreak(journalEntries),
      monthlyProgress: calculateMonthlyProgress(journalEntries)
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
const calculateMoodDistribution = (entries) => {
  const distribution = {};
  entries.forEach(entry => {
    if (entry.mood) {
      distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
    }
  });
  return distribution;
};

const calculateTagFrequency = (entries) => {
  const frequency = {};
  entries.forEach(entry => {
    entry.tags.forEach(tag => {
      frequency[tag] = (frequency[tag] || 0) + 1;
    });
  });
  return frequency;
};

const calculateWritingStreak = (entries) => {
  if (entries.length === 0) return 0;

  const sortedEntries = entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].createdAt);
    entryDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

const calculateMonthlyProgress = (entries) => {
  const monthlyData = {};
  const today = new Date();
  
  for (let i = 0; i < 6; i++) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
    
    const monthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= monthStart && entryDate <= monthEnd;
    });
    
    monthlyData[`month_${i}`] = {
      entries: monthEntries.length,
      words: monthEntries.reduce((sum, entry) => sum + entry.wordCount, 0)
    };
  }
  
  return monthlyData;
};

module.exports = {
  createJournalEntry,
  getJournalEntries,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getJournalStats
};