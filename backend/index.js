const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const secretKey = process.env.JWT_SECRET || 'defaultsecret';

// Connect to MongoDB
connectDB();

// JWT Middleware
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return res.status(403).send({ message: 'No token provided' });

    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(500).send({ message: 'Failed to authenticate token', error });
    }
};

app.post('/signup', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Only allow Gmail addresses
    if (!username.endsWith('@gmail.com')) {
      return res.status(403).send({ message: 'Only Gmail accounts allowed' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user' // Set role
    });

    await newUser.save();

    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error registering user', error });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).send({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).send({ message: 'Invalid password' });

    const token = jwt.sign(
      { username: user.username, role: user.role },
      secretKey,
      { expiresIn: '1h' }
    );

    res.send({ token, role: user.role }); // send role to frontend
  } catch (error) {
    res.status(500).send({ message: 'Error logging in', error });
  }
});


// Protected Profile Route
app.get('/profile', verifyToken, (req, res) => {
    res.send({ message: 'Welcome to your profile', user: req.user });
});

// Public Route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start Server
app.listen(3000, () => console.log('🚀 Server is running on port 3000'));


