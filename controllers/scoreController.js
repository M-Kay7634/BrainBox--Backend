const Score = require('../models/Score');

exports.addScore = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { game, score, timeTaken } = req.body;

    const newScore = new Score({
      userId,
      playerName: userId ? undefined : 'Guest',
      game,
      score,
      timeTaken
    });

    await newScore.save();
    
    const Achievement = require('../models/Achievement');

    if (userId) {
      try {
        // 1) FIRST SCORE
        const first = await Achievement.findOne({ userId, key: "first_score" });
        if (!first) {
          await Achievement.create({
            userId,
            key: "first_score",
            title: "First Score!",
            description: "You completed your first game!"
          });
        }

        // 2) HIGH SCORE 100+
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

    res.json(newScore);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


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

exports.getRecent = async (req, res) => {
  try {
    const recent = await Score.find().sort({ date: -1 }).limit(20);
    res.json(recent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserScores = async (req, res) => {
  try {
    const userId = req.user.id;
    const scores = await Score.find({ userId }).sort({ date: 1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// DAILY LEADERBOARD
exports.getDailyTop = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0,0,0,0);

    const end = new Date();
    end.setHours(23,59,59,999);

    const { game } = req.query;
    const filter = { date: { $gte: start, $lte: end } };

    if (game) filter.game = game;

    const top = await Score.find(filter).sort({ score: -1 }).limit(10);
    res.json(top);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
