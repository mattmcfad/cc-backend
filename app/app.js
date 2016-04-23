'use strict';

const restify = require('restify');
const bluebird = require('bluebird');
const lamb = require('lamb');
const CookieParser = require('restify-cookies');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');
const databaseAPI = require('./apis/database-api');
const routers = require('./routers');
const configService = require('./services/config-service');
const server = restify.createServer({
  name: 'CashCounter'
});


function setup() {
  server.use(restify.bodyParser());
  server.use(restify.queryParser());
  server.use(restify.acceptParser(server.acceptable));
  server.use(CookieParser.parse);
  server.use(session({
    name : configService.getAppSessionName(),
    secret : configService.getAppSessionSecret(),
    rolling : true,
    resave : false,
    saveUninitialized : false,
    cookie: {
      maxAge: 1800000
    }
  }));
  server.use(flash());
  server.use(passport.initialize());
  server.use(passport.session());
  server.use(morgan('dev'));
  server.get(
    '/foo/:id',
    function(req, res, next) {
      console.log('Authenticate');
      return next();
    },
    function(req, res, next) {
      res.send(200, {test: 'aiuehaiuehaiueh'});
      return next();
    }
  );
  routers(server);
}

function startup(port) {
  setup();
  return databaseAPI.connect().then(() =>
    bluebird.promisify(server.listen, {context: server})(port)
  );
}

function shutdown() {
  if (!lamb.isNil(server)) {
    server.close();
    databaseAPI.close();
  }
}

module.exports = {
  startup,
  shutdown
};
