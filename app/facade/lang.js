'use strict';

function isPresent(object) {
  return object !== null && object !== undefined;
}

function isBlank(object) {
  return object === null || object === undefined;
}

exports.isPresent = isPresent;
exports.isBlank = isBlank;
