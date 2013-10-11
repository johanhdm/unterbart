var redis = require('redis')
	, client
	, maxPostsPerBoard = 100;

if (process.env.REDISCLOUD_URL){
	console.log("CLOUD!");
	var redisUrl = require("url").parse(process.env.REDISCLOUD_URL);
	client = require("redis").createClient(redisUrl.port, redisUrl.hostname);
	client.auth(redisUrl.auth.split(":")[1]);

}
else{
	client = redis.createClient();

}

exports.addBoardToTag = function(boardId, tag, media, callback){
	client.sadd(media + '#' + tag, boardId);
	console.log('addBoardToTag');
	//publish to channel so that we can push 

	client.publish('subscriptions:add:'+ media, '#' + tag);

};

exports.getPostsForBoard = function(boardId, offset, length, callback){

	offset = offset ? offset : 0;
	length = length ? offset + length : offset + 10;

	client.zrange(boardId, offset, length, function(err, data){
		var posts = [];
		for (var i = 0; i < data.length; i++) {
			posts.push( JSON.parse(data[i]));
		};

		callback(err, posts);
	});
};

exports.deleteTagFromBoard = function(boardId, tag, media, callback){

	var key = media + '#' + tag;
	console.log("key: ", key)
	client.srem(key, boardId, function(err, value){
		client.smembers(key, function(err, members){
			console.log("members: ", members, members.length);

			if (members.length == 0){
				client.publish('subscriptions:remove:' + media, '#' + tag);
			}
		});

	});
}
