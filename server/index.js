require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// MongoDB Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'portfolio';
const CONTACTS_COLLECTION = 'contacts';
const ADMIN_COLLECTION = 'admins';

let db;
let contactsCollection;
let adminsCollection;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectToMongoDB = async () => {
   try {
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 30000,
      // Remove directConnection: true for Atlas connections
      // Add these options for better stability with Atlas
      retryWrites: true,
      w: 'majority',
       tls: true,
      tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development'
    });
    await client.connect();
    db = client.db(DB_NAME);
    contactsCollection = db.collection(CONTACTS_COLLECTION);
    adminsCollection = db.collection(ADMIN_COLLECTION);
    
    // Seed admin account if none exists
    await seedAdminAccount();
    
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    
    // Additional debugging for SSL errors
    if (error.cause && error.cause.code === 'ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR') {
      console.error('\n=== SSL/TLS Error Debugging ===');
      console.error('This is a known issue on Windows with MongoDB Atlas.');
      console.error('Possible solutions:');
      console.error('1. Check if your MongoDB Atlas cluster is paused (free tier)');
      console.error('2. Check your IP address is whitelisted in Atlas');
      console.error('3. Try upgrading Node.js to the latest LTS version');
      console.error('4. Check if a VPN/proxy is interfering');
      console.error('================================\n');
    }
    
    process.exit(1);
  }
};

// Seed default admin account
const seedAdminAccount = async () => {
  try {
    const adminCount = await adminsCollection.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = {
        username: 'admin',
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };
      await adminsCollection.insertOne(admin);
      console.log('Default admin account created: admin / admin123');
    }
  } catch (error) {
    console.error('Error seeding admin account:', error);
  }
};

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find admin by username
    const admin = await adminsCollection.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      username: admin.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all contacts (protected - requires authentication)
app.get('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await contactsCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to read contacts' });
  }
});

// Delete a contact (protected - requires authentication)
app.delete('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contactsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Submit contact form (public - no auth required)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, telephone, subject, message, type } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Name, email, and message are required fields' 
      });
    }
    
    // Create new contact object
    const newContact = {
      name,
      email,
      telephone: telephone || '',
      subject: subject || '',
      message,
      type: type || 'general',
      createdAt: new Date().toISOString()
    };
    
    // Insert into MongoDB
    const result = await contactsCollection.insertOne(newContact);
    
    // Add the inserted ID to the contact object
    newContact.id = result.insertedId.toString();
    
    console.log('New contact submission:', newContact);
    
    res.status(201).json({ 
      message: 'Contact form submitted successfully!',
      contact: newContact
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Start server only after MongoDB connection is established
const startServer = async () => {
  await connectToMongoDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
