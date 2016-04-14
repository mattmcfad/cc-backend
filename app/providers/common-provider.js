'use strict';

const mongoose = require('mongoose');
const Rx = require('rxjs');

/**
 * Creates a new record. All validations and restrictions at database
 * level are declared inside the corresponding model class, along with
 * its schema.
 * @param Model mongoose model
 * @param object
 * @returns Observable
 */
function insert(Model, object) {
  return Rx.Observable.create(observer => {
    const entity = new Model(object);
    entity.save((err, result) => {
      if (err) {
        observer.error(err);
      } else {
        observer.next(result);
      }
      observer.complete();
    });
  });
}

/**
 * This checks the record id is a valid mongo ObjectId.
 * @param id to be validated
 * @returns {boolean} true if is valid
 */
function isIdValid(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Gets the record by id.
 * @param model mongoose model
 * @param id that must be a valid ObjectId
 * @returns {*} null if id does not exist
 */
function getById(model, id) {
  return Rx.Observable.create(observer => {
    if (isIdValid(id)) {
      const filter = {
        '_id': id
      };
      model.findOne(filter, (err, results) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(results);
        }
        observer.complete();
      });
    } else {
      observer.next(null);
      observer.complete();
    }
  });
}

exports.insert = insert;
exports.getById = getById;
exports.isIdValid = isIdValid;
