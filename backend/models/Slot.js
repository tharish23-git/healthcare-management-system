const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  _id: { type: String }, // Forces Mongoose to treat IDs as strings
  date: String,
  time: String,
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: String, default: null }
}, { _id: false }); 

module.exports = mongoose.model('Slot', SlotSchema, 'slots');