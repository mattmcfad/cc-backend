'use strict';

global.WINSTON = require('winston');

const app = require('../../../app/app');
const databaseUtil = require('../../../app/apis/database-api');
const sinon = require('sinon');
const configResource = require('../../../app/resources/config-resource');

/**
 * Mock config resource so we can run against test database instead of
 * regular database.
 * Better doing this here so we don't put test code inside app folder.
 */
sinon.stub(configResource, 'getDBConnectionURI', () =>
  configResource.get('MONGO_TEST_URI') + configResource.get('MONGO_TEST_DB')
);

/**
 * Start up the server, clean up the database before running tests.
 */
before(function(done) {
  this.timeout(5000);
  const port = configResource.get('NODE_TEST_PORT');
  const source = app.startup({
    port: port,
    disableCache: true
  });
  source.subscribe((app) => {
    global.WINSTON.info(
      `Server started at ${new Date().toISOString()} on port ${app.get('port')}`
    );
    databaseUtil.dropDatabase();
    global.WINSTON.info(
      'Test database was successfully cleaned up before execution'
    );
    global.WINSTON.info('Start running API tests...');
    done();
  });
});

/**
 * Restore mocked methods and shutdown server so gulp task can be
 * terminated.
 */
after(done => {
  app.shutdown();
  configResource.getDBConnectionURI.restore();
  done();
});
