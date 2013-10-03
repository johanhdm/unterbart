var redis = require('redis')
	, client = redis.createClient();



exports.addPostToBoards = function(post, tag, callback){

	getBoardsWithTag(tag, function(err, boards){
		for (var i = boards.length - 1; i >= 0; i--) {
			var set = [ boards[i], 1, post ];

			client.zadd( set, function(err, response){
				callback();
			}); 
		};
	});

};

exports.addBoardToTag = function(boardId, tag, callback){
	client.sadd(tag, boardId);
	callback();
};

exports.getPostsForBoard = function(boardId, callback){
	client.zrevrange(boardId, 0, -1, function(err, data){
		callback(err, data);
	});
};


function getBoardsWithTag(tag, callback){
	client.smembers(tag, function(err, obj){
		callback(err, obj);
	});

}


exports.post = {
	date : 123123123123,
	type : "T|I|G|F",
	description : "message",
	user : { 

	}

};