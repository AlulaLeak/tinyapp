function getUserByEmail(email, database) {
  for (const userID in database) {
    if (database[userID]['email'] === email) {
      return database[userID]['id'];
    }
  }
}

module.exports = getUserByEmail;

// I made a different to achieve my end results but I put this here to run the mocha test