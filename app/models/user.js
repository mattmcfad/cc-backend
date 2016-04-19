'use strict';

function generateSchema(mongoose) {
  return new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      sparse: true
    },
    password: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    github: {
      type: String,
      unique: true,
      sparse: true
    },
    google: {
      type: String,
      unique: true,
      sparse: true
    },
    facebook: {
      type: String,
      unique: true,
      sparse: true
    }
  }, {
    collection: 'users'
  });
}

function generateUserModel(mongoose) {
  const schema = generateSchema(mongoose);
  return mongoose.model('User', schema);
}

module.exports = generateUserModel;
