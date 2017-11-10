var pg = require('pg');

var conString = "postgres://postgres:postgres@34.210.56.67:5432/xomeshare";

module.exports = {
	getProperties: function(getstatus, callback) {
		var client = new pg.Client(conString);
		client.connect(function(err) {
			if (err) {
				console.log("Error in /api/get_properties: " + err);
				callback({error: err, data: []});
				client.end();
			}
			else {
				var query = 'select * from property';
				if (getstatus) {
					query = "select * from property where status='" + getstatus + "'";
				}
				client.query(query, function(err, result) {
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
	},
	getPropertyById: function(id, callback) {
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
}
