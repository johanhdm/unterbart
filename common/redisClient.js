var redis = require('redis');

exports.createClient = function(){

	var client;
	if (process.env.REDISCLOUD_URL){
		console.log("CLOUD!");
		var redisUrl = require("url").parse(process.env.REDISCLOUD_URL);
		client = require("redis").createClient(redisUrl.port, redisUrl.hostname);
		client.auth(redisUrl.auth.split(":")[1]);

	}
	else{
		client = redis.createClient();

	}

	return client;

}