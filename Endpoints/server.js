var restify = require('restify')
	, dataclient = require('../DataStore/dataprovider.js')
	, twitter = require('twitter');

var server = restify.createServer({});


//routes
server.post('/post/:media/:tag', addPost);
server.post('/subscribe/twitter/tag/:tag', startSubscriptionToTwitterTag);

function addPost(req, res, next) {

	console.log(req.body);

	dataclient.addPostToBoards(req.params.post, req.params.tag, function(err, data){
		console.log('respons done');
		res.send('ok');
	});
}

function addBoardToTag(req, res, next){

	dataclient.addBoardToTag(req.params.board, req.params.tag, function(){
		console.log('respons done');
		res.send('ok');
	});
}

function getAllTwitterSubcriptions(){

}

function startSubscriptionToTwitterTag(req, res, next){

	var tag = '#' + req.params.tag;

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
					console.log(err);
				}
				else{
					console.log(data);
				}
			});

	    });
	});

	res.send();
}

function endSubscriptionToTwitterTag(tag){


}

server.listen(4000, function() {
  console.log('%s listening at %s', server.name, server.url);
});


//twitter socket connection
var t = new twitter({
    consumer_key: '87zdynIcL6Xyt2W08WP7g',
    consumer_secret: '9eUQVQri7aVqk50YKGEKAK5cUOKILPzVbiS3gzg',
    access_token_key: '138716927-sgZhs78YbAnTii2GdgcbpHEnIz5TrspHUhfP8UPg',
    access_token_secret: 'NattrUyHULhQfek8yEABREdEVOpOHuAffgRd4Cm2s'
});
