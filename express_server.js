const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

morgan = require('morgan');
app.use(morgan('dev'));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());


  /////////
 // DEV //
/////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// FOR CHECKING STATE OF URL DATABASE

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// FOR CHECKING STATE OF USER DATABASE

app.get("/users.json", (req, res) => {
  res.json(users);
});


  ////////////
 // URL DB //
////////////

// URL DB 2.0

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};


// URB DB 1.0

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };


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
  }
}

  //////////////////////
 // HELPER FUNCTIONS //
//////////////////////

// [HELPER FUNCTION] => RANDOMSTRING

const randomString = function(length=6){
  return Math.random().toString(20).substr(2, length)
  }

// [HELPER FUNCTION] => FINDUSER

// let user_idValue = "user2RandomID"
// console.log("----------------------------------")
// console.log("findUser Func, userDB:", users)
// console.log("----------------------------------")
// console.log("findUser Func, individualUserObj2:", user_idValue)
// console.log("----------------------------------")
const findUser = function(user_idValue) {
  for (let property in users) {
    const individualUserObj2 = users[user_idValue];
    // console.log("findUser Func, property:", property)
    if (property === user_idValue) {
      return individualUserObj2
    }
  }
  return false;
};
// console.log("----------------------------------")
// console.log("findUser output:", findUser("user2RandomID"))
// console.log("----------------------------------")

// [HELPER FUNCTION] => FINDUSERBYEMAIL

const findUserByEmail = function (userEmail, users) {
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

const urlsForUser = function (loggedInUser, database) {
  let result = {}
  for (let key in database) {
    // let userURLs = database[key].longURL;
    // console.log("| LOG | finderUserURLs | userURLs:", userURLs);
    // console.log("| LOG | finderUserURLs | key output:", database[key].userID);
    if (loggedInUser === database[key].userID) {
      result[key] = database[key].longURL
    }
  }
  // console.log("| LOG | finderUserURLs | result:", result)
  return result;
};

  ////////////////
 // GET ROUTES //
////////////////

app.get("/", (req, res) => {
  res.send("Hello!");
});

// [GET] => MY URLS PAGE

app.get("/urls", (req, res) => {
  // console.log("GET | /urls | req.body:", req.body)
  // console.log("GET | /urls | req.session:", req.session)
  // console.log("GET | /urls | req.cookies:", req.cookies)
  // console.log("GET | /urls | req.cookies.user_id:", req.cookies.user_id)
  // console.log("GET | /urls | urlDatabase.longURL:", urlDatabase.longURL)
  
  // Retrieve user from req.cookies 
  let user = req.cookies.user_id

  // console.log("| GET | /urls | user:", user)
    
  // console.log("| GET | /urls | urlsForUser(user, urlDatabase):", urlsForUser(user, urlDatabase))

  // Store in variable the result of calling "urlsForUser" function passing in "user" (logged in user) and "urlDatabase", which will return an object containing the URLs (ie key value pairs) (ie shortURL: longURL) associated with the current logged in user
  let urls = urlsForUser(user, urlDatabase);
  
  // console.log("| LOG | GET | /urls | urls:", urls)

  // Pass in "user" for conditional logic in _header.ejs so that it can know if a user is logged in or logged out
  // Pass in "users" (user DB) for conditional logic in _header.ejs so that email can be looked up and displayed in header
  // Pass in "urls" so that urls_index.ejs can display all urls associate with logged in user
  const templateVars = { user: user, users: users, urls: urls };
  res.render("urls_index", templateVars);
});

// [GET] => REGISTER

app.get("/register", (req, res) => {
  let user = req.cookies.user_id

  // Pass in "user" for conditional logic in _header.ejs so that it can know if a user is logged in or logged out // If register button is visible, user should not exist ie user = false
  const templateVars = { user: user };
  res.render("register", templateVars);
});

// [GET] => LOGIN

app.get("/login", (req, res) => {
  let user = req.cookies.user_id

  // Pass in "user" for conditional logic in _header.ejs so that it can know if a user is logged in or logged out // If register button is visible, user should not exist ie user = false
  const templateVars = { user: user };
  res.render("login", templateVars)
});

// [GET] => CREATE NEW URL/TINYURL PAGE

app.get("/urls/new", (req, res) => {
  let user = req.cookies.user_id

  // If someone is not logged in when trying to access /urls/new, redirect them to the login page
  if (!user) {
    res.redirect("/login")
  }

    // If user = true
    // Pass in "user"  for conditional logic in _header.ejs so that it can know if a user is logged in or logged out
    // Pass in "users" (user DB) for conditional logic in _header.ejs so that email can be looked up and displayed in header
    const templateVars = { user: user, users: users };
    res.render("urls_new", templateVars);

});

// [GET] => NEW SHORT URL

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL
  let longURL = urlDatabase[req.params.shortURL].longURL
  let user = req.cookies.user_id

  // Pass in "user" for conditional logic in _header.ejs so that it can know if a user is logged in or logged out
  // Pass in "users" (user DB) for conditional logic in _header.ejs so that email can be looked up and displayed in header
  // Pass in "longURL" in order to display on urls_new.ejs
  // Pass in "shortURL" in order to display on urls_new.ejs // urls_new.ejs will handle redirect  
  const templateVars = { user: user, users: users, longURL: longURL, shortURL: shortURL };
  res.render("urls_show", templateVars);
});

// [GET] => REDIRECT FROM SHORT URL TO LONG URL

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL)
});


  //////////////////
 // POST ROUTES //
////////////////

// [POST] => CREATE NEW SHORT/TINY URL

app.post("/urls", (req, res) => {
  // Declare variable, store value of generated new random short URL by calling randomString function
  let shortURL = randomString()

  // Declare variable, store value of user inputed long URL
  let longURL = req.body.longURL

  // console.log("post /urls short URL", shortURL)
  // console.log("post /urls long URL", longURL)
  
  // Update urlDatabase with new key value pair of shortURL and longURL
  urlDatabase[shortURL] = longURL;

  // console.log("urlDatabase", urlDatabase)
  // console.log("req.params", req.params.shortURL)
  
  // Redirect to new page for shortURL
  res.redirect(`/urls/${shortURL}`);
});

// [POST] => REGISTRATION PAGE

app.post("/register", (req, res) => {

  // console.log("POST register req.body", req.body)
  
  // Pull data from req.body
  const uniqueUserID = randomString();
  const email = req.body.email;
  const password = req.body.password;

  // console.log("POST register id", uniqueUserID)
  // console.log("POST register email", email)
  // console.log("POST register password", password)

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

  // Create new user object with data pulled from req.body and add this to users DB
  users[uniqueUserID] = { "id": uniqueUserID, "email": email, "password": password }

  // console.log("POST register usersDB", users)

  // Set user_id cookie containing the user's newly generated ID
  res.cookie("user_id", uniqueUserID)

  // console.log("POST register req.cookies", req.cookies)

  // Redirect to home page
  res.redirect("/urls")

});

// [POST] => LOGIN 2.0

app.post("/login", (req, res) => {
  
  // Extract needed data from req.body
  let submittedEmail = req.body.email;
  let submittedPassword = req.body.password;

  // console.log("POST | LOGIN 2.0 | submitted email:", submittedEmail)
  // console.log("POST | LOGIN 2.0 | submitted password:", submittedPassword)
  
  // Store in a variable individual user object by pulling out data via findUserByEmail function
  let individualUserObj = findUserByEmail(submittedEmail, users)

  // console.log("POST | LOGIN 2.0 | individualUserObj output:", individualUserObj)

  // If user submitted email doesn't exist in individualUserObj, return error
  if (!individualUserObj) {
    res.send("status code 403: email can't be found");
    return;
  };
  
  // Store in a variable the password stored in individualUserObj 
  let storedPassword = individualUserObj.password

  console.log("POST | LOGIN 2.0 | storedPassword:", storedPassword)

  // if submittedPassword doesn't match storedPassword, return error
  if (submittedPassword !== storedPassword) {
    // console.log("POST | LOGIN 2.0 | (submittedPassword === storedPassword) = false")
    res.send("status code 403: invalid password");
    return;
  };

  // Store in a variable the id in individualUserObj
  let storedUserID = individualUserObj.id

  // console.log("POST | LOGIN 2.0 | storedUserID:", storedUserID)

  // Set user_id cookie with value of storedUserID
  res.cookie("user_id", storedUserID);

  // Redirect to /urls
  res.redirect("/urls")

});

// [POST] => LOGOUT 2.0

app.post("/logout", (req, res) => {
  // console.log("POST Logout 2.0 req.body:", req.body);
  // console.log("POST Logout 2.0 req.cookies:", req.cookies);

  // Clear cookie // Don't need to pass variables or pull info from req.cookies, as we already know the name of the key of the cookie that we want to clear - "user_id" // This should be passed as string
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// [POST] => DELETE URL

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// [POST] => EDIT LONG URL

app.post("/urls/:shortURL/edit", (req, res) => {
  // console.log("POST Edit req.body", req.body)
  newLongURL = req.body.newLongURL
  // console.log("POST Edit newLongURL", newLongURL)
  // console.log("POST Edit req.params.shortURL", req.params.shortURL)
  urlDatabase[req.params.shortURL] = newLongURL;
  res.redirect("/urls");
});


  ////////////////
 // DEPRECATED //
////////////////

// [POST] => => LOGIN 1.0 VIA NAV BAR

/*
app.post("/login", (req, res) => {
  // console.log("POST Login", req.body)
  let username = req.body.username;
  // console.log("POST Login username", username)
  res.cookie("username", username);
  res.redirect("/urls");
});
*/

// [POST] => LOGOUT 1.0 VIA NAV BAR

/*
app.post("/logout", (req, res) => {
  // console.log("POST Logout req.body:", req.body);
  // console.log("POST Logout req.cookies:", req.cookies);
  let username = req.cookies.username
  // console.log("POST Logout username:", username)
  res.clearCookie("username");
  res.redirect("/urls");
});
*/