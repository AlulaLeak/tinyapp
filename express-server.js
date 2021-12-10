const express = require("express"); // brought in express
const bodyParser = require("body-parser");
const app = express();
const PORT = 8000; // default port 8080
const bcrypt = require('bcrypt')








        // Cookie Parser //

const cookieParser = require("cookie-parser");

app.use(cookieParser());

          // Body Parser //


app.use(bodyParser.urlencoded({ extended: false })); // switched to allow database use in EJS

app.set('view engine', 'ejs'); // made a view engine and set it to ejs

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`); // made our server/app listen on port 8000 for a command
});








        // Database //

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









          // GET actions with Routes //


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(users);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id]
  };
  console.log(req.cookies)
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("register", templateVars)
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render('login', templateVars)
});










          // POST actions with Routes //


app.post("/urls", (req, res) => {
  const tinyURL = generateRandomString(6)
  // console.log(req.body.longURL);  // Log the POST request body to the console
  res.redirect(301, `/urls/${tinyURL}`);         // Respond with 'Ok' (we will replace this)
  urlDatabase[tinyURL] = req.body.longURL
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls')
})

app.post("/u/:shortURL", (req, res) => {
  urlDatabase[req.params['shortURL']] = req.body['longURL']
  res.redirect(301, `/urls/${req.params['shortURL']}`) // <-- In case we want to redirect
});

app.post("/login", (req, res) => {
  findUserEmail(req.body.email, req.body.password, res)
  res.redirect('/urls')
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect('/register')
});

app.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const email = req.body.email
  const password = hashedPassword
  const randomUserID = generateRandomString(8)

  for (let userId in users) {
    const user = users[userId]

    if (user.email === email) {
      res.status(400).send('Sorry, user already exists!')
      return
    }
    if (email === "") {
      res.status(400).send('Please fill your email!')
      return
    }
    if (req.body.password === hashedPassword) {
      res.status(400).send('thats the wrong password!')
      return
    }
  }

  const newUser = {
    userID: randomUserID,
    email: req.body.email,
    password: req.body.password,
    hashedPassword: hashedPassword
  }

  users[randomUserID] = newUser
  res.cookie('user_id', newUser.userID);
  res.redirect('/urls')

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


function findUserEmail(email, password, res) {

  if (password === '') {
    res.status(400).send('Please fill your password!')
    return
  }
  for (let userId in users) {
    if (users[userId]['email'] === email && users[userId]['password'] === password) {

      res.cookie("user_id", userId)
      res.redirect('/urls/new')
      return
    }
  }
  for (let userId in users) {
    if (users[userId]['password'] !== password || users[userId][email] !== email) {
      res.status(403).send('Username or Password is Incorrect :(')
      return
    }
  }
}