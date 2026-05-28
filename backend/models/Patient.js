const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  email: { type: String, required: true },
  fileUrl: String,
  patientEmail: String,
  content: String
});

// Check if the model already exists, if not, create it
module.exports = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);