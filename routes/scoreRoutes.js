const express = require('express');
const router = express.Router();
const { addScore, getTopScores, getRecent, getUserScores, getDailyTop } = require('../controllers/scoreController');
const auth = require('../middleware/auth');

// public: add score (for now no auth required) or require auth if you prefer
router.post('/', addScore);
router.get('/top', getTopScores);
router.get('/recent', getRecent);
router.post('/secure', auth, addScore);
router.get('/user', auth, getUserScores);
router.get('/top/daily', getDailyTop);


module.exports = router;

