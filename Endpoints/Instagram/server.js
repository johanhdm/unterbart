var client = require('../../common/redisClient').createClient()
	, subscriptionClient = require('../../common/redisClient').createClient()
	, restify = require('restify')
	, querystring = require('querystring')
	, instagramClient = restify.createJsonClient({
		url : 'https://api.instagram.com'
		})
    , instagram = {
        id : 'fa3365c8208a4dc5b71bcc13ba8c594e',
        secret : '7e00090a17cf43849d09a2aa1a739ae9'
      } 
	, accessToken = '10330001.1fb234f.798540347923465e81566f7eeaa912f9';

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

	return next();
});

//receive callbacks
server.post('/subscriptions/tags/:tag', function(req, res, next){

	for (var i = req.body.length - 1; i >= 0; i--) {
		
		var update = req.body[i];


		//https://api.instagram.com/v1/tags/selfie/media/recent
		instagramClient.get('/v1/tags/' +  update.object_id + '/media/recent?client_id=' + instagram.id, function(err, req, res, obj){

			for (var i = obj.data.length - 1; i >= 0; i--) {
				var data = obj.data[i];

				var post = {
						user : {
							name : data.user.username,
							username : data.user.full_name,
							picture : data.user.profile_picture
						},
						created : data.created_time,
						text : data.caption.text,
						images : [
							{ url : data.images.standard_resolution.url}
						],
						tags : data.tags,
						link : data.link,
						location : !data.location ? {} : {
							lng : data.location.longitude,
							lat : data.location.latitude
						},
						media : 'i'
					};
				client.publish('instagram', JSON.stringify(post));

				console.log(post);


			};

		});

	};

	res.send(200);



});


server.listen(process.env.PORT || 3000, function() {
	
	console.log('%s listening at %s', server.name, server.url);

});
