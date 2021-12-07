const express = require('express')
const router = express()

    // Temporary Database 

const urlDatabase = { // Defined our database
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


router.get("/", (req, res) => {
  const templateVars = { urls: urlDatabase }; // made object of template variables
  res.render("urls_index", templateVars); // made the templateVars object contents available to use in EJS file urls_index
});

router.get("/new", (req, res) => {
  res.render("urls_new");
});

router.post("/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
})

function generateRandomString(length) {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.post("/", (req, res) => {
  const tinyURL = generateRandomString(6)
  console.log(req.body.longURL);  // Log the POST request body to the console
  res.redirect(301, `/${tinyURL}`);         // Respond with 'Ok' (we will replace this)
  urlDatabase[tinyURL] = req.body.longURL
  console.log(urlDatabase)
  
});

router.get("/:shortURL", (req, res) => { // made a route with a parameter
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars); // made the templateVars object contents available to use in EJS file urls_shows
});


module.exports = router;