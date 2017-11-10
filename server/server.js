var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');

var dbFunctions = require('./businesslogic/listing.js');

app.use(bodyParser.json());

app.use('/public', express.static('public'))

// set the view engine to ejs
app.set('view engine', 'ejs');

var conString = "postgres://postgres:postgres@34.210.56.67:5432/xomeshare";

app.listen(8080, function() {
	console.log('listening on 8080')
})

// #############################################
// Start page redirect section
// #############################################

// index page 
app.get('/', function(req, res) {
	res.render('pages/index');
});

app.get('/listingPage', function(req, res) {
	dbFunctions.getProperties('', function(result){
	res.render('pages/listingPage', {listings: result.data});
	});
});

app.get('/propertyDetail/:id', function(req, res) {
	var id = req.params.id; 
	dbFunctions.getPropertyById(id, function(result){
	res.render('pages/propertyDetails', {details: result.data});
	});
});

app.get('/holdings/:userid', function(req, res) {
	var userid = req.params.userid;
	dbFunctions.getHoldingsByUser(userid, function(result) {
		res.render('pages/holdingDetails', result);
	});
});

// about page 
app.get('/about', function(req, res) {
	res.render('pages/about');
});

// ###############################################
// Start API Section
// ###############################################

// Get Property list
app.get('/api/get_properties', (req, res) => {
	var getstatus = req.query.status;
	dbFunctions.getProperties(getstatus, function(result) {
		res.send(result);
	});
});

// Get Property by ID
app.get('/api/get_property/:id', (req, res) => {
	var id = req.params.id; 
	dbFunctions.getPropertyById(id, function(result) {
		res.send(result);
	});
});

// search listed properties based on state
app.get('/api/search_property/:state',(req,res)=>{
    var state = req.params.state.toUpperCase();
    dbFunctions.searchPropertyByState(state,function(result){
       res.send(result); 
    });
});


// buy property 
app.post("/api/buyProperty",(req,res)=>{
    
    var userId = req.body.userId;
    var propertyId = req.body.propertyId;
    
    dbFunctions.buyProperty(userId,propertyId,function(result){
        console.log(result);
        res.send(result);
    });
    
});
// Get holdings by user
app.get('/api/get_holding/:userid', (req, res) => {
	var userid = req.params.userid;
	dbFunctions.getHoldingsByUser(userid, function(result) {
		res.send(result);
	});
});

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
