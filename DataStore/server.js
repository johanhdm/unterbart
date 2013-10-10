var redis = require('redis')
	, twitterSubscribeClient = redis.createClient()
	, readClient = redis.createClient();

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