const express = require('express');
const router = express.Router();
const { predictPhishing, getHistory, getAnalytics } = require('../controllers/scanController');
const { protect, admin } = require('../middleware/auth');

router.post('/predict', protect, predictPhishing);
router.get('/history', protect, getHistory);
router.get('/analytics', protect, admin, getAnalytics);

module.exports = router;
