var redis = require('redis')
	, twitterSubscribeClient
	, readClient;

if (process.env.REDISCLOUD_URL){
	console.log("CLOUD!");
	var redisUrl = require("url").parse(process.env.REDISCLOUD_URL);
	twitterSubscribeClient = require("redis").createClient(redisUrl.port, redisUrl.hostname);
	twitterSubscribeClient.auth(redisUrl.auth.split(":")[1]);
	
	readClient = require("redis").createClient(redisUrl.port, redisUrl.hostname);
	readClient.auth(redisUrl.auth.split(":")[1]);

}
else{
	twitterSubscribeClient = redis.createClient()
	readClient = redis.createClient();

}

var maxPostsPerBoard = 100;

twitterSubscribeClient.subscribe('twitter');

twitterSubscribeClient.on('message', function(channel, post){
	//add to board
	addPostToBoard(post, 'twitter', function(){
	});

});

function addPostToBoard(post, media, callback){
	post = JSON.parse(post);

	getBoardsWithTag(post.tag, media, function(err, boards){
		var d = new Date().getTime();
		for (var i = boards.length - 1; i >= 0; i--) {
			var set = [ boards[i], -d, JSON.stringify(post) ];

			readClient.zadd( set, function(err, response){
				if (err){
				console.log('ERROR:', err, ' POST: ', post.name);
				}

				//cleanup

			}); 
			readClient.zremrangebyrank(boards[i], maxPostsPerBoard, -1, function(err, response){
				callback();
			});

		}
	});
}


function getBoardsWithTag(tag, media, callback){
	readClient.smembers(media + tag, function(err, obj){
		callback(err, obj);
	});

}