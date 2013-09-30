var restify = require('restify')
	, os = require('os')
	, dataclient = require('../DataStore/dataprovider.js');


function respond(req, res, next) {
	//resolve hostname against registered boardname
	console.log('hostname: ', os.hostname());	
	 
	//return next(new restify.UnauthorizedError("The board id is not valid for " + os.hostname() ));
	//if  hash(hostname + salt) == req.params.id
	//go go go 
	//get json from REDIS datastore
	dataclient.getBoardById(req.params.id, function(err, response){
		res.send(response);
	});
	//else access denied


}

dataclient.saveBoardSettings(null, function(){
	console.log('ok?');

});

var server = restify.createServer({
/*	formatters : {
		'application/jsonp' : function formatJsonp(req, res, body){
			console.log('jsonp')
		}

	}
*/
});

//routes
server.get('/board/:id', respond);
server.head('/board/:id', respond);


server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});