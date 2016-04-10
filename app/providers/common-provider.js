'use strict';

const UnimplementedException = require('../exceptions/unimplemented-exception');
const mongoose = require('mongoose');

class CommonProvider {

  constructor(models) {
    this._models = models;
  }

  getModelName() {
    throw new UnimplementedException('Not implemented');
  }

  insert(object, callback) {
    const entity = new this._models[this.getModelName()](object);

    entity.save((err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(result);
      }
    });
  }

  isIdValid(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  getById(id, callback) {
    if (this.isIdValid(id)) {
      const filter = {
        '_id': id
      };
      this._models[this.getModelName()].findOne(filter, (err, results) => {
        if (err) {
          const errMsg = global.TRANSLATION.create(
            'COMMON_PROVIDER.GENERAL_ERROR',
            JSON.stringify(err)
          );
          callback(errMsg);
        }
        callback(results);
      });
    } else {
      callback(null);
    }
  }

}

module.exports = CommonProvider;
