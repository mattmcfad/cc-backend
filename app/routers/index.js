'use strict';

const userRoute = require('./user-router');
const authRoute = require('./auth-router');


module.exports = (server) => {
  authRoute.addRoutes(server, '/auth');
  userRoute.addRoutes(server, '/users');
};
