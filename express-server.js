const express = require("express"); // brought in express
const app = express();
const PORT = 8000; // default port 8080

const urlDatabase = { // Defined our database
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs'); // made a view engine and set it to ejs

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`); // made our server/app listen on port 8000 for a command
});

    // Routes //

app.get("/", (req, res) => { // made the server/app able to get route '/' , for our client/browser
  res.render("index"); // sent a render response
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }; // made object of template variables
  res.render("urls_index", templateVars); // made the templateVars object contents available to use in EJS file urls_index
});

app.get("/urls/:shortURL", (req, res) => { // made a route with a parameter
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars); // made the templateVars object contents available to use in EJS file urls_shows
});