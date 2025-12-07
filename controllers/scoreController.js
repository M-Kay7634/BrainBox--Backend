const Score = require('../models/Score');
const Achievement = require('../models/Achievement');
const User = require('../models/User');

// ADD SCORE
exports.addScore = async (req, res) => {
  try {

    const userId = req.user ? (req.user.id || req.user._id) : null;
    console.log("UserID: ",userId);
    const { game, score, timeTaken, moves, level, category } = req.body;

    let playerName = "Guest";

    // ⭐ Get actual username if logged in
    if (userId) {
      const user = await User.findById(userId).select("name email");
      playerName = user?.name || user?.email || "User";
    }

    const newScore = new Score({
      userId,
      playerName,
      game,
      score,
      timeTaken,
      moves,
      level,
      category
    });

    await newScore.save();

    // ⭐ Achievements only if logged in
    if (userId) {
      try {
        // First game achievement
        const first = await Achievement.findOne({ userId, key: "first_score" });
        if (!first) {
          await Achievement.create({
            userId,
            key: "first_score",
            title: "First Score!",
            description: "You completed your first game!"
          });
        }

        // High score 100+
        if (score >= 100) {
          const hs = await Achievement.findOne({ userId, key: "high_100" });
          if (!hs) {
            await Achievement.create({
              userId,
              key: "high_100",
              title: "Score 100+",
              description: "Amazing! You scored 100 or higher!"
            });
          }
        }

      } catch (err) {
        console.log("Achievement error:", err);
      }
    }

    return res.json(newScore);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// TOP SCORES
exports.getTopScores = async (req, res) => {
  try {
    const { game } = req.query;
    const filter = game ? { game } : {};
    const top = await Score.find(filter).sort({ score: -1 }).limit(10);
    res.json(top);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// RECENT SCORES
exports.getRecent = async (req, res) => {
  try {
    const recent = await Score.find().sort({ date: -1 }).limit(20);
    res.json(recent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// USER SCORES (Full History)
exports.getUserScores = async (req, res) => {
  try {
    const userId = req.user.id;
    const scores = await Score.find({ userId }).sort({ date: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


// DAILY LEADERBOARD
exports.getDailyTop = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const { game } = req.query;

    const filter = {
      date: { $gte: start, $lte: end }
    };

    if (game) filter.game = game;

    const top = await Score.find(filter).sort({ score: -1 }).limit(10);
    res.json(top);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
