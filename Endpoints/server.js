var restify = require('restify')
	, dataclient = require('../DataStore/dataprovider.js');


function respond(req, res, next) {
	dataclient.savePostToTag(req.params.post, req.params.tag, function(){
		console.log('respond done');
		res.send('ok');
	});

}

var server = restify.createServer({
/*	formatters : {
		'application/jsonp' : function formatJsonp(req, res, body){
			console.log('jsonp')
		}

	}
*/
});

//routes
server.get('/:tag/:post', respond);
server.head('/board/:id', respond);


server.listen(4000, function() {
  console.log('%s listening at %s', server.name, server.url);
});