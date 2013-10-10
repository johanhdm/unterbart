var restify = require('restify')
	, os = require('os')
	, dataclient = require('./dataProvider.js')
	, querystring = require('querystring');


var server = restify.createServer({});

//routes
server.get('/posts/:board', getPostsByBoard);
server.post('/board/:board/:media/:tag', addTagToBoard)
server.del('/board/:board/:media/:tag', deleteTagFromBoard)


function getPostsByBoard(req, res, next){

	var query = querystring.parse(req.query());

	dataclient.getPostsForBoard(req.params.board, query.offset, query.length, function(err, data){
		res.send(data);
	});
};

function deleteTagFromBoard(req, res, next){
	//validate user
	dataclient.deleteTagFromBoard(req.params.board, req.params.tag, req.params.media, function(err, data){
		if (err){
			return next(new restify.InternalServerError(err));
		}
		else{
			res.send(data);
		}
	});

};

function addTagToBoard(req, res, next){
	//validate user
	dataclient.addBoardToTag(req.params.board, req.params.tag, req.params.media, function(err, data){
		if (err){
			return next(new restify.InternalServerError(err));
		}
		else{
			res.send(data);
		}
	});

};


server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});