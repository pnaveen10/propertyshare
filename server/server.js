var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');

app.use(bodyParser.json());

app.use('/public', express.static('public'))

// set the view engine to ejs
app.set('view engine', 'ejs');

var conString = "postgres://postgres:postgres@34.210.56.67:5432/xomeshare";

app.listen(8080, function() {
	console.log('listening on 8080')
})

// index page 
app.get('/', function(req, res) {
	res.render('pages/index');
});

app.get('/listingPage', function(req, res) {
	getProperties(function(result){
		result = {
			data: [
				{
					size: "100"
				}
			]
		}
	res.render('pages/listingPage', {listings: result.data});
	});
});

// about page 
app.get('/about', function(req, res) {
	res.render('pages/about');
});

// Get Property list
app.get('/api/get_properties', (req, res) => {
	getProperties(function(result) {
		res.send(result);
	});
});

// Get Properties
function getProperties(callback) {
	var client = new pg.Client(conString);
	client.connect(function(err) {
		if (err) {
			console.log("Error in /api/get_properties: " + err);
			callback({error: err, data: []});
			client.end();
		}
		else {
			client.query('select * from property', function(err, result) {
				if (err) {
					console.log(err);
					callback({error:err, data: []});
					client.end();
				}
				else {
					callback({error: '', data: result.rows});
					client.end();
				}
			})
		}
	});
}

// Get Property by ID
app.get('/api/get_property/:id', (req, res) => {
	var id = req.params.id; 
	getPropertyById(id, function(result) {
		res.send(result);
	});
});

// Get Property by Id
function getPropertyById(id, callback) {
	var client = new pg.Client(conString);
	client.connect(function(err) {
		if (err) {
			console.log("Error in /api/get_property/" + id  + ": " + err);
			callback({error: err, data: []});
			client.end();
		}
		else {
			client.query("select * from property where id='"+id+"'", function(err, result) {
				if (err) {
					console.log(err);
					callback({error:err, data: []});
					client.end();
				}
				else {
					callback({error: '', data: result.rows});
					client.end();
				}
			});
		}
	});
}

// Get Property list
/*
app.get('/api/get_properties', (req, res) => {
	var client = new pg.Client(conString);
	client.connect(function(err) {
		if (err) {
			console.log("Error in /api/get_properties: " + err);
			res.render('error', {error: err});
		}
		else {
			client.query('select * from property', function(err, result) {
				if (err) {
					console.log(err);
					res.send('error', {error:err});
				}
				else {
					res.send(result.rows);
				}
			})
		}
	})
});
*/
// React PROD build
// app.use('/static', express.static(path.resolve(__dirname + '\\..\\client\\build\\static')));
// app.get('/', (req, res) => {
// 	res.sendFile(path.resolve(__dirname + '\\..\\client\\build\\index.html'));
// })

// React DEV build
//app.use('/dist', express.static(path.resolve(__dirname + '/../client/dist')));
//app.get('/', (req, res) => {
//	res.sendFile(path.resolve(__dirname + '/../client/dist/devindex.html'));
//})


// Sample post
/*
app.post("/compileCode", (req, res) => {
	console.log(req)
	var tempFileName = "tempPythonFile" + (new Date).getTime() + ".py";
	fs.writeFile(tempFileName, req.body.code, function(err) {
		if(err) {
			console.log(err);
			res.render('error', {error: err});
		}
	})

	var child = exec("python " + tempFileName, function(error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
	});
})
*/

// Sample get
/*
app.get('/getDb', (req, res) => {
	var client = new pg.Client(conString);
	client.connect(function(err) {
		if(err) {
			console.log(err);
		}
		client.query('select * from wiki_master', function(err, result) {
			if(err){
				 console.log(err);
			}
			res.send(result.rows)
		})
	})

})

app.get('/get_details/:id', function(req,res){
	var client = new pg.Client(conString);
	var id = req.params.id;
	client.connect(function(err) {
		if(err) {
			console.log(err);
		}
		var sql_query = "select title,description from wiki_master where id = '" +id+"'"
		client.query(sql_query, function(err, result) {
			if(err){
				console.log(err);
			}
			if(result && result.rows && result.rows[0]){
				res.send(JSON.stringify(result.rows[0]))
			}
			else {
				res.send({})
			}
			client.end();
		})
	})
})
*/
