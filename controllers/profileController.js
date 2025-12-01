const User = require("../models/User");
const Score = require("../models/Score");

// SUMMARY
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    const scores = await Score.find({ userId });

    const totalGames = scores.length;
    const bestScore = scores.reduce((a, s) => Math.max(a, s.score), 0);

    const avgScore =
      totalGames === 0
        ? 0
        : scores.reduce((a, s) => a + s.score, 0) / totalGames;

    const totalTime = scores.reduce((a, s) => a + (s.timeTaken || 0), 0);

    res.json({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      totalGames,
      bestScore,
      avgScore,
      totalTime
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


// FULL HISTORY
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const scores = await Score.find({ userId }).sort({ date: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


// STREAK CALCULATION
exports.getStreak = async (req, res) => {
  try {
    const userId = req.user.id;

    const scores = await Score.find({ userId }).sort({ date: 1 });

    const daySet = [...new Set(scores.map(s => new Date(s.date).toDateString()))];

    let currentStreak = 0;
    let longestStreak = 0;
    let prev = null;

    for (let d of daySet) {
      const curr = new Date(d);
      if (!prev) {
        currentStreak = 1;
      } else {
        const diff = (curr - prev) / (1000 * 60 * 60 * 24);
        if (diff === 1) currentStreak++;
        else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      }
      prev = curr;
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    res.json({
      currentStreak,
      longestStreak,
      recentDays: daySet.slice(-10)
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
