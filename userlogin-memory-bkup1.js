var userCounter = 1;

var SUCCESS               =   1;  // : a success
var ERR_BAD_CREDENTIALS   =  -1;  // : (for login only) cannot find the user/password pair in the database
var ERR_USER_EXISTS       =  -2;  // : (for add only) trying to add a user that already exists
var ERR_BAD_USERNAME      =  -3;  // : (for add, or login) invalid user name (only empty string is invalid for now)
var ERR_BAD_PASSWORD      =  -4;

var MAX_USERNAME_LENGTH = 128;
var MAX_PASSWORD_LENGTH = 128;

// UserLogin Class
UserLogin = function(){};
UserLogin.prototype.userData = [];

function User() {
  this.username = '';
  this.password = '';
  this.loginCount = 0;
};

UserLogin.prototype.findAll = function(callback) {
  callback( null, this.userData )
};

UserLogin.prototype.findById = function(id, callback) {
  var result = null;
  for(var i =0;i<this.userData.length;i++) {
    if( this.userData[i]._id == id ) {
      result = this.userData[i];
      break;
    }
  }
  callback(null, result);
};

UserLogin.prototype.findByName = function(username) {
  var result = null;
  console.log('findByName username: ' + username);
  for(var i =0;i<this.userData.length;i++) {
    if( this.userData[i].username == username ) {
      result = i;
      break;
    }
  }
  return result;
};

UserLogin.prototype.login = function(user, password, callback) {

  console.log('UserLogin login called');
  var index = this.findByName(user);
  var retStatus = 0;
  console.log('index: ' + index);
  if (index < 0) {
    retStatus = ERR_BAD_CREDENTIALS;
  } else {
    data = this.userData[index];
    if (data.password != password) {
      retStatus = ERR_BAD_CREDENTIALS;
    } else {
      data.loginCount += 1;
      retStatus = data.loginCount;
    }
  }
  callback(null, retStatus);
};

UserLogin.prototype.add = function(user, password, callback) {
  var index = this.findByName(user);
  var retStatus = 0;
  console.log('index: ' + index);
  
  if (index != null && index > -1) {
    retStatus = ERR_USER_EXISTS;
  } else {

    function valid_username(username) {
      return username != '' && username.length <= MAX_USERNAME_LENGTH;
    };

    function valid_password(password) {
      return password.length <= MAX_PASSWORD_LENGTH;
    };
  
    if (!valid_username(user)) {
      retStatus = ERR_BAD_USERNAME;
    }
    else if (!valid_password(password)) {
      retStatus = ERR_BAD_PASSWORD;
    } else {
      var newUser = new User;
      newUser.username = user;
      newUser.password = password;
      newUser.loginCount = 1;
      this.userData.push(newUser);
      retStatus = newUser.loginCount;
    }
    console.log(this.userData);
    console.log('RetStatus: ' + retStatus);
  }

  callback(null, retStatus);
};

exports.UserLogin = UserLogin;
