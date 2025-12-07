const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Auth routes
router.post('/signup', signup);
router.post('/login', login);

// ⭐ NEW — Return logged-in user info
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
