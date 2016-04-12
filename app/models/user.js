'use strict';

function generateSchema(mongoose) {
  return new mongoose.Schema({
    email: {
      type: String,
      required: true
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
