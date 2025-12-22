const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { validateJournal, handleValidationErrors } = require('../utils/validation.util');
const {
  createJournalEntry,
  getJournalEntries,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getJournalStats
} = require('../controllers/journal.controller');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Create journal entry
router.post('/', [
  validateJournal,
  handleValidationErrors
], createJournalEntry);

// Get all journal entries
router.get('/', getJournalEntries);

// Get journal statistics
router.get('/stats', getJournalStats);

// Get single journal entry
router.get('/:id', getJournalEntry);

// Update journal entry
router.put('/:id', updateJournalEntry);

// Delete journal entry
router.delete('/:id', deleteJournalEntry);

module.exports = router;