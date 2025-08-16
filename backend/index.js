const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const Lead = require('./models/Lead');
const Record = require('./models/Record');
const Estimate = require('./models/Estimate');
const connectDB = require('./db');
const Invoice = require('./models/Invoice');
const Admin = require('./models/Admin');
const Member = require("./models/Member");
require('dotenv').config();

// ✅ Connect DB
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

// ✅ Helper Functions
function formatStatus(status = '') {
  const cleaned = status.trim().toLowerCase();
  if (cleaned === 'completed') return 'Completed';
  if (cleaned === 'processing') return 'Processing';
  if (cleaned === 'new') return 'New';
  if (cleaned === 'canceled') return 'Canceled';
  if (cleaned === 'delay') return 'Delay';
  return 'New'; // fallback
}

function formatPayment(payment = '') {
  const cleaned = payment.trim().toLowerCase();
  if (cleaned === 'paid') return 'Paid';
  if (cleaned === 'not yet') return 'Not Yet';
  return 'Not Yet'; // fallback
}

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
    const {
      company,
      contact,
      contactNumber,
      email,
      productName,
      quantity,
      value,
      address,
      status = 'New',
      paymentStatus = 'Not Yet',
    } = req.body;

    if (!company || !contact || !email || !quantity || !value || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newLead = new Lead({
      company: company.trim(),
      contact: contact.trim(),
      contactNumber,
      email: email.trim().toLowerCase(),
      productName: productName.trim(),
      quantity,
      value,
      address: address.trim(),
      status: formatStatus(status),
      paymentStatus: formatPayment(paymentStatus),
    });

    await newLead.save();
    res.status(201).json({ message: 'Lead added', lead: newLead });
  } catch (err) {
    res.status(500).json({ message: 'Add lead error', error: err });
  }
});

// ✅ Get All Leads
app.get('/leads', verifyToken, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leads', error: err });
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
    let records = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'No records provided' });
    }

    records = records.map((record) => {
      return {
        ...record,
        Status: formatStatus(record.Status),
        Payment: formatPayment(record.Payment),
        "Company Name": record["Company Name"]?.trim(),
        "Contact Name": record["Contact Name"]?.trim(),
        "Contact Number": record["Contact Number"]?.toString().trim(),
        Email: record.Email?.trim().toLowerCase(),
        "Product Name": record["Product Name"]?.trim(),
        Qty: record.Qty?.toString().trim(),
        Price: record.Price?.toString().trim(),
        Address: record.Address?.trim(),
      };
    });

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

// ✅ Delete Record by ID
app.delete('/records/:id', async (req, res) => {
  const id = req.params.id;

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

app.post('/sync-records-to-leads', async (req, res) => {
  try {
    const records = await Record.find();
    let updatedCount = 0;

    for (const record of records) {
      const email = record.Email?.trim().toLowerCase();
      const status = formatStatus(record.Status);
      const payment = formatPayment(record.Payment);

      const lead = await Lead.findOne({ email });
      if (lead) {
        lead.status = status;
        lead.paymentStatus = payment;
        await lead.save();
        updatedCount++;
      }
    }

    res.json({ message: `${updatedCount} leads updated from records.` });
  } catch (err) {
    console.error('❌ Sync error:', err);
    res.status(500).json({ message: 'Sync failed', error: err });
  }
});

// // POST Estimate
// app.post('/api/estimates', async (req, res) => {
//   try {
//     const estimate = new Estimate(req.body);
//     await estimate.save();
//     res.status(201).json({ message: 'Estimate saved successfully', estimate });
//   } catch (err) {
//     console.error('Error saving estimate:', err);
//     res.status(500).json({ message: 'Failed to save estimate' });
//   }
// });

// app.get('/api/estimates', async (req, res) => {
//   console.log('GET /api/estimates called');
//   try {
//     const estimates = await Estimate.find().sort({ createdAt: -1 });
//     res.json(estimates);
//   } catch (error) {
//     console.error('Error fetching estimates:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });



// // GET Estimate by ID
// app.get('/api/estimates/:id', async (req, res) => {
//   try {
//     const estimate = await Estimate.findById(req.params.id);
//     if (!estimate) return res.status(404).json({ message: 'Estimate not found' });
//     res.json(estimate);
//   } catch (err) {
//     console.error('Error fetching estimate by ID:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Save invoice
app.post("/api/invoices", async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    const saved = await invoice.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all invoices
app.get("/api/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update invoice
app.put("/api/invoices/:id", async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete invoice
app.delete("/api/invoices/:id", async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/admin", async (req, res) => {
  try {
    const { email } = req.body;

    let admin = await Admin.findOne({ email });

    if (admin) {
      // Update existing admin
      admin = await Admin.findOneAndUpdate({ email }, req.body, { new: true });
      return res.json({ message: "Admin updated successfully", admin });
    } else {
      // Create new admin
      const newAdmin = new Admin(req.body);
      await newAdmin.save();
      return res.json({ message: "Admin created successfully", admin: newAdmin });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Admin Details
app.get("/api/admin/:email", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.params.email });
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});




// ✅ GET all members
app.get("/api/members", async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// ✅ GET single member
app.get("/api/members/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch member" });
  }
});

// ✅ CREATE member
app.post("/api/members", async (req, res) => {
  try {
    const { name, phone, email, joiningDate, relievedDate } = req.body;
    const newMember = new Member({ name, phone, email, joiningDate, relievedDate });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ UPDATE member
app.put("/api/members/:id", async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMember) return res.status(404).json({ error: "Member not found" });
    res.json(updatedMember);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE member
app.delete("/api/members/:id", async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) return res.status(404).json({ error: "Member not found" });
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete member" });
  }
});


app.listen(3000, () => console.log('🚀 Server running on port 3000'));
