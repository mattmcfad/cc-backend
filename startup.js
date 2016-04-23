'use strict';

global.WINSTON = require('winston');

const app = require('./app/app');


function startup() {
  const port = process.env.PORT || 3010;
  app.startup(port).then(() =>
    global.WINSTON.info(
      `Server started at ${new Date().toISOString()} on port ${port}`
    )
  ).catch(err => {
    global.WINSTON.error(err);
    process.exit(1);
  });
}


function shutdown() {
  global.WINSTON.info('Received kill signal, shutdown server...');
  app.shutdown();
  global.WINSTON.info('Server has been successfully shutdown');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startup();
