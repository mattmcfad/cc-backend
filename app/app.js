'use strict';

global.WINSTON = require('winston');

const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const databaseAPI = require('./apis/database-api');
const routes = require('./routes');
const app = express();

app.set('port', process.env.PORT || 3010);

app.disable('etag');

app.use(bodyParser.json());
app.use(morgan('dev'));
routes(app);

const server = http.createServer(app);

databaseAPI.createConnection((err) => {
  if (err) {
    global.WINSTON.error(err);
    process.exit(1);
  } else {
    server.listen(app.get('port'), () =>
      global.WINSTON.info(
        `Server started at ${new Date().toISOString()} on port ${app.get('port')}`
      )
    );
  }
});
