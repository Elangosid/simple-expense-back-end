const Expense = require('../model/expense');
const { validationResult } = require('express-validator');

const USER_ID = 'user-123';

exports.createExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { description, amount, category, date } = req.body;

  const expense = new Expense({ description, amount, category, date, userId: USER_ID });
  await expense.save();
  res.status(201).json(expense);
};

exports.getExpenses = async (req, res) => {
  const { search, category } = req.query;
  const query = { userId: USER_ID };

  if (search) {
    query.$or = [
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }
  if (category) {
    query.category = category;
  }

  const expenses = await Expense.find(query).sort({ date: -1 });
  res.json(expenses);
};

exports.deleteExpense = async (req, res) => {
  const result = await Expense.findOneAndDelete({ _id: req.params.id, userId: USER_ID });
  if (!result) return res.status(404).json({ message: 'Expense not found' });
  res.json({ message: 'Deleted successfully' });
};

exports.getSummary = async (req, res) => {
  const expenses = await Expense.find({ userId: USER_ID });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = {};
  expenses.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  res.json({ total, byCategory });
};
