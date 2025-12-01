const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const achievementRoutes = require('./routes/achievementRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/profile", require("./routes/profileRoutes"));

app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);

app.get('/', (req, res) => res.send('IQPlay API running'));

app.use('/api/achievements', achievementRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server started on ${PORT}`));
})
.catch(err => console.error(err));
