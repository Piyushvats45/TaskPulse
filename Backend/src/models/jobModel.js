const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
    index: true,
  },

  attempts: {
    type: Number,
    default: 0,
  },

  maxAttempts: {
    type: Number,
    default: 3,
  },

  result: {
    type: Object,
    default: null,
  },

  error: {
    type: String,
    default: null,
  },

  scheduledAt: {
    type: Date,
    default: null,
  },

  processedAt: {
    type: Date,
    default: null,
  }

}, {
  timestamps: true
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;