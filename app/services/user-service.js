'use strict';

const lamb = require('lamb');
const BluePromise = require('bluebird');
const userProvider = require('../providers/user-provider');
const encryptService = require('./encryption-service');


function countUserKeys(user) {
  let key = 0;
  if (!lamb.isNil(user.email)) {
    key++;
  }
  if (!lamb.isNil(user.google)) {
    key++;
  }
  if (!lamb.isNil(user.facebook)) {
    key++;
  }
  if (!lamb.isNil(user.github)) {
    key++;
  }
  return key;
}

function validateUser(user) {
  if (lamb.isNil(user)) {
    return BluePromise.reject('USER.ERROR.EMPTY_USER');
  }
  const keyQty = countUserKeys(user);
  if (keyQty > 1) {
    return BluePromise.reject('USER.ERROR.MULTIPLE_KEYS');
  } else if (keyQty < 1) {
    return BluePromise.reject('USER.ERROR.EMPTY_KEY');
  }
  if (!lamb.isNil(user.firstName) && user.firstName.length > 20) {
    return BluePromise.reject('USER.ERROR.FIRST_NAME_MAX_LENGTH');
  }
  if (!lamb.isNil(user.lastName) && user.lastName.length > 50) {
    return BluePromise.reject('USER.ERROR.LAST_NAME_MAX_LENGTH');
  }
  if (!lamb.isNil(user.email)) {
    if (lamb.isNil(user.password)) {
      return BluePromise.reject('USER.ERROR.EMPTY_PASSWORD');
    } else {
      return encryptService.encrypt(user.password).then(hash =>
        user.password = hash
      );
    }
  } else {
    return BluePromise.resolve();
  }
}

function insert(object) {
  return validateUser(object).then(() =>
    userProvider.insert(object)
  );
}

function findById(id) {
  return userProvider.findById(id);
}

function findByEmail(email) {
  return userProvider.findByEmail(email);
}

function findOne(filter) {
  return userProvider.findOne(filter);
}

exports.validateUser = validateUser;
exports.insert = insert;
exports.findById = findById;
exports.findByEmail = findByEmail;
exports.findOne = findOne;
