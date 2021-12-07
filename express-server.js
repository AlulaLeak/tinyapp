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

    // Single Path Route //

app.get("/", (req, res) => { // made the server/app able to get route '/' , for our client/browser
  res.render("index"); // sent a render response
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

  // ^ urls path in ./routes/urls.js ^ \\

const urlRouter = require('./routes/urls')
app.use('/urls', urlRouter)

    // paths with parameters

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

    // Generate Random String Function

function generateRandomString() {

}
