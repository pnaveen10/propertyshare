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
	getHoldingsByUser: function(userId, callback) {
		var client = new pg.Client(conString);
		client.connect(function(err) {
			if (err) {
				console.log("Error in /api/get_holdings/" + userId  + ": " + err);
				callback({error: err, data: []});
				client.end();
			}
			else {
				if (!userId) {
					console.log("No userid specified");
					callback({error:"No userid specified", data: []});
					client.end();
				}
				else {
					var query = "select prop.size, prop.rooms, prop.price, prop.units, prop.photo_url, prop.address, prop.state, prop.zip, prop.unit_in_transac, prop.available_units, " +
						"prop.unit_price, prop.status, prop.description, hold.units_bought, hold.amount holdamount, hold.status holdstatus, hold.type holdtype " +
						" from property prop join holdings hold on hold.property_id = prop.id join user_detail u on u.id = hold.user_id " +
						" where u.id='" + userId + "'";

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
