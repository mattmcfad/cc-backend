'use strict';

const userRoute = require('./user-route');

/**
 * Add all application routes
 * @param app being started
 */
module.exports = (app) => {
  app.use('/users', userRoute);
};
