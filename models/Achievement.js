const mongoose = require('mongoose');

const AchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  key: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now }
});

AchSchema.index({ userId: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', AchSchema);
