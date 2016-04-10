'use strict';

const config = require('../configs/' + (process.env.ENV || 'dev'));

/**
 * Manages access to configs.json file located under configs folder.
 * This class always loads the configuration based on `process.env.ENV`
 */
class ConfigResource {

  /**
   * Reads and builds database connection URI.
   * @returns string representing the db connection URI
   */
  getDBConnectionURI() {
    return config.MONGO_URI + config.MONGO_DB;
  }

  /**
   * Gets a configuration value by id
   * @param key used to get the value from config map
   * @returns configuration value
   */
  get(key) {
    return config[key];
  }

}

const configResource = new ConfigResource();

module.exports = configResource;
