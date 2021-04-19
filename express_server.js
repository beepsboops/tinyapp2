const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const { findUserByEmail, randomString, urlsForUser } = require(`./helpers`);

app.set("view engine", "ejs");

morgan = require('morgan');
app.use(morgan('dev'));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const bcrypt = require('bcrypt');

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

/////////
// DEV //
/////////

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// FOR CHECKING STATE OF URL DATABASE

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// FOR CHECKING STATE OF USER DATABASE

// app.get("/users.json", (req, res) => {
//   res.json(users);
// });


////////////
// URL DB //
////////////

// URL DB 2.0

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};

//////////////
// USERS DB //
//////////////

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "0fe99b": {
    "id": "0fe99b",
    "email": "tiny@tiny.com",
    "password": "$2b$10$YT8hvj9HhinN3ovJ8rpwDumJCK4VqbWukAko1vR7jLIsZOSus//Je"
  }
};

////////////////
// GET ROUTES //
////////////////

app.get("/", (req, res) => {
  res.send("Hello!");
});

// [GET] => MY URLS PAGE

app.get("/urls", (req, res) => {
  
  // Retrieve user from req.cookies
  let user = req.session.user_id;

  // Store in variable the result of calling "urlsForUser" function passing in "user" (logged in user) and "urlDatabase", which will return an object containing the URLs (ie key value pairs) (ie shortURL: longURL) associated with the current logged in user
  let urls = urlsForUser(user, urlDatabase);

  // Pass in "user" for conditional logic in _header.ejs so that it can know if a user is logged in or logged out
  // Pass in "users" (user DB) for conditional logic in _header.ejs so that email can be looked up and displayed in header
  // Pass in "urls" so that urls_index.ejs can display all urls associate with logged in user
  const templateVars = { user: user, users: users, urls: urls };
  res.render("urls_index", templateVars);
});

// [GET] => REGISTER

app.get("/register", (req, res) => {
  let user = req.session.user_id;

  // Pass in "user" for conditional logic in _header.ejs so that it can know if a user is logged in or logged out // If register button is visible, user should not exist ie user = false
  const templateVars = { user: user };
  res.render("register", templateVars);
});

// [GET] => LOGIN

app.get("/login", (req, res) => {
  let user = req.session.user_id;

  // Pass in "user" for conditional logic in _header.ejs so that it can know if a user is logged in or logged out // If register button is visible, user should not exist ie user = false
  const templateVars = { user: user };
  res.render("login", templateVars);
});

// [GET] => CREATE NEW URL/TINYURL PAGE

app.get("/urls/new", (req, res) => {
  let user = req.session.user_id;

  // If someone is not logged in when trying to access /urls/new, redirect them to the login page
  if (!user) {
    res.redirect("/login");
  }

  // If user = true
  // Pass in "user"  for conditional logic in _header.ejs so that it can know if a user is logged in or logged out
  // Pass in "users" (user DB) for conditional logic in _header.ejs so that email can be looked up and displayed in header
  const templateVars = { user: user, users: users };
  res.render("urls_new", templateVars);

});

// [GET] => NEW SHORT URL

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[req.params.shortURL].longURL;
  let user = req.session.user_id;

  // Pass in "user" for conditional logic in _header.ejs so that it can know if a user is logged in or logged out
  // Pass in "users" (user DB) for conditional logic in _header.ejs so that email can be looked up and displayed in header
  // Pass in "longURL" in order to display on urls_new.ejs
  // Pass in "shortURL" in order to display on urls_new.ejs // urls_new.ejs will handle redirect
  const templateVars = { user: user, users: users, longURL: longURL, shortURL: shortURL };
  res.render("urls_show", templateVars);
});

// [GET] => REDIRECT FROM SHORT URL TO LONG URL

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


/////////////////
// POST ROUTES //
/////////////////

// [POST] => CREATE NEW SHORT/TINY URL

app.post("/urls", (req, res) => {
  // Declare variable, store value of generated new random short URL by calling randomString function
  let shortURL = randomString();

  // Declare variable, store value of user inputed long URL
  let longURL = req.body.longURL;

  let user = req.session.user_id;

  // Update urlDatabase with new key value pair of shortURL and longURL
  urlDatabase[shortURL] = { longURL: longURL, userID: user };
  
  // Redirect to new page for shortURL
  res.redirect(`/urls/${shortURL}`);
});

// [POST] => REGISTRATION PAGE

app.post("/register", (req, res) => {
  
  // Pull data from req.body
  const uniqueUserID = randomString();
  const email = req.body.email;
  const password = req.body.password;

  // Respond with appropriate error if email or password are empty strings
  if (!email.length || !password.length) {
    res.send("status code 400: email & password can't be empty");
    return;
  }

  // Respond with appropriate error if email or password are empty strings
  if ("POST | register | findUserByEmail output:", findUserByEmail(email, users)) {
    res.send("status code 400: user already exists");
    return;
  }

  // Create hashed version of user sumbitted password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create new user object with data pulled from req.body and add this to users DB
  users[uniqueUserID] = { "id": uniqueUserID, "email": email, "password": hashedPassword };

  // Set user_id cookie containing the user's newly generated ID
  // res.cookie("user_id", uniqueUserID) // Deprecated
  req.session.user_id = uniqueUserID;

  // Redirect to /urls
  res.redirect("/urls");

});

// [POST] => LOGIN 2.0

app.post("/login", (req, res) => {
  
  // Extract needed data from req.body
  let submittedEmail = req.body.email;
  let submittedPassword = req.body.password;
  
  // Store in a variable individual user object by pulling out data via findUserByEmail function
  let individualUserObj = findUserByEmail(submittedEmail, users);

  // If user submitted email doesn't exist in individualUserObj, return error
  if (!individualUserObj) {
    res.send("status code 403: email can't be found");
    return;
  }
  
  // Store in a variable the password stored in individualUserObj
  let storedPassword = individualUserObj.password;

  // if submittedPassword doesn't match hashedPassword, return error
  if (bcrypt.compareSync(submittedPassword, storedPassword) === false) {
    res.send("status code 403: invalid password");
    return;
  }

  // Store in a variable the id in individualUserObj
  let storedUserID = individualUserObj.id;

  // Set user_id cookie with value of storedUserID
  req.session.user_id = storedUserID;

  // Redirect to /urls
  res.redirect("/urls");

});

// [POST] => LOGOUT 2.0

app.post("/logout", (req, res) => {

  // Clear cookie // Don't need to pass variables or pull info from req.cookies, as we already know the name of the key of the cookie that we want to clear - "user_id" // This should be passed as string
  // res.clearCookie("user_id"); // Deprecated
  req.session.user_id = null;

  res.redirect("/urls");
});

// [POST] => EDIT LONG URL

app.post("/urls/:shortURL/edit", (req, res) => {

  // Verify that a user is logged in, in order to deny unauthorized editing
  let user = req.session.user_id;

  if (!user) {
    return;
  }

  newLongURL = req.body.newLongURL;
  urlDatabase[req.params.shortURL].longURL = newLongURL;
  res.redirect("/urls");
});

// [POST] => DELETE URL

app.post("/urls/:shortURL/delete", (req, res) => {

  // Verify that a user is logged in, in order to deny unauthorized editing
  let user = req.session.user_id;

  if (!user) {
    return;
  }

  // Delete requested URL
  delete urlDatabase[req.params.shortURL];
  
  // Then redirect to /urls
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});