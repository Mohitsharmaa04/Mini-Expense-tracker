const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// 1. GET ALL EXPENSES
// Route: GET /api/expenses
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    const query = {};

    // 1. Filter by category if provided
    if (category) {
      query.category = category;
    }

    // 2. Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end of the day (23:59:59.999) to include the entire end date
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Fetch filtered expenses and sort by date (newest first)
    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching expenses', error: error.message });
  }
});

// 2. CREATE NEW EXPENSE
// Route: POST /api/expenses
router.post('/', async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;

    // Create a new expense instance
    const newExpense = new Expense({
      amount,
      category,
      date: date || undefined, // If no date provided, default schema value is used
      note,
    });

    // Save to the database
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    // If validation fails (e.g. negative amount, future date)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while creating expense', error: error.message });
  }
});

// 3. GET SUMMARY STATISTICS
// Route: GET /api/expenses/summary
router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    // Get start of the current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Get end of the current month
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // A. Total expenses this calendar month
    const totalThisMonthArr = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    const totalThisMonth = totalThisMonthArr.length > 0 ? totalThisMonthArr[0].total : 0;

    // B. Expenses per category (overall breakdown)
    const categoryBreakdown = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);
    const formattedCategoryBreakdown = categoryBreakdown.map(item => ({
      category: item._id,
      total: item.total
    }));

    // C. Highest single expense this month
    const highestThisMonth = await Expense.findOne({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ amount: -1 });

    // D. Highest single expense overall
    const highestOverall = await Expense.findOne().sort({ amount: -1 });

    res.json({
      totalThisMonth,
      categoryBreakdown: formattedCategoryBreakdown,
      highestThisMonth,
      highestOverall
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while calculating summary', error: error.message });
  }
});

// 4. UPDATE AN EXPENSE
// Route: PUT /api/expenses/:id
router.put('/:id', async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;

    // Find the expense by its ID
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Apply updates if they are provided in the request body
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;
    if (note !== undefined) expense.note = note;

    // Save the updated document (runs validators)
    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while updating expense', error: error.message });
  }
});

// 4. DELETE AN EXPENSE
// Route: DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    // Find the expense by its ID
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Delete the expense
    await expense.deleteOne();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting expense', error: error.message });
  }
});

module.exports = router;
