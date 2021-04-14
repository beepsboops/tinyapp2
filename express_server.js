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

// FOR CHECKING STATE OF URL DATABASE
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// FOR CHECKING STATE OF USER DATABASE
app.get("/users.json", (req, res) => {
  res.json(users);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


  ////////////
 // URL DB //
////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  }
}

  //////////////////////
 // HELPER FUNCTIONS //
//////////////////////

// RANDOMSTRING FUNCTION
const randomString = function(length=6){
  return Math.random().toString(20).substr(2, length)
  }

// FINDUSER FUNCTION
// let user_idValue = "user2RandomID"
// console.log("----------------------------------")
// console.log("findUser Func, userDB:", users)
// console.log("----------------------------------")
// console.log("findUser Func, individualUserOb:", user_idValue)
// console.log("----------------------------------")
const findUser = function(user_idValue) {
  for (let property in users) {
    const individualUserObj = users[user_idValue];
    // console.log("findUser Func, property:", property)
    if (property === user_idValue) {
      return individualUserObj
    }
  }
  return false;
};
// console.log("----------------------------------")
// console.log("findUser output:", findUser("user2RandomID"))
// console.log("----------------------------------")
  /////////////////
 // GET ROUTES //
///////////////

app.get("/", (req, res) => {
  res.send("Hello!");
});

// GET // => MY URLS PAGE
app.get("/urls", (req, res) => {
  let userObj = findUser(req.cookies.user_id)
  console.log(userObj)
  const templateVars = { urls: urlDatabase, userObj: userObj };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {username: req.cookies["username"] }
  res.render("register", templateVars)
});

// GET // => CREATE NEW URL/TINYURL PAGE
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

// GET // => NEW SHORT URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});


  //////////////////
 // POST ROUTES //
////////////////

// POST // => CREATE NEW SHORT/TINY URL
app.post("/urls", (req, res) => {
  // Declare variable, store value of generated new random short URL by calling randomString function
  let shortURL = randomString()

  // Declare variable, store value of user inputed long URL
  let longURL = req.body.longURL

  console.log("post /urls short URL", shortURL)
  console.log("post /urls long URL", longURL)
  
  // Update urlDatabase with new key value pair of shortURL and longURL
  urlDatabase[shortURL] = longURL;

  console.log("urlDatabase", urlDatabase)
  console.log("req.params", req.params.shortURL)
  
  // Redirect to new page for shortURL
  res.redirect(`/urls/${shortURL}`);
});

// POST // => REGISTRATION PAGE
app.post("/register", (req, res) => {

  console.log("POST register req.body", req.body)
  
  // Pull data from req.body
  const userRandomID = randomString();
  const email = req.body.email;
  const password = req.body.password;

  console.log("POST register id", userRandomID)
  console.log("POST register email", email)
  console.log("POST register password", password)

  // Add pulled data as new user object to users DB
  users[userRandomID] = { "id": userRandomID, "email": email, "password": password }

  console.log("POST register usersDB", users)

  // Set user_id cookie containing the user's newly generated ID
  res.cookie("user_id", userRandomID)

  console.log("POST register req.cookies", req.cookies)

  // Redirect to home page
  res.redirect("/urls")

});

// POST // => REDIRECT FROM SHORT URL TO LONG URL
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL)
});

// POST // => DELETE URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// POST // => EDIT LONG URL
app.post("/urls/:shortURL/edit", (req, res) => {
  // console.log("POST Edit req.body", req.body)
  newLongURL = req.body.newLongURL
  // console.log("POST Edit newLongURL", newLongURL)
  // console.log("POST Edit req.params.shortURL", req.params.shortURL)
  urlDatabase[req.params.shortURL] = newLongURL;
  res.redirect("/urls");
});

// POST // LOGIN VIA NAV BAR
app.post("/login", (req, res) => {
  console.log("POST Login", req.body)
  let username = req.body.username;
  console.log("POST Login username", username)
  res.cookie("username", username);
  res.redirect("/urls");
});

// POST // LOGOUT VIA NAV BAR
app.post("/logout", (req, res) => {
  console.log("POST Logout req.body:", req.body);
  console.log("POST Logout req.cookies:", req.cookies);
  let username = req.cookies.usernamee
  console.log("POST Logout username:", username)
  res.clearCookie("username");
  res.redirect("/urls");

});