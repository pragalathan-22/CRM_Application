const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const Lead = require('./models/Lead');
const Record = require('./models/Record'); // ✅ NEW
const connectDB = require('./db');
require('dotenv').config();

connectDB();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const secretKey = process.env.JWT_SECRET || 'defaultsecret';

// ✅ JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No token or bad format' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Auth Routes
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username.endsWith('@gmail.com')) {
      return res.status(403).json({ message: 'Only Gmail accounts allowed' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User exists' });

    const hashedPassword = await bcrypt.hash(password, 8);
    const role = username === 'pragalathanabc28@gmail.com' ? 'admin' : 'user';

    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ username: user.username, role: user.role }, secretKey, {
      expiresIn: '2h',
    });

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err });
  }
});

// ✅ Lead Routes
app.post('/leads', verifyToken, async (req, res) => {
  try {
    const { company, contact, contactNumber, email, productName, quantity, value, address } = req.body;

    if (!company || !contact || !email || !quantity || !value || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newLead = new Lead({
      company,
      contact,
      contactNumber,
      email,
      productName,
      quantity,
      value,
      address,
    });

    await newLead.save();
    res.status(201).json({ message: 'Lead added', lead: newLead });
  } catch (err) {
    res.status(500).json({ message: 'Add lead error', error: err });
  }
});

app.get('/leads', verifyToken, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Fetch leads error', error: err });
  }
});

app.put('/leads/:id', verifyToken, async (req, res) => {
  try {
    const leadId = req.params.id;
    const updateData = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(leadId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ message: 'Lead updated successfully', lead: updatedLead });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err });
  }
});

app.delete('/leads/:id', verifyToken, async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err });
  }
});

app.get('/leads/:id', verifyToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching lead', error: err });
  }
});

// ✅ Excel Record Upload Route
app.post('/records/upload', async (req, res) => {
  try {
    const records = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'No records provided' });
    }

    await Record.insertMany(records);
    res.status(201).json({ message: `${records.length} records uploaded successfully` });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ message: 'Upload error', error: err });
  }
});


// ✅ Get All Records
app.get('/records', async (req, res) => {
  try {
    const records = await Record.find().select('-__v').sort({ _id: -1 });
    res.json(records);
  } catch (err) {
    console.error('❌ Error fetching records:', err);
    res.status(500).json({ message: 'Error fetching records', error: err });
  }
});


app.delete('/records/:id', async (req, res) => {
  const id = req.params.id;
  console.log('🗑️ DELETE request received for ID:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const deleted = await Record.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Record not found' });
    }
    return res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('❌ Delete failed:', err);
    return res.status(500).json({ message: 'Delete error', error: err });
  }
});



app.listen(3000, () => console.log('🚀 Server running on port 3000'));
