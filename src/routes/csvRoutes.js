const express = require('express');
const multer = require('multer');
const path = require('path');
const csvController = require('../controllers/csvController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.CSV_UPLOAD_PATH || path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.csv');
  }
});

const upload = multer({ storage });

const router = express.Router();

// CSV processing routes
router.post('/process', upload.single('csvFile'), csvController.processCSV);

module.exports = router;
