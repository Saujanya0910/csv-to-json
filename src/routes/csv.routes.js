const express = require('express');
const csvController = require('../controllers/csvController');
const { uploadCSV } = require('../middlewares/fileUploadMiddleware');

/**
 * CSV Routes
 * @returns {import('express').Router} Express router
 */
module.exports = function () {
  const router = express.Router();
  
  router.post('/process', uploadCSV, csvController.processCSV);
  
  return router;
};