var restify = require('restify')
	, dataclient = require('../DataStore/dataprovider.js');


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

var server = restify.createServer({
/*	formatters : {
		'application/jsonp' : function formatJsonp(req, res, body){
			console.log('jsonp')
		}

	}
*/
});



//routes
server.post('/post/:media/:tag', addPost);

server.post('/board/:tag/:board', addBoardToTag);


//actually API stuff
server.get('/:board', getPostsByBoard);

function getPostsByBoard(req, res, next){
	dataclient.getPostsForBoard(req.params.board, function(err, data){
		console.log(data);
		res.send(data);
	});

};


server.listen(4000, function() {
  console.log('%s listening at %s', server.name, server.url);
});