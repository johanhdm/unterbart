var restify = require('restify')
	, dataclient = require('./dataProvider.js');

var server = restify.createServer({});

//routes
server.post('/post/:media/:tag', addPost);

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


server.listen(4000, function() {
  console.log('%s listening at %s', server.name, server.url);
});
