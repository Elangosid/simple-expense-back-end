const express = require("express");
const router = express.Router();
const {
  createExpense,
  getExpenses,
  deleteExpense,
  getSummary,
} = require("../controllers/expenseController");
const { expenseValidationRules } = require("../validations/expenseValidation");

router.post("/", expenseValidationRules, createExpense);
router.get("/", getExpenses);
router.get("/summary", getSummary);
router.delete("/:id", deleteExpense);

module.exports = router;
