const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

morgan = require('morgan');
app.use(morgan('dev'));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

  ///////////////
 // DATABASE //
/////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

  ///////////////////////////////
 // RANDOM SHORT URL FUNCTION //
///////////////////////////////

const randomShortURL = function(length=6){
  return Math.random().toString(20).substr(2, length)
  }

  /////////////////
 // GET ROUTES //
///////////////

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// GET // => MY URLS PAGE
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// GET // => CREATE NEW URL/TINYURL PAGE
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// GET // => NEW SHORT URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

  //////////////////
 // POST ROUTES //
////////////////


// POST // => CREATE NEW SHORT/TINY URL
app.post("/urls", (req, res) => {
  // Declare variable, store value of generated new random short URL by calling randomShortURL function
  let shortURL = randomShortURL()

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