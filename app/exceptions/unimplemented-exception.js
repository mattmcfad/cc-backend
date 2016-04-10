'use strict';

const BaseException = require('./base-exception');

class UnimplementedException extends BaseException {

  constructor() {
    super('Unimplemented method cannot be called');
  }

}

module.exports = UnimplementedException;
