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
    , stringClient = restify.createStringClient({
    	url : 'https://api.instagram.com'
    })
	, accessToken = '10330001.1fb234f.798540347923465e81566f7eeaa912f9';

subscriptionClient.subscribe('subscriptions:add:instagram');
subscriptionClient.subscribe('subscriptions:remove:instagram');

subscriptionClient.on('message', function(channel, tag){
	console.log(channel , ' - ', tag)

	if (channel == 'subscriptions:add:instagram'){
		client.sadd('tags:instagram', tag);
		console.log('subscribe to: ', tag);


		//TODO : perform search, and add the last 100 posts


		//post to instagram 
		var subscription = {
	      client_id : instagram.id,
	      client_secret : instagram.secret,
	      aspect : 'media',
	      object : 'tag',
	      object_id : tag,
	      callback_url : 'http://instagram.unterbart.com/subscriptions/tags/' + tag
	    };

	    stringClient.post('/v1/subscriptions/', subscription, function(err, req, res, obj){

	    	console.log('Posted subscription to Instagram API on tag:', tag);
	    	if (err) console.log(err);
	    	else console.log(obj);	      

	    });

	}
	if (channel == 'subscriptions:remove:instagram'){
		client.srem('tags:instagram', tag);
		console.log('unsubscribe from: ', tag);

		stringClient.del('/v1/subscriptions/', function(err, req, res, obj){

	    	console.log('Deleted subscription to Instagram API on tag:', tag);
	    	if (err) console.log(err);
	    	else console.log(obj);	      

	    });


	
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

	console.log(req.body);

	for (var i = req.body.length - 1; i >= 0; i--) {
		
		var update = req.body[i];

		console.log(update);

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


server.listen(process.env.PORT || 5000, function() {
	
	console.log('%s listening at %s', server.name, server.url);

});
