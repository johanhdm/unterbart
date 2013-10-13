var client = require('../../common/redisClient').createClient()
	, subscriptionClient = require('../../common/redisClient').createClient()
	, restify = require('restify')
	, querystring = require('querystring')
	, instagramClient = restify.createJsonClient({
		url : 'https://api.instagram.com'
		});

subscriptionClient.subscribe('subscriptions:add:instagram');
subscriptionClient.subscribe('subscriptions:remove:instagram');

subscriptionClient.on('message', function(channel, tag){
	console.log(channel , ' - ', tag)

	if (channel == 'subscriptions:add:instagram'){
		client.sadd('tags:instagram', tag);
		console.log('subscribe to: ', tag);

	}
	if (channel == 'subscriptions:remove:instagram'){
		client.srem('tags:instagram', tag);
		console.log('unsubscribe from: ', tag);
	
	}
	
});

var server = restify.createServer({});
server.use(restify.bodyParser({ mapParams: false }));

//verify callback URL
server.get('/subscriptions/tags/:tag', function(req, res, next){

	var query = querystring.parse(req.query());

	console.log(query);
	
	res.writeHead(200, {
	  	'Content-Length': Buffer.byteLength(query['hub.challenge']),
  		'Content-Type': 'text/plain'
	});	
	res.write(query['hub.challenge']);
	res.end();

//	res.send(200, query);

	return next();
});

//receive callbacks
server.post('/subscriptions/tags/:tag', function(req, res, next){
	for (var i = req.body.length - 1; i >= 0; i--) {
		
		var update = req.body[i];

		instagramClient.get('/v1/media/565879895808556847?access_token=10330001.1fb234f.798540347923465e81566f7eeaa912f9', function(err, req, res, data){
			console.log(err);
			console.log(data);

			data = data.data;
			var post = {
					username : data.user.username,
					name : data.user.full_name,
					created : data.created_time,
					text : data.caption.text,
					images : data.images
				};

			console.log(post);

		});

	};

	res.send(200);
});


server.listen(process.env.PORT || 3000, function() {
	
	console.log('%s listening at %s', server.name, server.url);

});
