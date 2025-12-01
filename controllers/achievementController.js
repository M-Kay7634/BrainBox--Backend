const Achievement = require('../models/Achievement');

exports.getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const ach = await Achievement.find({ userId }).sort({ date: -1 });
    res.json(ach);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
