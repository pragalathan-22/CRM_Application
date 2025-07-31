const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Lead = require('./models/Lead');
const connectDB = require('./db');
require('dotenv').config();

connectDB();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const secretKey = process.env.JWT_SECRET || 'defaultsecret';

// ✅ Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No token provided or bad format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Signup
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username.endsWith('@gmail.com')) {
      return res.status(403).json({ message: 'Only Gmail accounts allowed' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User exists' });

    const hashedPassword = await bcrypt.hash(password, 8);
    const role = (username === 'pragalathanabc28@gmail.com') ? 'admin' : 'user';

    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Signup error', error });
  }
});

// ✅ Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ username: user.username, role: user.role }, secretKey, {
      expiresIn: '2h', // longer token
    });

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
});

// ✅ Add Lead
app.post('/leads', verifyToken, async (req, res) => {
  try {
    const { company, contact, email, quantity, value } = req.body;
    const newLead = new Lead({ company, contact, email, quantity, value });
    await newLead.save();
    console.log('✅ Lead saved:', newLead);
    res.status(201).json({ message: 'Lead added' });
  } catch (error) {
    res.status(500).json({ message: 'Add lead error', error });
  }
});

// ✅ Get Leads
app.get('/leads', verifyToken, async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Fetch leads error', error });
  }
});

app.listen(3000, () => console.log('🚀 Server running on port 3000'));
