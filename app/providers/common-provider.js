'use strict';

const BluePromise = require('bluebird');
const mongoose = BluePromise.promisifyAll(require('mongoose'));


function insert(Model, object) {
  return new Model(object).save();
}

function isIdValid(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function findOne(model, filter) {
  return model.findOne(filter);
}

function findById(model, id) {
  return isIdValid(id) ? findOne(model, {'_id': id}) : BluePromise.resolve(null);
}

module.exports = {
  insert,
  findById,
  findOne,
  isIdValid
};
