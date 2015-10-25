var express    = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var HOST = 'localhost';
var PORT = 3306;
var mysql      = require('mysql');
var connection = mysql.createConnection({host:HOST,port:PORT});


var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
app.use(express.static('public')) ; 

//owasp #1 sql injection
app.post('/login', function (req, res) {
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
app.post('/safe/Login',function(req,res) {
	var user = connection.escape(req.body.user);
	var pass = connection.escape(req.body.pass);
	console.log("user: ",user);
	console.log("pass: ",pass);
	var sql  = "SELECT * FROM users WHERE user = '" + user + "' AND pass = '" + pass + "'";
	connection.query(sql, function(err, results) {
		console.log(results);
	});
});
//cmd=while(1){console.log(%22HACKED%22)}
app.get('/nodejsInjection',function(req,res){
	console.log(req.query['cmd']);
	eval(req.query['cmd']);
});
app.get('/',function(req,res){
    res.sendFile("index.html") ; 
//	console.log('sth else');
});

app.listen(8080 , function () {
    console.log("magic happening") ;
});