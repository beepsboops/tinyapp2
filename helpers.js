// [HELPER FUNCTION] => RANDOMSTRING

const randomString = function(length = 6) {
  return Math.random().toString(20).substr(2, length);
};
//////////////////////
// HELPER FUNCTIONS //
//////////////////////

// [HELPER FUNCTION] => FINDUSERBYEMAIL

const findUserByEmail = function(userEmail, users) {
  for (let key in users) {
    if (users[key].email === userEmail) {
      // console.log("findUserByEmail | true")
      // console.log("findUserByEmail | users[key]", users[key])
      return users[key];
    }
  }
  return false;
};

// [HELPER FUNCTION] => URLSFORUSER

const urlsForUser = function(loggedInUser, database) {
  let result = {};
  for (let key in database) {
    // let userURLs = database[key].longURL;
    // console.log("| LOG | finderUserURLs | userURLs:", userURLs);
    // console.log("| LOG | finderUserURLs | key output:", database[key].userID);
    if (loggedInUser === database[key].userID) {
      result[key] = database[key].longURL;
    }
  }
  // console.log("| LOG | finderUserURLs | result:", result)
  return result;
};

module.exports = { findUserByEmail, randomString, urlsForUser };