'use strict';

const bunyan = require('bunyan');
const logger = bunyan.createLogger({
  name: 'CashCounter'
});

module.exports = logger;
