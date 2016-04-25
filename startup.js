'use strict';

const logger = require('./app/apis/logger-api');
const app = require('./app/app');


function startup() {
  const port = process.env.PORT || 3010;
  app.startup(port).then(() =>
    logger.info(
      `Server started at ${new Date().toISOString()} on port ${port}`
    )
  ).catch(err => {
    logger.error(err);
    process.exit(1);
  });
}

function shutdown() {
  logger.info('Received kill signal, shutdown server...');
  app.shutdown();
  logger.info('Server has been successfully shutdown');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startup();
