var UsersModel = require('../UsersModel').UsersModel;
var unittest = require('nodeunit');

exports.test = unittest.testCase( {
  setUp: function() {
    var users = new UsersModel();
    users.TESTAPI_resetFixture(function() {};);
  },
  tearDown: function() {
  },
  'test 1': function (test) {
    test.equal(4,4);
    test.done();
  }
});
