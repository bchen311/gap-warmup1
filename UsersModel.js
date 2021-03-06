// Constants
var SUCCESS               =   1;  // : a success
var ERR_BAD_CREDENTIALS   =  -1;  // : (for login only) cannot find the user/password pair in the database
var ERR_USER_EXISTS       =  -2;  // : (for add only) trying to add a user that already exists
var ERR_BAD_USERNAME      =  -3;  // : (for add, or login) invalid user name (only empty string is invalid for now)
var ERR_BAD_PASSWORD      =  -4;  // : (for add, or login) invalid password (over 128 characters)

var MAX_USERNAME_LENGTH = 128;
var MAX_PASSWORD_LENGTH = 128;

/******************
  Database Setup
*******************/

// Set up Postgresql
var pg = require('pg');
var connectionString = process.env.HEROKU_POSTGRESQL_CYAN_URL || "tcp://postgres:password@localhost/postgres";

var connection = new pg.Client(connectionString);
connection.connect();

// Create user table
var createTableQuery = "" +
  "CREATE TABLE IF NOT EXISTS userTable (" +
  " username varchar(128) not null primary key," +
  " password varchar(128)," +
  " count integer" +
");";

connection.query(createTableQuery, function(err) {
  if (err) { throw err; }
});


/******************
  UsersModel Class
*******************/
UsersModel = function(){};

// Database Helper Methods

/*
  Add a user into the database along with its password and login count.
  
  @param String user - The username to be added to the DB
  @param String password - The password to be added to the DB
  @param int count - The login count to be added to the DB
*/
UsersModel.prototype.addUser = function(user, password, count) {
  var addQuery = "INSERT INTO userTable (username, password, count) " + 
    "VALUES ($1,$2,$3);";
  connection.query(addQuery, [user, password, count],
  function(err) {
    if (err) { throw err; }
  });
};

/*
  Updates the login count in the database for a specific user.
  
  @param String user - The user whose count is to be updated
  @param int count - The login count to be updated to
*/
UsersModel.prototype.updateUserCount = function(user, count) {
  var updateQuery = "UPDATE userTable " +
    "SET count = $1" +
    "WHERE username = $2;";
  connection.query(updateQuery, [count, user],
  function(err) {
    if (err) { throw err; }
  });
};

/*
  Search for the user in the DB given the username.
  Returns the results in the callback function.
  
  @param String user - The username of the user being searched for in the DB
  @param fn callback - The callback function to be called with the results of the search
*/
UsersModel.prototype.findUser = function(user, callback) {
  var findQuery = "SELECT * FROM userTable WHERE username = $1;";

  var userData = connection.query(findQuery, [user],
  function(err, results) {
    if (err) { throw err; }
    callback(results.rows);
  });
};

// Helper Methods
/*
  Check if the username provided is valid.
  A username is valid if it is not null and it is shorter than the set max length of strings.
  
  @param String username - The username provided
*/
UsersModel.prototype.valid_username = function(username) {
  return username != '' && username.length <= MAX_USERNAME_LENGTH;
};

/*
  Check if the password provided is valid.
  A password is valid if it is shorter than the set max length of strings.
  
  @param String password - The password provided
*/
UsersModel.prototype.valid_password = function(password) {
  return password.length <= MAX_PASSWORD_LENGTH;
};


// Backend Methods to communicate with DB

/*
  Login Method
  This method is called by the app to validate the login data provided by the user.

  @param String user - The username in the login field
  @param String password - The password in the login field
  @param fn callback - The callback function to be called at the end
*/
UsersModel.prototype.login = function(user, password, callback) {
  var _this = this;
  // Check if user is in DB
  this.findUser(user, function(results) {
    var retStatus = 0;
    if (results.length == 0) {
      // User not found in DB
      retStatus = ERR_BAD_CREDENTIALS;
    } else {
      // User is found in DB
      userData = results[0];
      if (userData.password != password) {
        // Password does not match
        retStatus = ERR_BAD_CREDENTIALS;
      } else {
        // Password matches
        // Increment the login count by one
        var userDbCount = userData.count + 1;
        // Update the user login count in the DB
        _this.updateUserCount(user, userDbCount);
        retStatus = userDbCount;
      }
    }
    if (callback instanceof Function) { callback(null, retStatus); }
  });
};

/*
  Add User Method
  This method is called by the app to add login data provided by the user to the database.

  @param String user - The username in the login field
  @param String password - The password in the login field
  @param fn callback - The callback function to be called at the end
*/
UsersModel.prototype.add = function(user, password, callback) {
  var _this = this;
  // Check if user is in DB already
  var userData = this.findUser(user, function(results) {
    var retStatus = 0;
    if (results.length > 0) {
      // User already in DB, return error
      retStatus = ERR_USER_EXISTS;
    } else {
      // User not in DB
      if (!_this.valid_username(user)) {
        // Username not valid, return error
        retStatus = ERR_BAD_USERNAME;
      }
      else if (!_this.valid_password(password)) {
        // Password not valid, return error
        retStatus = ERR_BAD_PASSWORD;
      } else {
        // Username and password valid, add user to DB with count of 1
        _this.addUser(user, password, 1);
        retStatus = 1;
      }
    }
    if (callback instanceof Function) { callback(null, retStatus); }
  });
};

/*
  Reset Table Method
  This method is called to clear the database of all the rows.

  @param fn callback - The callback function to be called at the end
*/
UsersModel.prototype.TESTAPI_resetFixture = function(callback) {
  var resetQuery = "DELETE FROM userTable;";
  var userData = connection.query(resetQuery,
  function(err, results) {
    if (err) { throw err; }
  });
  callback(null, SUCCESS);
};

exports.UsersModel = UsersModel;
