const express = require('express');
const router = express.Router();
const { analyzeContent } = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

// Protected route for scanning payloads
router.post('/', protect, analyzeContent);

module.exports = router;
