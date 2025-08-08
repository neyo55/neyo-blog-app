const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/blog-db')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

const passwordHash = bcrypt.hashSync('demopass', 10);
const demoUser = new User({
  _id: new mongoose.Types.ObjectId(), // Generate a valid ObjectId
  name: 'Demo User',
  email: 'demo@demo.com',
  password: passwordHash
});

demoUser.save()
  .then(() => {
    console.log('Demo user created with _id:', demoUser._id);
    mongoose.connection.close(); // Close connection after success
  })
  .catch(err => {
    console.error('Error creating demo user:', err);
    mongoose.connection.close(); // Close connection on error
  });