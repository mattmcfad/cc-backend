'use strict';

const userRoute = require('./user-route');
const authRoute = require('./auth-route');


/**
 * This function needs to be removed after authorizatino is implemented
 * Now we don't restrict operations, if user is authenticated it can do anything
 */
function authenticate() {
  return (req, res, next) =>
    req.isAuthenticated() ? next() : res.status(401).end();
}

module.exports = (app) => {
  app.use('/auth', authRoute);
  app.use(authenticate());
  app.use('/users', userRoute);
};
