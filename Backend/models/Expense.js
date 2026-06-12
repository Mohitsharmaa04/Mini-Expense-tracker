const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: 'Date cannot be in the future',
      },
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // Auto-manage createdAt and updatedAt
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
