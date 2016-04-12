'use strict';

const lang = require('../facade/lang');
const userProvider = require('../providers/user-provider');
const Rx = require('rxjs');

function validateUser(object) {
  return lang.isPresent(object) && lang.isPresent(object.email);
}

function insert(object) {
  return Rx.Observable.create(observer => {
    if (!validateUser(object)) {
      observer.error('USER.ERROR.MISSING_REQUIRED_FIELD');
    } else {
      userProvider.insert(object).subscribe(result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });
    }
  });
}

function getById(id) {
  return userProvider.getById(id);
}

exports.insert = insert;
exports.getById = getById;
exports.validateUser = validateUser;
