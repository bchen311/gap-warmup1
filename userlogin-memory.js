// Constants
var SUCCESS               =   1;  // : a success
var ERR_BAD_CREDENTIALS   =  -1;  // : (for login only) cannot find the user/password pair in the database
var ERR_USER_EXISTS       =  -2;  // : (for add only) trying to add a user that already exists
var ERR_BAD_USERNAME      =  -3;  // : (for add, or login) invalid user name (only empty string is invalid for now)
var ERR_BAD_PASSWORD      =  -4;

var MAX_USERNAME_LENGTH = 128;
var MAX_PASSWORD_LENGTH = 128;

// Set up MySQL
var mysql = require('mysql');
var MYSQL_HOST = 'localhost';
var MYSQL_USERNAME = 'root';
var MYSQL_PASSWORD = 'password';

var connection = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD
});

connection.connect();

// Create the database
connection.query('CREATE DATABASE IF NOT EXISTS userDB', function(err) {
  if (err) { throw err; }
});
connection.query('USE userDB');

// Create user table
var createTableQuery = "" +
  "CREATE TABLE IF NOT EXISTS userTable(" +
  " user varchar(128) not null," +
  " password varchar(128)," +
  " count int unsigned," +
  " primary key (user)" +
");";

connection.query(createTableQuery, function(err) {
  if (err) { throw err; }
});


// UserLogin Class
UserLogin = function(){};

// Database Helper Methods
// Add a user into the database
UserLogin.prototype.addUser = function(user, password, count) {
  var addQuery = "INSERT INTO userTable (user, password, count) " + 
    "VALUES (?,?,?);";
  connection.query(addQuery, [user, password, count],
  function(err) {
    if (err) { throw err; }
  });
};

// Updates the user count
UserLogin.prototype.updateUserCount = function(user, count) {
  var updateQuery = "UPDATE userTable " +
    "SET count = (?)" +
    "WHERE user = (?);";
  connection.query(updateQuery, [count, user],
  function(err) {
    if (err) { throw err; }
  });
};

// Search for user
UserLogin.prototype.findUser = function(user, callback) {
  var findQuery = "SELECT * FROM userTable WHERE user = (?)";
  var userData = connection.query(findQuery, [user],
  function(err, results) {
    if (err) { 
      throw err; 
    }
    callback(results);
  });
};

// Helper Methods
/*
  Check if the username provided is valid.
  A username is valid if it is not null and it is shorter than the set max length of strings.
  
  @param String username - The username provided
*/
UserLogin.prototype.valid_username = function(username) {
  return username != '' && username.length <= MAX_USERNAME_LENGTH;
};

/*
  Check if the password provided is valid.
  A password is valid if it is shorter than the set max length of strings.
  
  @param String password - The password provided
*/
UserLogin.prototype.valid_password = function(password) {
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
UserLogin.prototype.login = function(user, password, callback) {
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
    callback(null, retStatus);
  });
};

/*
  Add User Method
  This method is called by the app to add login data provided by the user to the database.

  @param String user - The username in the login field
  @param String password - The password in the login field
  @param fn callback - The callback function to be called at the end
*/
UserLogin.prototype.add = function(user, password, callback) {
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
    callback(null, retStatus);
  });
};

exports.UserLogin = UserLogin;
