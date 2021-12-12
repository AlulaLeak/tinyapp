// TINY APP SERVER - LHL ASSIGNMENT



// Initialization


const express = require("express"); // brought in Express
const bodyParser = require("body-parser");
const app = express();
const PORT = 8000; // default port 8080
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser"); // brought in Cookie Parser
app.use(cookieParser());
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));






// Body Parser //


app.use(bodyParser.urlencoded({ extended: false })); // switched to allow database use in EJS

app.set('view engine', 'ejs'); // made a view engine and set it to ejs

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`); // made our server/app listen on port 8000 for a command
});








// Database //

const newUrlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
  //shortUrl: {                            |
  //longUrl: http"//www.example.edu    | * To indicate the difference
  //userID: "a9dkdW"                   |
  //}                                      |
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
};









// GET actions with Routes //


app.get("/", (req, res) => {
  if (!users[req.session.user_id]) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(newUrlDatabase);
});

app.get("/urls.json", (req, res) => {
  res.json(users);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello<b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {

  const templateVars = {
    urls: newUrlDatabase,
    user: users[req.session.user_id],
    usersURLs: listUsersURLs(req.session.user_id)
  };
  console.log();
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }

});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: newUrlDatabase[req.params.shortURL],
    user: users[req.session.user_id],
    urls: newUrlDatabase
  };
  if (!users[req.session.user_id]) {
    res.redirect("/login");
  } else {
    res.render("urls_show", templateVars);
  }
  console.log(newUrlDatabase[req.params.shortURL]);
});

app.get("/u/:shortURL", (req, res) => {
  console.log(req.params.shortURL);
  if (!newUrlDatabase[req.params.shortURL]) {
    res.send('short url does not exist');
  }
  res.redirect(newUrlDatabase[req.params.shortURL]['longURL']);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render('login', templateVars);
});










// POST actions with Routes //


app.post("/urls/new", (req, res) => {
  const tinyURL = generateRandomString(6);
  newUrlDatabase[tinyURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect('/urls');
  
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (users[req.session.userID] === req.session.userID) {
    delete newUrlDatabase[req.params.shortURL];
  } else {
    res.redirect("/login");
  }
  console.log(users[req.session.userID]);
  res.redirect("/urls");
});

app.post("/u/:shortURL", (req, res) => {
  console.log(req.body.longURL);
  newUrlDatabase[req.params['shortURL']] = {
    longURL: req.body['longURL'],
    userID: req.session.user_id
  };
  res.redirect(301, `/urls/${req.params['shortURL']}`); // <-- In case we want to redirect
});

app.post("/login", (req, res) => {
  findUserEmail(req.body.email, req.body.password, res, req);
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/register');
});

app.post("/register", async(req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const email = req.body.email;
  const password = hashedPassword;
  const randomUserID = generateRandomString(8);

  for (let userId in users) {
    const user = users[userId];

    if (user.email === email) {
      res.status(400).send('Sorry, user already exists!');
      return;
    }
    if (email === "") {
      res.status(400).send('Please fill your email!');
      return;
    }
    if (req.body.password === hashedPassword) {
      res.status(400).send('thats the wrong password!');
      return;
    }
  }

  const newUser = {
    id: randomUserID,
    email: req.body.email,
    password: password,
  };

  users[randomUserID] = newUser;
  req.session.user_id = newUser.id;
  res.redirect('/urls');
});










// Functions //
         

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


function findUserEmail(email, password, res, req) {

  if (password === '') {
    res.status(400).send('Please fill your password!');
    return;
  }
  for (let userId in users) {
    if (users[userId]['email'] === email && bcrypt.compareSync(password, users[userId]['password'])) {


      req.session.user_id = users[userId]['id'];
      console.log('it worked?');
      res.redirect('/urls/new');
      return;
    }
  }
  for (let userId in users) {
    if (users[userId]['password'] !== password || users[userId][email] !== email) {
      res.status(403).send('Username or Password is Incorrect :(');
      return;
    }
  }
  for (let userId in users) {
    if (users[userId]['password'] !== password || users[userId][email] !== email) {
      res.status(403).send('Username or Password is Incorrect :(');
      return;
    }
  }
}

function listUsersURLs(userID) {

  let usersURLs = {};

  for (let url in newUrlDatabase) {
    if (newUrlDatabase[url]['userID'] === userID) {
      usersURLs[url] = newUrlDatabase[url];
    }
  }

  return usersURLs;
}