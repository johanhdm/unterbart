var subscribeClient = require('../common/redisClient').createClient()
	, readClient = require('../common/redisClient').createClient();

var maxPostsPerBoard = 100;

subscribeClient.subscribe('twitter');
subscribeClient.subscribe('instagram');


subscribeClient.on('message', function(channel, post){
	//add to board
	addPostToBoard(post, channel, function(){
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