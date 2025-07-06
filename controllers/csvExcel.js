const Expense = require("../model/expense");
const path = require('path');
const { Parser } = require("json2csv");
const csv = require("csv-parser");
const fs = require("fs");

const USER_ID = "user-123";

exports.exportCSV = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: USER_ID });

    const fields = ["description", "amount", "category", "date"];
    const parser = new Parser({ fields });
    const csvData = parser.parse(expenses);
    console.log(csvData,"csvdata")
    const filename = `expenses-${Date.now()}.csv`;
    const downloadDir = path.join(__dirname, "..", "downloads");
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }
    const filePath = path.join(downloadDir, filename);
    console.log(filePath,"filepath")
    fs.writeFileSync(filePath, csvData);
    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/downloads/${filename}`;

    return res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error("Export error:", error);
    return res.status(500).json({ message: "Export failed" });
  }
};

exports.importCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file.path;
  const expenses = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      expenses.push({ ...row, userId: USER_ID });
    })
    .on("end", async () => {
      try {
        await Expense.insertMany(expenses);
        fs.unlinkSync(filePath); 
        res.json({ message: "Import successful", count: expenses.length });
      } catch (err) {
        console.error("DB Insert Error:", err);
        res.status(500).json({ message: "Import failed" });
      }
    });
};
