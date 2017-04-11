var path = require('path');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var multer = require('multer');

var checkLogin = require('./middlewares/check').checkLogin;
var checkNotLogin = require('./middlewares/check').checkNotLogin;

var app = express();

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 配置数据库
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

// session中间件
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

app.use(router);

app.get('/', function(req, res) {
  res.redirect('login');
});
// 登录页
router.get('/login', function(req, res) {
  res.render('login', {title: '登录'});
});
// 注册页
router.get('/register', function(req, res) {
  res.render('register', {title: '注册'});
  req.flash('info', '请输入用户名');
});

router.post('/register', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;
  try {
    if(!username) {
      throw new Error('请输入用户名');
    }
    if(!password) {
      throw new Error('请输入密码');
    }
    if(password !== repassword) {
      throw new Error('两次输入密码不一致');
    }
  } catch(e) {
    console.log('验证不通过：' + e);
  }
  console.log('req.session：' + req.session);
  connection.query({
    sql: `INSERT INTO user (id, username, password) VALUES ('${req.sessionID}', '${username}', '${password}');`},
    console.log('sql语句是：' + connection.query.sql),
    function(error, results, fields) {
      if(error) throw error;
      console.log('results：' + results);
      req.session.id = req.sessionID;
      req.session.user = username;
      res.send('注册成功');
    }
  );
  // connection.end();
});
// 登陆成功
router.get('/content', function(req, res) {
  res.render('content', {title: '小明书屋'});
});

// 监听8000端口
app.listen(8000, function() {
  console.log(`app listening port 8000`);
});



