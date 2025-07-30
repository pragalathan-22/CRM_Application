const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const User = require('./models/User');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const connectDB = require('./db'); // ⬅️ use your db.js
connectDB(); // ✅ call db connect

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const secretKey = process.env.JWT_SECRET || 'defaultsecret';


// 🔐 Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


// 📝 Signup: Gmail only
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username.endsWith('@gmail.com')) {
      return res.status(403).json({ message: 'Only Gmail accounts allowed' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const role = (username === 'pragalathanabc28@gmail.com') ? 'admin' : 'user';

    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});


// 🔑 Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ username: user.username, role: user.role }, secretKey, { expiresIn: '1h' });

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
});


// 👤 Protected Route
app.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Profile access granted', user: req.user });
});


// Start server
app.listen(3000, () => console.log('🚀 Server running on port 3000'));
