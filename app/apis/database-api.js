'use strict';

const logger = require('./logger-api');
const configResource = require('../services/config-service');
const BluePromise = require('bluebird');
const mongoose = require('mongoose');


function connect() {
  return new BluePromise((resolve, reject) => {
    mongoose.connect(configResource.getDBConnectionURI());
    const db = mongoose.connection;
    db.on('error', err => {
      logger.error(
        `Could not connected to database server on 
      '${configResource.getDBConnectionURI()}' due to error: + ${err}`
      );
      reject(err);
    });
    db.once('open', () => {
      logger.info(
        `Connected to database server on '${configResource.getDBConnectionURI()}'`
      );
      resolve();
    });
  });
}

function close() {
  mongoose.connection.close();
}

function dropDatabase() {
  mongoose.connection.db.dropDatabase();
}

module.exports = {
  connect,
  close,
  dropDatabase
};
