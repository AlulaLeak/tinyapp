const express = require("express"); // brought in express
const bodyParser = require("body-parser");
const app = express();
const PORT = 8000; // default port 8080

// Cookie Parser?

const cookieParser = require("cookie-parser");
const req = require("express/lib/request");
app.use(cookieParser());

// Temporary Database 


// Temporary Database 

 // figure out how to express the cookie
  // when someone registers and the cookie is created,
  // it returns as a req.cookies[something]


  function getEmailFromUserID(id) {

    for (const key in users) {
      if (users[key] === Object.keys(req.cookies)) {
        return console.log(users[key]["email"])
      } else (
        console.log(`no match`)
      )
    }
  }

// I want to return the value of the email in the userID
// that matches the cookieID







const urlDatabase = { // Defined our database
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
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

// body parser middleware to convert Buffer to Human-Readable String

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs'); // made a view engine and set it to ejs

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`); // made our server/app listen on port 8000 for a command
  console.log(urlDatabase)
});

// Routes //

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"],
    users: users
  };
  res.render("urls_index", templateVars);
})
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    users: users
  };
  res.render("urls_new", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"],
    users: users
  };
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});
app.get("/register", (req, res) => {
  console.log(req.cookies["username"])
  const templateVars = {
    username: req.cookies["username"],
    users: users
  };
  // Fill in
  res.render("register", templateVars)
});

app.post("/urls", (req, res) => {
  const tinyURL = generateRandomString(6)
  console.log(req.body.longURL);  // Log the POST request body to the console
  res.redirect(301, `/urls/${tinyURL}`);         // Respond with 'Ok' (we will replace this)
  urlDatabase[tinyURL] = req.body.longURL
  console.log(urlDatabase)
});
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls')
})
app.post("/u/:shortURL", (req, res) => {
  //console.log(`/${req.params['shortURL']}`)
  urlDatabase[req.params['shortURL']] = req.body['longURL']
  console.log(urlDatabase)
  res.redirect(301, `/urls/${req.params['shortURL']}`) // <-- In case we want to redirect
});
app.post("/login", (req, res) => {
  res.cookie(`username`, req.body[`username`])
  res.redirect(301, `/urls`)
});
app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect(301, `/urls`)
});
app.post("/register", (req, res) => {
  userID = generateRandomString(8)
  res.cookie(`userID`, userID)
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  }
  users[userID]["email"]
  res.redirect(301, `/register`)
  idExtractor = req.cookies
  console.log(idExtractor['userID'])
});
// Generate Random String Function

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}