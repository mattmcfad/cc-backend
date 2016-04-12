'use strict';

/**
 * Manages access to configs.json file located under configs folder.
 * This class always loads the configuration based on `process.env.ENV`
 */
const config = require('../configs/' + (process.env.ENV || 'dev'));


/**
 * Reads and builds database connection URI.
 * @returns string representing the db connection URI
 */
function getDBConnectionURI() {
  return config.MONGO_URI + config.MONGO_DB;
}

/**
 * Gets a configuration value by id
 * @param key used to get the value from config map
 * @returns configuration value
 */
function get(key) {
  return config[key];
}

exports.getDBConnectionURI = getDBConnectionURI;
exports.get = get;
