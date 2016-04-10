'use strict';

const CommonProvider = require('./common-provider');
const models = require('../models');

class UserProvider extends CommonProvider {

  constructor(models) {
    super(models);
  }

  getModelName() {
    return this._models.User.modelName;
  }

}

const userProvider = new UserProvider(models);

module.exports = userProvider;
