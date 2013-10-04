var redis = require('redis')
	, client = redis.createClient()
	, twitter = require('twitter')
	, maxPostsPerBoard = 100;


//twitter socket connection
var t = new twitter({
    consumer_key: '87zdynIcL6Xyt2W08WP7g',
    consumer_secret: '9eUQVQri7aVqk50YKGEKAK5cUOKILPzVbiS3gzg',
    access_token_key: '138716927-sgZhs78YbAnTii2GdgcbpHEnIz5TrspHUhfP8UPg',
    access_token_secret: 'NattrUyHULhQfek8yEABREdEVOpOHuAffgRd4Cm2s'
});

client.on('message', function(channel, message){
	startSubscriptionToTwitterTag(message);

});

exports.startRedisSubscription = function(media, callback){
	client.subscribe('subscriptions:' + media);
}

exports.addPostToBoards = function(post, tag, callback){

	getBoardsWithTag(tag, function(err, boards){
		for (var i = boards.length - 1; i >= 0; i--) {

			var d = new Date().getTime();
			var set = [ boards[i], -d, JSON.stringify(post) ];

			filter(post, function(isNotFiltered){
				if (isNotFiltered){
					client.zadd( set, function(err, response){
						if (err){
							console.log('ERROR:', err, ' POST: ', post.name);
						}
						callback();
					}); 

					//cleanup
					client.zremrangebyrank(boards[i], maxPostsPerBoard, -1, function(err, response){
					});

				}
			});
		};
	});

};

exports.addBoardToTag = function(boardId, tag, media, callback){
	client.sadd('#' + tag, boardId);

	addSubscription(media, tag);
	callback();
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
	client.sismember('subscriptions:' + media, tag, callback);
};


function startSubscriptionToTwitterTag(tag){

	var tag = '#' + tag;

	t.stream('statuses/filter', { track: [tag] }, function(stream) {
		stream.on('data', function(tweet) {

			var post = {
				username : tweet.user.screen_name,
				name : tweet.user.name,
				created : tweet.created_at,
				text : tweet.text,
				tag : tag
			};

			dataclient.addPostToBoards(post, tag, function(err, data){
				if (err){
					console.log("Endpoint ERROR: ", err);
				}
			});

	    });
	});
}


function filter(post, callback){


	if (post.text.indexOf('#iphonegames') > -1 ){
		return callback(false);
	}
	else{
		 return callback(true);
	}


}


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