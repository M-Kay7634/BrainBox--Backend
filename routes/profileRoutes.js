const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getSummary,
  getHistory,
  getStreak
} = require("../controllers/profileController");

router.get("/summary", auth, getSummary);
router.get("/history", auth, getHistory);
router.get("/streak", auth, getStreak);

module.exports = router;
