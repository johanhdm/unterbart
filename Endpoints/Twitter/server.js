var client = require('../../common/redisClient').createClient()
	, subscriptionClient = require('../../common/redisClient').createClient()
	, twitter = require('twitter');

var theStream; 

var twitterClient = new twitter({
    	consumer_key: '87zdynIcL6Xyt2W08WP7g',
    	consumer_secret: '9eUQVQri7aVqk50YKGEKAK5cUOKILPzVbiS3gzg',
    	access_token_key: '138716927-sgZhs78YbAnTii2GdgcbpHEnIz5TrspHUhfP8UPg',
    	access_token_secret: 'NattrUyHULhQfek8yEABREdEVOpOHuAffgRd4Cm2s'
	});

function startSubscriptionToTwitterTag(tags, callback){

	twitterClient.stream('statuses/filter', { track: tags }, function(stream) {

		theStream = stream;

		stream.on('error', function(message){
			console.log('ERROR: ',message);
		})

		stream.on('data', function(tweet) {

			if (tweet && tweet.user){
				var post = {
					username : tweet.user.screen_name,
					name : tweet.user.name,
					created : tweet.created_at,
					text : tweet.text,
				};

				for (var i = tags.length - 1; i >= 0; i--) {
					
					var hashtags = tweet.entities.hashtags;
					for (var j = hashtags.length - 1; j >= 0; j--) {

						if ('#' + hashtags[j].text.toUpperCase() == tags[i].toUpperCase()){
							post.tag = tags[i];
							client.publish('twitter', JSON.stringify(post));
						}


					};

				};

			}
	    });

	});

	callback();		
}


function initSubscribing(){
	client.smembers('tags:twitter', function(err, tags){
		console.log('Subscribing to ', tags);
		if (tags.length > 0){
			startSubscriptionToTwitterTag(tags, function(){
				console.log('Subscribing to ', tags);
			});		
		}

	});

}


initSubscribing();
subscriptionClient.subscribe('subscriptions:add:twitter');
subscriptionClient.subscribe('subscriptions:remove:twitter');


subscriptionClient.on('message', function(channel, tag){
	console.log(channel , ' - ', tag)

	if (channel == 'subscriptions:add:twitter'){
		client.sadd('tags:twitter', tag);
		console.log('subscribe to: ', tag);

	}
	if (channel == 'subscriptions:remove:twitter'){
		client.srem('tags:twitter', tag);
		console.log('unsubscribe from: ', tag);
	
	}
	
	theStream.destroy();
	initSubscribing();


});


