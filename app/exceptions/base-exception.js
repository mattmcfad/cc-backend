'use strict';

class BaseException extends Error {

  constructor(message) {
    super(message);
    this.stack = (new Error(message)).stack;
  }

  toString() {
    return this.message; 
  }
}

module.exports = BaseException;
