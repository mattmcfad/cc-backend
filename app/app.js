'use strict';

const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const databaseAPI = require('./apis/database-api');
const routes = require('./routes');
const BluePromise = require('bluebird');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const lamb = require('lamb');
const app = express();


function setup(config) {
  const configResource = require('./services/config-service');
  app.set('port', config.port);
  if (config.disableCache) {
    app.disable('etag');
  }
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({
    name : configResource.getAppSessionName(),
    secret : configResource.getAppSessionSecret(),
    rolling : true,
    resave : false,
    saveUninitialized : false,
    cookie: {
      maxAge: 1800000
    }
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(morgan('dev'));
  routes(app);
}

const server = http.createServer(app);

function startup(config) {
  setup(config);
  return databaseAPI.connect().then(() =>
    BluePromise.promisify(server.listen, {context: server})(app.get('port'))
      .then(() => app)
  );
}

function shutdown() {
  if (!lamb.isNil(server)) {
    server.close();
    databaseAPI.close();
  }
}

exports.startup = startup;
exports.shutdown = shutdown;
exports.getApp = () => app;
