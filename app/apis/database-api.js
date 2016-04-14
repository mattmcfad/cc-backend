'use strict';

const mongoose = require('mongoose');
const configResource = require('../resources/config-resource');
const Rx = require('rxjs');

function createConnection() {
  return Rx.Observable.create(observer => {
    mongoose.connect(configResource.getDBConnectionURI());
    const db = mongoose.connection;
    db.on('error', (err) => {
      if (err) {
        global.WINSTON.error(
          `Could not connected to database server on 
        '${configResource.getDBConnectionURI()}' due to error: + ${err}`
        );
        observer.error(err);
        observer.complete();
      }
    });
    db.once('open', () => {
      global.WINSTON.info(
        `Connected to database server on '${configResource.getDBConnectionURI()}'`
      );
      observer.next();
      observer.complete();
    });
  });
}

function closeConnection() {
  mongoose.connection.close();
}

function dropDatabase() {
  mongoose.connection.db.dropDatabase();
}

exports.createConnection = createConnection;
exports.closeConnection = closeConnection;
exports.dropDatabase = dropDatabase;
