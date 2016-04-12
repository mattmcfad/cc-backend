'use strict';

const commonProvider = require('./common-provider');
const model = require('../models').User;

function insert(object) {
  return commonProvider.insert(model, object);
}

function getById(object) {
  return commonProvider.getById(model, object);
}

exports.insert = insert;
exports.getById = getById;
