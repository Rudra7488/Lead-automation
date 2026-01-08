const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('./cron/crm-sync');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://lead-automation-frm0.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Route
app.use('/api/leads', require('./routes/leads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://rudrs3780_db_user:zK77lC9OB61femMR@cluster0.uqdpoqq.mongodb.net/lead-automation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  
  // Start the cron job
  cron.start();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});