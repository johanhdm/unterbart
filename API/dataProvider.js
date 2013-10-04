var redis = require('redis')
	, client = redis.createClient()
	, maxPostsPerBoard = 100;


exports.addBoardToTag = function(boardId, tag, media, callback){
	client.sadd('#' + tag, boardId);
	console.log('addBoardToTag');
	addSubscription(media, tag, callback);
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

function addSubscription(media, tag, callback){
	console.log('addSubscription');

	tagHasSubscription(media, tag, function(number){

		console.log("SUBSCRIPTIONS: ", number);
		if (number == 0){
			client.sadd('subscriptions:' + media, tag, function(err, data){
				console.log("SUBSCRIPTION ADDED: ", media, ':', tag);
				
				client.publish('subscriptions:' + media, tag);
				callback();


			});			
		}
	})

};

function tagHasSubscription (media, tag, callback){
	console.log('tagHasSubscription');

	client.sismember('subscriptions:' + media, tag, function(err, data){
		console.log('sismember');
		callback(data);
	});
};
