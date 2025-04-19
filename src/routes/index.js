
/**
 * Application routes
 * @param {import('express').Application} app 
 */
module.exports = function (app) {
  const csvRoutes = require('./csv.routes');

  // default route
  app.get('/', (_, res) => res.send('Hello World!'));

  // csv routes
  app.use('/csv', csvRoutes(app));
}