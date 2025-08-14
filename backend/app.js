const express = require('express');
const mongoose = require('mongoose');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure CORS to allow the frontend URL
app.use(cors({ origin: 'http://neyo-blog-app.vercel.app/' })); // Replace with your actual Vercel URL

app.use(express.json());

app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;