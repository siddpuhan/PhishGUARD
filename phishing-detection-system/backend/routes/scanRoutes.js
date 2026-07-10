const express = require('express');
const router = express.Router();
const { getHistory, getAnalytics } = require('../controllers/scanController');
const { protect, admin } = require('../middleware/auth');

router.get('/history', protect, getHistory);
router.get('/analytics', protect, admin, getAnalytics);

module.exports = router;
