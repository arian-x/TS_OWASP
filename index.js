var express    = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var HOST = 'localhost';
var PORT = 3306;
var mysql      = require('mysql');
var connection = mysql.createConnection({host:HOST,port:PORT});
var path = require('path');
var jade = require('jade');
var app = express();
var fakeCookie = {'user':123456};
app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//owasp #1 sql injection
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
		var temp = {header:true,sessionId:fakeCookie[req.body.user]};
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