var redis = require('redis')
	, client = redis.createClient()
	, subClient = redis.createClient()

	, twitter = require('twitter')
	, maxPostsPerBoard = 100;


//twitter socket connection
var t = new twitter({
    consumer_key: '87zdynIcL6Xyt2W08WP7g',
    consumer_secret: '9eUQVQri7aVqk50YKGEKAK5cUOKILPzVbiS3gzg',
    access_token_key: '138716927-sgZhs78YbAnTii2GdgcbpHEnIz5TrspHUhfP8UPg',
    access_token_secret: 'NattrUyHULhQfek8yEABREdEVOpOHuAffgRd4Cm2s'
});

subClient.on('message', function(channel, message){
	console.log('message: ', message);
	console.log('channel: ', channel);

	if (channel == "subscriptions:twitter"){
		startSubscriptionToTwitterTag(message, function(){
			console.log('done and done');
		});
	}
});

subClient.on('subscribe', function(channel, count){
	console.log('channel: ', channel);
	console.log('count: ', count);
});


subClient.subscribe('subscriptions:twitter');


exports.startRedisSubscription = function(media, callback){
	client.subscribe('subscriptions:' + media);
}

function addPostToBoards(post, tag, callback){
	callback();

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
					}); 

					//cleanup
					client.zremrangebyrank(boards[i], maxPostsPerBoard, -1, function(err, response){
					});

				}
			});
		};
	});

};


function startSubscriptionToTwitterTag(tag, callback){

	var tag = '#' + tag;

	t.stream('statuses/filter', { track: [tag] }, function(stream) {
		stream.on('data', function(tweet) {

			if (tweet && tweet.user){
				var post = {
					username : tweet.user.screen_name,
					name : tweet.user.name,
					created : tweet.created_at,
					text : tweet.text,
					tag : tag
				};

				console.log(post);

				addPostToBoards(post, tag, function(err, data){
					if (err){
						console.log("Endpoint ERROR: ", err);
					}
				});				
			}
	    });
	});

	callback();
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