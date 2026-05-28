require('dotenv').config();
const dns = require("node:dns/promises");
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const Patient = require('./models/Patient');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Slot = require('./models/Slot');

// Apply DNS settings immediately
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("Database connection error:", err));

mongoose.connection.on('connected', () => console.log('Mongoose connected to DB'));

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'moh-healthcare', format: async () => 'png' },
});
const upload = multer({ storage: storage });


// Routes
app.post('/upload-patient', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.body.email) return res.status(400).json({ error: "Missing data" });
    const newPatient = new Patient({ email: req.body.email, fileUrl: req.file.path });
    await newPatient.save();
    res.status(201).json({ fileUrl: req.file.path });
  } catch (error) { 
    console.error("Save Error:", error);
    res.status(500).json({ error: error.message }); 
  }
});

// GET ALL SLOTS
app.get('/api/slots', async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE SLOT
app.post('/api/slots', async (req, res) => {
  try {
    const newSlot = new Slot({
      ...req.body,
      _id: Date.now().toString(),
      isBooked: false,
      bookedBy: null
    });
    await newSlot.save();
    res.status(201).json(newSlot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// BOOK/CANCEL SLOT
app.put('/api/slots/:id', async (req, res) => {
  try {
    const { isBooked, bookedBy } = req.body;
    // Using explicit _id match to fix the "Slot not found" error
    const updatedSlot = await Slot.findOneAndUpdate(
      { _id: req.params.id }, 
      { $set: { isBooked, bookedBy } },
      { returnDocument: 'after' }
    );
    if (!updatedSlot) return res.status(404).json({ error: "Slot not found" });
    res.json(updatedSlot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));