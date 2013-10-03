var redis = require('redis')
	, client = redis.createClient();



exports.addPostToBoards = function(post, tag, callback){

	getBoardsWithTag(tag, function(err, boards){
		for (var i = boards.length - 1; i >= 0; i--) {

			var d = new Date().getTime()
			var set = [ boards[i], d, JSON.stringify(post) ];
			//client.zremrangebyrank(set, 5, -1, function(err, response){
				client.zadd( set, function(err, response){
					console.log(err);
					console.log(response);
					callback();
	
				}); 
			//});


		};
	});

};

exports.addBoardToTag = function(boardId, tag, media, callback){
	client.sadd('#' + tag, boardId);
	callback();
};

exports.getPostsForBoard = function(boardId, offset, length, callback){

	offset = offset ? offset : 0;
	length = length ? offset + length : offset + 10;

	client.zrevrange(boardId, offset, length, function(err, data){
		var posts = [];
		for (var i = 0; i < data.length; i++) {
			posts.push( JSON.parse(data[i]));
		};

		callback(err, posts);
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