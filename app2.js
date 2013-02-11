var express = require('express');
var ArticleProvider = require('./articleprovider-memory').ArticleProvider;

//var app = module.exports = express.createServer();
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

var articleProvider= new ArticleProvider();

app.get('/', function(req, res){
  articleProvider.findAll(function(error, docs){
      //res.send(docs);
      res.render('index.jade', {
        title: 'Blog',
        articles:docs
      });
  });
});

app.get('/test', function(req, res) {
  res.render('client.jade', {
    title: 'Login'
  });
});

app.post('/users/login', function(req, res) {
  console.log('LOGIN!!!!!!!!!!!!!!!!!!!!!');
});

app.post('/users/add', function(req, res) {
  console.log('ADDING!!!!!!!!!!!!!!!!!!!!!');
});

app.get('/blog/new', function(req, res) {
  res.render('blog_new.jade', {
    title: 'New Post'
  });
});

app.post('/blog/new', function(req, res) {
  console.log('loading new blog');
  articleProvider.save({
    title: req.param('title'),
    body: req.param('body')
  }, function(error, docs) {
    res.redirect('/')
  });
});

app.listen(8080);
