var path = require('path');
var express = require('express');
var ejs = require('ejs');
var app = express();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎
app.engine('html', ejs.__express);
app.set('view engine', 'html');

app.get('/', function(req, res) {
  res.redirect('login');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.get('/content', function(req, res) {
  res.render('content');
});

app.listen(8000);



