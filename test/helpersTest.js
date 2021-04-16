const { assert } = require('chai');

const { findUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    console.log(assert.equal(user.id, expectedOutput));
  });
});

describe('findUserByEmail', function() {
  it('should return undefinded with non-existent email', function() {
    const user = findUserByEmail("lighthouse@example.com", testUsers)
    const expectedOutput = undefined;
    console.log(assert.equal(user.id, expectedOutput));
  });
});