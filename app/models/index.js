'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const db = {};

fs.readdirSync(__dirname).filter(file =>
  file.indexOf('.') !== 0 && file !== 'index.js'
).forEach(file => {
  const model = require(path.join(__dirname, file))(mongoose);
  db[model.modelName] = model;
});

module.exports = db;
