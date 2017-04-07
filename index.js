var path = require('path');
var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database:'jacob'
});
var ejs = require('ejs');
var app = express();

connection.connect();
// 查询
connection.query('SELECT * from `main`', function(err, rows, fields) {
  if (err) throw err;
  console.log('**************************************');
  console.log(rows);
  console.log('**************************************');
});
//关闭连接
connection.end();

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
// 登录页
app.get('/login', function(req, res) {
  res.render('login');
});
// 注册页
app.get('/register', function(req, res) {
  res.render('register');
});
// 登陆成功
app.get('/content', function(req, res) {
  res.render('content');
});
// 监听8000端口
app.listen(8000);



