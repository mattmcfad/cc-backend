'use strict';

const configResource = require('../services/config-service');
const BluePromise = require('bluebird');
const mongoose = require('mongoose');

function connect() {
  return new BluePromise((resolve, reject) => {
    mongoose.connect(configResource.getDBConnectionURI());
    const db = mongoose.connection;
    db.on('error', err => {
      global.WINSTON.error(
        `Could not connected to database server on 
      '${configResource.getDBConnectionURI()}' due to error: + ${err}`
      );
      reject(err);
    });
    db.once('open', () => {
      global.WINSTON.info(
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

exports.connect = connect;
exports.close = close;
exports.dropDatabase = dropDatabase;
