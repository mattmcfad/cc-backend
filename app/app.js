'use strict';

const restify = require('restify');
const bluebird = require('bluebird');
const lamb = require('lamb');
const CookieParser = require('restify-cookies');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const databaseApi = require('./apis/database-api');
const logger = require('./apis/logger-api');
const configService = require('./services/config-service');
const routers = require('./routers');
const server = restify.createServer({
  name: 'CashCounter',
  log: logger
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
  server.on('after', restify.auditLogger({
    log: logger,
    body: true
  }));
  server.use(flash());
  server.use(passport.initialize());
  server.use(passport.session());
  routers(server);
}

function startup(port) {
  setup();
  return databaseApi.connect().then(() =>
    bluebird.promisify(server.listen, {context: server})(port)
  );
}

function shutdown() {
  if (!lamb.isNil(server)) {
    server.close();
    databaseApi.close();
  }
}

module.exports = {
  startup,
  shutdown
};
