const express = require('express')
const router = express()

const urlDatabase = { // Defined our database
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

router.get("/", (req, res) => {
  const templateVars = { urls: urlDatabase }; // made object of template variables
  res.render("urls_index", templateVars); // made the templateVars object contents available to use in EJS file urls_index
});

router.get("/:shortURL", (req, res) => { // made a route with a parameter
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars); // made the templateVars object contents available to use in EJS file urls_shows
});

router.get("/new", (req, res) => {
  res.render("urls_new");
});

router.get(".json", (req, res) => {
  res.json(urlDatabase);
});

module.exports = router;