'use strict';

const mongoose = require('mongoose');
const configResource = require('../resources/config-resource');

class DatabaseAPI {

  constructor(mongoose) {
    this._mongoose = mongoose;
  }

  createConnection(next) {
    mongoose.connect(configResource.getDBConnectionURI());
    const db = mongoose.connection;
    db.on('error', (err) => {
      if (err) {
        global.WINSTON.error(
          `Could not connected to database server on 
          '${configResource.getDBConnectionURI()}' due to error: + ${err}`
        );
        next(err);
      }
    });
    db.once('open', () => {
      global.WINSTON.info(
        `Connected to database server on '${configResource.getDBConnectionURI()}'`
      );
      next();
    });
  }

  closeConnection() {
    this._mongoose.connection.close();
  }

  getCollections(done) {
    return this._mongoose.connection.db.collections(done);
  }

}

const databaseAPI = new DatabaseAPI(mongoose);

module.exports = databaseAPI;
