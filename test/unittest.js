var UsersModel = require('../UsersModel').UsersModel;
var unittest = require('nodeunit');
var assert = require('assert');

TestUsers = function() {};
var users = new UsersModel();

TestUsers.prototype.setup = function() {
  users.TESTAPI_resetFixture(function() {};);
};

TestUsers.prototype.testAdd1 = function() {
//  self.assertEquals(server.SUCCESS, self.users.add("user1", "password"))
  this.setup();
  assert.equal(users.SUCCESS, users.add("user1", "password");
  
};

/*
exports.test = unittest.testCase( {
  setUp: function() {
    
    users.TESTAPI_resetFixture(function() {};);
  },
  tearDown: function() {
  },
  'test 1': function (test) {
    test.equal(4,4);
    test.done();
  }
});
*/
