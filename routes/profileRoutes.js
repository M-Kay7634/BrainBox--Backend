const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Score = require("../models/Score");
const User = require("../models/User");

// ⭐ Helper — always use correct timestamp
function getScoreDate(score) {
  return new Date(score.date || score.createdAt);
}

// ⭐ SUMMARY
router.get("/summary", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).lean();
    const scores = await Score.find({ userId }).lean();

    const totalGames = scores.length;

    const bestScore = scores.length
      ? Math.max(...scores.map((s) => s.score))
      : 0;

    const avgScore = scores.length
      ? scores.reduce((a, s) => a + s.score, 0) / scores.length
      : 0;

    const totalTime = scores.reduce((a, s) => a + (s.timeTaken || 0), 0);

    res.json({
      name: user?.name,
      email: user?.email,
      createdAt: user?.createdAt,
      avatar: user?.avatar || null,

      totalGames,
      bestScore,
      avgScore,
      totalTime,
    });
  } catch (err) {
    res.status(500).json({ msg: "Profile summary failed" });
  }
});

// ⭐ FULL HISTORY
router.get("/history", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const scores = await Score.find({ userId })
      .sort({ date: -1 })     // use correct order
      .lean();

    // Ensure consistent date field
    const formatted = scores.map((s) => ({
      ...s,
      date: s.date || s.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ msg: "History fetch failed" });
  }
});

// ⭐ STREAK + RECENT ACTIVITY
router.get("/streak", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    let scores = await Score.find({ userId })
      .sort({ date: 1 })
      .lean();

    if (scores.length === 0)
      return res.json({
        currentStreak: 0,
        longestStreak: 0,
        recentDays: [],
      });

    // Fix missing date field
    const days = scores.map((s) =>
      getScoreDate(s).toDateString()
    );

    // Unique sorted days
    const uniqueDays = [...new Set(days)].sort(
      (a, b) => new Date(a) - new Date(b)
    );

    let current = 1;
    let longest = 1;

    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = new Date(uniqueDays[i - 1]);
      const curr = new Date(uniqueDays[i]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }

    // Last 10 play days
    const recentDays = uniqueDays.slice(-10);

    res.json({
      currentStreak: current,
      longestStreak: longest,
      recentDays,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Streak fetch failed" });
  }
});

// ⭐ Heatmap Data
router.get("/heatmap", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const scores = await Score.find({ userId }).lean();

    const dayMap = {}; // { "2025-12-07": 5 }

    scores.forEach((s) => {
      const d = new Date(s.date || s.createdAt);
      const key = d.toISOString().split("T")[0]; // YYYY-MM-DD
      dayMap[key] = (dayMap[key] || 0) + 1;
    });

    res.json(dayMap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Heatmap fetch failed" });
  }
});


module.exports = router;
