'use strict';

const BluePromise = require('bluebird');
const bcrypt = require('bcrypt');


function encrypt(value) {
  return BluePromise.promisify(bcrypt.hash, {context: bcrypt})(value, 10);
}

function compare(value, hash) {
  return BluePromise.promisify(bcrypt.compare, {context: bcrypt})(value, hash);
}

exports.encrypt = encrypt;
exports.compare = compare;
