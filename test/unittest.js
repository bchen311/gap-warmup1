var FAIL                  =   0;  // : a fail for unit test
var SUCCESS               =   1;  // : a success
var ERR_BAD_CREDENTIALS   =  -1;  // : (for login only) cannot find the user/password pair in the database
var ERR_USER_EXISTS       =  -2;  // : (for add only) trying to add a user that already exists
var ERR_BAD_USERNAME      =  -3;  // : (for add, or login) invalid user name (only empty string is invalid for now)
var ERR_BAD_PASSWORD      =  -4;  // : (for add, or login) invalid password (over 128 characters)

var UsersModel = require('../UsersModel').UsersModel;
var users = new UsersModel();
var assert = require('assert');

UnitTest = function() {};

// Test that adding a user works
UnitTest.prototype.testAdd1 = function(callback) {
  users.TESTAPI_resetFixture(function(err, retStatus) {
    users.add('user1', 'password', function(err, retStatus) {
      var testStatus = SUCCESS;
      var error = null;
      try{
        assert.equal(SUCCESS, retStatus);
      } catch (err) {
        testStatus = FAIL;
        error = err;
      }
      callback(error, testStatus);
    });
  });
};

// Test that adding two users works
UnitTest.prototype.testAdd2 = function(callback) {
  users.TESTAPI_resetFixture(function(err, retStatus) {
    users.add('user1', 'password', function(err, user1RetStatus) {
      var testStatus = SUCCESS;
      var error = null;
      try{
        assert.equal(SUCCESS, user1RetStatus);
      } catch (err) {
        testStatus = FAIL;
        error = err;
      }
      users.add('user2', 'password', function(err, user2RetStatus) {
        try{
          assert.equal(SUCCESS, user2RetStatus);
        } catch (err) {
          testStatus = FAIL;
          error = err;
        }
        callback(error, testStatus);
      });
    });
  });
};

// Test that adding a duplicate user fails
UnitTest.prototype.testAddExists = function(callback) {
  users.TESTAPI_resetFixture(function(err, retStatus) {
    users.add('user1', 'password', function(err, user1RetStatus) {
      var testStatus = SUCCESS;
      var error = null;
      try{
        assert.equal(SUCCESS, user1RetStatus);
      } catch (err) {
        testStatus = FAIL;
        error = err;
      }
      users.add('user1', 'password', function(err, user2RetStatus) {
        try{
          assert.equal(ERR_USER_EXISTS, user2RetStatus);
        } catch (err) {
          testStatus = FAIL;
          error = err;
        }
        callback(error, testStatus);
      });
    });
  });
};

// Test that adding an empty username fails
UnitTest.prototype.testAddEmptyUsername = function(callback) {
  users.TESTAPI_resetFixture(function(err, retStatus) {
    users.add('', 'password', function(err, retStatus) {
      var testStatus = SUCCESS;
      var error = null;
      try{
        assert.equal(ERR_BAD_USERNAME, retStatus);
      } catch (err) {
        testStatus = FAIL;
        error = err;
      }
      callback(error, testStatus);
    });
  });
};

// Test that logging in works
UnitTest.prototype.testLoginWorks = function(callback) {
  users.TESTAPI_resetFixture(function(err, retStatus) {
    users.add('user1', 'password', function(err, user1RetStatus) {
      var testStatus = SUCCESS;
      var error = null;
      try{
        assert.equal(SUCCESS, user1RetStatus);
      } catch (err) {
        testStatus = FAIL;
        error = err;
      }
      users.login('user1', 'password', function(err, user2RetStatus) {
        try{
          // Login count should be at 2
          assert.equal(2, user2RetStatus);
        } catch (err) {
          testStatus = FAIL;
          error = err;
        }
        callback(error, testStatus);
      });
    });
  });
};

// Test that logging in bad info fails
UnitTest.prototype.testBadCredentials = function(callback) {
  users.TESTAPI_resetFixture(function(err, retStatus) {
    users.login('user1', 'password', function(err, retStatus) {
      var testStatus = SUCCESS;
      var error = null;
      try{
        assert.equal(ERR_BAD_CREDENTIALS, retStatus);
      } catch (err) {
        testStatus = FAIL;
        error = err;
      }
      callback(error, testStatus);
    });
  });
};

// Test that logging in with an empty username fails
UnitTest.prototype.testLoginEmptyName = function(callback) {
  users.TESTAPI_resetFixture(function(err, retStatus) {
    users.login('', 'password', function(err, retStatus) {
      var testStatus = SUCCESS;
      var error = null;
      try{
        assert.equal(ERR_BAD_CREDENTIALS, retStatus);
      } catch (err) {
        testStatus = FAIL;
        error = err;
      }
      callback(error, testStatus);
    });
  });
};

// Test that resetFixture returns success
UnitTest.prototype.testResetFixture = function(callback) {
  users.TESTAPI_resetFixture(function(err, retStatus) {
    var testStatus = SUCCESS;
    var error = null;
    try{
      assert.equal(SUCCESS, retStatus);
    } catch (err) {
      testStatus = FAIL;
      error = err;
    }
    callback(error, testStatus);
  });
};

// Test that a username over 128 characters fails
UnitTest.prototype.testLongName = function(callback) {
  var longName = "";
  for (var i = 0; i < 5; i++) {
    longName += "abcdefghijklmnopqrstuvwxyz";
  }
  users.TESTAPI_resetFixture(function(err, retStatus) {
    users.add(longName, 'password', function(err, retStatus) {
      var testStatus = SUCCESS;
      var error = null;
      try{
        assert.equal(ERR_BAD_USERNAME, retStatus);
      } catch (err) {
        testStatus = FAIL;
        error = err;
      }
      callback(error, testStatus);
    });
  });
};

// Test that a password over 128 characters fails
UnitTest.prototype.testLongPassword = function(callback) {
  var longPassword = "";
  for (var i = 0; i < 5; i++) {
    longPassword += "abcdefghijklmnopqrstuvwxyz";
  }
  users.TESTAPI_resetFixture(function(err, retStatus) {
    users.add('user1', longPassword, function(err, retStatus) {
      var testStatus = SUCCESS;
      var error = null;
      try{
        assert.equal(ERR_BAD_PASSWORD, retStatus);
      } catch (err) {
        testStatus = FAIL;
        error = err;
      }
      callback(error, testStatus);
    });
  });
};

// Run all the tests
// TODO: Figure out a better way to run all the unit tests synchronously without nesting all of them
UnitTest.prototype.testAll = function(callback) {
  var _this = this;
  var numTests = 0;
  var numFailed = 0;
  var retError = '';
  this.testAdd1(function(err, retStatus) {
    numTests++;
    if (retStatus == 0) {
      numFailed++;
      retError += err + '\n';
    }
    _this.testAdd2(function(err, retStatus) {
      numTests++;
      if (retStatus == 0) {
        numFailed++;
        retError += err + '\n';
      }
      _this.testAddExists(function(err, retStatus) {
        numTests++;
        if (retStatus == 0) {
          numFailed++;
          retError += err + '\n';
        }
        _this.testAddEmptyUsername(function(err, retStatus) {
          numTests++;
          if (retStatus == 0) {
            numFailed++;
            retError += err + '\n';
          }
          _this.testLoginWorks(function(err, retStatus) {
            numTests++;
            if (retStatus == 0) {
              numFailed++;
              retError += err + '\n';
            }
            _this.testBadCredentials(function(err, retStatus) {
              numTests++;
              if (retStatus == 0) {
                numFailed++;
                retError += err + '\n';
              }
              _this.testLoginEmptyName(function(err, retStatus) {
                numTests++;
                if (retStatus == 0) {
                  numFailed++;
                  retError += err + '\n';
                }
                _this.testResetFixture(function(err, retStatus) {
                  numTests++;
                  if (retStatus == 0) {
                    numFailed++;
                    retError += err + '\n';
                  }
                  _this.testLongName(function(err, retStatus) {
                    numTests++;
                    if (retStatus == 0) {
                      numFailed++;
                      retError += err + '\n';
                    }
                    _this.testLongPassword(function(err, retStatus) {
                      numTests++;
                      if (retStatus == 0) {
                        numFailed++;
                        retError += err + '\n';
                      }
                      callback(numTests, numFailed, retError);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

exports.UnitTest = UnitTest;
