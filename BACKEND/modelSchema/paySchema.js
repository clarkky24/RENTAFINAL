const mongoose = require('mongoose');

const PaymentProofSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // New email field to associate the proof with a user
  email: {
    type: String,
    required: true,
  },
  buildingName: {
    type: String,
    required: true,
    enum: ['Lalaine', 'Jade'],
  },
  roomNumber: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    required: true,
    enum: ['Reservation', 'Rent Payment', 'Miscellaneous'],
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  transactionId: {
    type: String,
    default: '',
  },
  fileName: {
    type: String,
    required: true,
  },
  // Confirmation system: status updated by the admin
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'disapproved'],
    default: 'pending',
  },
  // Optional note from the admin (only visible to admin)
  adminNote: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Pay = mongoose.model('Pay', PaymentProofSchema);
module.exports = Pay;
