const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

// POST route to process a batch of names
router.post('/process', leadController.processBatch);

// GET route to retrieve leads with optional filtering
router.get('/', leadController.getLeads);

module.exports = router;