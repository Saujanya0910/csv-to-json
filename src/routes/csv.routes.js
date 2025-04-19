
/**
 * CSV Routes
 * @param {import('express').Application} app 
 */
module.exports = function (app) {
  const csvController = require('../controllers/csvController');
  
  app.post('/process-csv', csvController.processCSV);
};