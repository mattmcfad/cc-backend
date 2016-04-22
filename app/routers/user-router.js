'use strict';

const restify = require('restify');
const authRouter = require('./auth-router');
const userService = require('../services/user-service');
const lamb = require('lamb');
const postErrors = [
  'USER.ERROR.EMPTY_USER',
  'USER.ERROR.MULTIPLE_KEYS',
  'USER.ERROR.FIRST_NAME_MAX_LENGTH',
  'USER.ERROR.LAST_NAME_MAX_LENGTH',
  'USER.ERROR.EMPTY_PASSWORD'
];


function addRoutes(server, prefix) {
  server.post(
    prefix + '/', 
    (req, res, next) => userService.insert(req.body).then((result) => {
      res.send(201, result);
      return next();
    }).catch(err => {
      if (postErrors.indexOf(err) > -1) {
        return next(new restify.errors.BadRequestError(err));
      } else {
        return next(new restify.errors.InternalServerError(JSON.stringify(err)));
      }
    })
  );
  server.get(
    prefix + '/:id',
    authRouter.authenticate,
    (req, res, next) => {
      userService.findById(req.params.id).then(result => {
        if (lamb.isNil(result)) {
          return next( new restify.errors.ResourceNotFoundError('USER.ERROR.NOT_FOUND'));
        }
        res.send(200, result);
        return next();
      }).catch(err => {
        return next(new restify.errors.InternalServerError(JSON.stringify(err)));
      });
    }
  );
}

module.exports = {
  addRoutes
};
