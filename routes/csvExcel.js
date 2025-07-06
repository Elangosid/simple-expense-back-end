const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { exportCSV, importCSV } = require("../controllers/csvExcel");

router.get("/export", exportCSV);
router.post("/import", upload.single("file"), importCSV);

module.exports = router;
