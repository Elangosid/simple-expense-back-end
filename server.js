const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expense');
const csvExcel = require('./routes/csvExcel');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/downloads', express.static('downloads'));
app.use('/api/expenses', csvExcel);
app.use('/api/expenses', expenseRoutes);

app.get('/api/hello', (req, res) => {
  console.log('Hello API hit');
  res.json({ message: 'Hello, Node!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
