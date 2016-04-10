'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const db = {};

fs.readdirSync(__dirname).filter(file =>
  file.indexOf('.') !== 0 && file !== 'index.js'
).forEach(file => {
  const Model = require(path.join(__dirname, file));
  const modelRef = new Model(mongoose);
  db[modelRef.getModel().modelName] = modelRef.getModel();
});

module.exports = db;
