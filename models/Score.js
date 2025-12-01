const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  playerName: { type: String, default: 'Guest' },
  game: { type: String, required: true },
  score: { type: Number, required: true },
  timeTaken: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', ScoreSchema);
