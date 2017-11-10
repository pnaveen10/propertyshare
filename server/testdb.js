var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost:5432/xomeshare";

var client = new pg.Client(conString);
client.connect();

client.query('select * from test1', function(err, result) {
	if(err){
		console.log(err);
	}
	console.log(result.rows);
	client.end();
})
