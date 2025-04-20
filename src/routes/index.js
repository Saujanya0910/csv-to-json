const express = require('express');
const csvRoutes = require('./csv.routes');

/**
 * Application routes
 * @returns {import('express').Router} Express router
 */
module.exports = function () {
  const router = express.Router();

  // default route
  router.get('/', (_, res) => res.send('Hello World!'));

  // csv routes
  router.use('/csv', csvRoutes());
  
  return router;
}