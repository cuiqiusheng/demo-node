var path = require('path');
var express = require('express');
var app = express();
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var multer = require('multer');
var checkLogin = require('./middlewares/check').checkLogin;
var checkNotLogin = require('./middlewares/check').checkNotLogin;
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database:'jacob'
};
var connection = mysql.createConnection(options);
connection.connect();
var sessionStore = new MySQLStore(options, connection);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer()); // for parsing multipart/form-data

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'demo',
  secret: 'guess',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 2592000000
  },
  store: sessionStore,
}));

app.use(flash());

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.redirect('login');
});
// 登录页
app.get('/login', function(req, res) {
  res.render('login', {title: '登录'});
});
// 注册页
app.get('/register', function(req, res) {
  res.render('register', {title: '注册'});
});
app.post('/register', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;
  if(!username) {
    req.flash('error', '请输入用户名');
    return;
  }
  if(!password) {
    req.flash('error', '请输入密码');
    return;
  }
  if(password !== repassword) {
    req.flash('error', '两次输入密码不一致');
    return;
  }
  connection.query({
    sql: `INSERT INTO user (username, password) VALUES (${username}, ${password})`},
    function(error, results, fields) {
      console.log(results);
    }
  );
});
// 登陆成功
app.get('/content', function(req, res) {
  res.render('content', {title: '小明书屋'});
});

// 监听8000端口
app.listen(8000, function() {
  console.log(`app listening port 8000`);
});



