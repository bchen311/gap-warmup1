var express = require('express');
var UsersModel = require('./UsersModel').UsersModel;
var UnitTest = require('./test/unittest').UnitTest;

var SUCCESS = 1;

var app = module.exports = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public/stylesheets/' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var usersModel = new UsersModel();

app.post('/users/login', function(req, res) {
  var username = req.body.user;
  var password = req.body.password;

  usersModel.login(username, password, function(error, retStatus) {
    var resp = {};
    if (retStatus < 0) {
      resp = {'errCode' : retStatus};
    } else {
      resp = {'errCode' : SUCCESS, 'count' : retStatus};
    }
    res.json(resp);
  });
});

app.post('/users/add', function(req, res) {
  var username = req.body.user;
  var password = req.body.password;

  usersModel.add(username, password, function(error, retStatus) {
    var resp = {};
    if (retStatus < 0) {
      resp = {'errCode' : retStatus};
    } else {
      resp = {'errCode' : SUCCESS, 'count' : retStatus};
    }
    res.json(resp);
  });
});

app.post('/TESTAPI/resetFixture', function(req, res) {

  usersModel.TESTAPI_resetFixture(function(err, retStatus) {
    var resp = {};
    resp = {'errCode' : retStatus};
    res.json(resp);
  });
});

app.post('/TESTAPI/unitTests', function(req, res) {
  var unittest = new UnitTest();
  unittest.testAll(function(numTests, numFailed, retError) {
    var resp = {};
    resp = {'totalTests' : numTests, 
      'nrFailed': numFailed,
      'output': retError
    };
    res.json(resp);
  });    

});

app.get('/', function(req, res) {
  res.render('index.jade', {
    title: 'Login Page'
  });
});

var port = process.env.PORT || 8080;
app.listen(port);
