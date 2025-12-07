const express = require('express');
const router = express.Router();
const { addScore, getTopScores, getRecent, getUserScores, getDailyTop } = require('../controllers/scoreController');
const auth = require('../middleware/auth');

// public: add score (for now no auth required) or require auth if you prefer
router.post('/', auth, addScore);
router.post('/secure', auth, addScore);

router.get('/top', getTopScores);
router.get('/recent', getRecent);

router.get('/user', auth, getUserScores);
router.get('/top/daily', getDailyTop);


module.exports = router;

