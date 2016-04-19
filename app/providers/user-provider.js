'use strict';

const commonProvider = require('./common-provider');
const model = require('../models').User;


function insert(object) {
  return commonProvider.insert(model, object);
}

function findById(id) {
  return commonProvider.findById(model, id);
}

function findByEmail(email) {
  return commonProvider.findOne(model, {email});
}

function findOne(filter) {
  return commonProvider.findOne(model, filter);
}

exports.insert = insert;
exports.findById = findById;
exports.findByEmail = findByEmail;
exports.findOne = findOne;
