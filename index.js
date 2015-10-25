var express    = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var HOST = 'localhost';
var PORT = 3306;
var mysql      = require('mysql');
var connection = mysql.createConnection({host:HOST,port:PORT,database:'test'});
var path = require('path');
var jade = require('jade');
var csrf = require('csurf');
var app = express();

var fakeCookie = {'user':123456};
app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
var session = require('express-session');
var csrfEnabled = false;
app.use(session({
  secret: 'our super secret session secret',
  cookie: {
    maxAge: 3600000,
    httpOnly: true
  }
}));

//secure: true,
//TO DO: CSRF,cookie http only,comment presistant injection
// test safe/comment

//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//owasp #1 sql injection

app.get('/usecsrf',function(req,res){
	app.use(csrf());
	app.use(function(req, res, next) {
  		res.locals._csrf = req.csrfToken();
  		next();
	}); 
});
app.post('/injection', function (req, res) {
	var user = req.body.user;
	var pass = req.body.pass;
  //var user = connection.escape(req.body.user);
  //var pass = connection.escape(req.body.pass);
  console.log("user: ",user);
  console.log("pass: ",pass);
  var sql  = "SELECT * FROM users WHERE user = '" + user + "' AND pass = '" + pass + "'";
  connection.query(sql, function(err, results) {
  	console.log(results);
  });

});
app.post('/safe/injection',function(req,res) {
	var user = connection.escape(req.body.user);
	var pass = connection.escape(req.body.pass);
	console.log("user: ",user);
	console.log("pass: ",pass);
	var sql  = "SELECT * FROM users WHERE user = '" + user + "' AND pass = '" + pass + "'";
	connection.query(sql, function(err, results) {
		console.log(results);
	});
});
// A2
app.post('/login',function(req,res){
	if(req.body.user == "user" && req.body.pass == "1234"){
		var temp = {status:true,sessionId:fakeCookie[req.body.user]};
		res.json(temp);
	}else{
		var temp = {status:false};
		res.json(temp);
	}
});
app.get('/user',function(req,res){
	var keys = Object.keys(fakeCookie);
	keys.forEach(function(key){
		if (fakeCookie[key] == req.query['id']){
			var response = {user:key};
			res.json(response);
		};
	});
});
app.post('/comment',function(req,res){
	var comment = req.body.comment;
	var sql = "INSERT INTO comments VALUES ('"+comment+"')"
	connection.query(sql, function(err, results) {
		if (err) throw err;
		console.log(results);
		res.json(results);
	});
});
app.get('/comment',function(req,res){
	var sql  = "SELECT * FROM comments";
	connection.query(sql, function(err, results) {
		if (err) throw err;
		console.log(results);
		res.json(results);
	});
})
app.post('/safe/comment',function(req,res){
	var comment = req.body.comment;
	//TODO sanitize request
	var sql = "INSERT INTO comments VALUES ('"+comment+"');"
	connection.query(sql, function(err, results) {
		if (err) throw err;
		console.log(results);
		res.json(results);
	});
});

//cmd=while(1){console.log(%22HACKED%22)}
app.get('/nodejsInjection',function(req,res){
	console.log(req.query['cmd']);
	eval(req.query['cmd']);
});
//app.get()
app.get('/xss/*',function(req,res){
	var urlArray = req.url.split("/xss");
	var fileName = urlArray[urlArray.length - 1 ];
	//res.render('error', { name: fileName });
});
app.get('/',function(req,res){
    res.sendFile("index.html"); 
    //var html = jade.renderFile('index.jade',{});
		//res.send(html);
    //console.log('sth else');
    //res.render('index', { title: 'Express' });
});

app.listen(8080 , function () {
    console.log("magic happening") ;
});