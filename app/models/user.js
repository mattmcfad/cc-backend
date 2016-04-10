'use strict';

class UserModel {

  constructor(mongoose) {
    this._moongoseRef = mongoose;
    this._generateSchema();
    this._generateModel();
  }

  _generateSchema() {
    this._schema = new this._moongoseRef.Schema({
      email: {
        type: String,
        required: true
      }
    }, {
      collection: 'users'
    });
  }

  _generateModel() {
    this._model = this._moongoseRef.model('User', this._schema);
  }

  getModel() {
    return this._model;
  }

}

module.exports = UserModel;
