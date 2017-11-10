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
					var query = "select prop.size, prop.rooms, prop.price, prop.units, prop.photo_url, prop.address, prop.state, prop.zip, prop.unit_in_transac, prop.available_units, prop.unit_price, prop.status, prop.description, temp.sumunits units_bought, temp.sumamount holdamount from (select hold.user_id, hold.property_id, sum(hold.amount) sumamount, sum(hold.units_bought) sumunits from holdings hold group by hold.user_id, hold.property_id) temp join user_detail u on u.id = temp.user_id join property prop on prop.id = temp.property_id where u.id='" + userId + "'";

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
	},
    
    //searches property based on state
    searchPropertyByState: function(state, callback){
        var client = new pg.Client(conString);
        client.connect(function(err){
            if(err){
                console.log("Error in /api/search_property/" + state  + ": " + err);
				callback({error: err, data: []});
				client.end();
                }
            else{
                client.query("select * from property where state='"+state+"'", function(err, result) {
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
    },
    
    // buy property
    
    buyProperty: function(userId,propertyId,callback){
        
        var client = new pg.Client(conString);
        client.connect(function(err){
            
            if(err){
                    console.log("Error in /api/buyProperty/");
                    callback({error:err, data: []});
                    client.end();
                }
            else{
                client.query("select * from property where id='"+propertyId+"'",
                            function(err,result){
                   if(err){
                    console.log("Error in /api/buyProperty/");
                    callback({error:err, data: []});
                    client.end();
                       
                   }else{
                       console.log("Available units "+result.rows[0].available_units);
                       if(result.rows[0].available_units > 0)
                           {
                               client.query("insert into holdings(PROPERTY_ID,USER_ID,AMOUNT,UNITS_BOUGHT,STATUS,TIMESTAMP) values($1,$2,$3,$4,$5,$6) RETURNING id",[propertyId,userId,result.rows[0].unit_price,1,'INPROGRESS',new Date()], function(err,insertResult){
                                   if (err) {
                                       console.log("Error in /api/buyProperty/"+err);
                                       callback({error:err, data: []});
                                       client.end();
                                   } else {
                                       console.log("come on baby1");
                                       completePropertyTransaction(propertyId,userId,insertResult.rows[0].id,client,callback);
                                   }
                               });
                           }
                   }
                });
            }
            
        });
        
    },
    
    
}


function completePropertyTransaction(propertyId,userId,holdingId,client,callback)
    {
        client.query("UPDATE property SET available_units= available_units - 1 where id=($1)",[propertyId],function(err,result){
            if(err){
                console.log("Error in /api/buyProperty/"+err);
                callback({error:err, data: []});
                client.end();
            }else{
                console.log("come on baby2");
                callback({error:err, data: holdingId});
                client.end();
            }
        });
    }
