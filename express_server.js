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

app.post("/urls", (req, res) => {
  shortURL = randomShortURL()
  res.redirect(`/urls/${shortURL}`);
});