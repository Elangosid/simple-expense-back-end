const { body } = require("express-validator");

exports.expenseValidationRules = [
  body("description").isString().notEmpty(),
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("category").isString().notEmpty(),
  body("date").isISO8601().toDate(),
];
