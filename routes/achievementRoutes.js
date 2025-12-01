const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserAchievements } = require('../controllers/achievementController');

router.get('/me', auth, getUserAchievements);

module.exports = router;
