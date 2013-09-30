var redis = require('redis')
	, client = redis.createClient();

//init
client.on("subscribe", function(channel, count){
	console.log("subscribing to:", channel);
});

client.on("message", function(channel, message){
	//save message to all boards 

	console.log("IMPORTANT MESSAGE: ", channel, " - ", message);
});


exports.getBoardById = function(id, callback){
	if (id){
		client.zrevrange(id, 0 , -1, function(err, data){
			if (err){
				console.log(err);
			}
			else{
				console.log(data);
			}
		});	
	}
	else{
		callback("Board id cannot be empty", null);
	}
}



exports.saveBoardSettings = function(board, callback){

	client.subscribe('tag');
	callback();


	//callback(null, board);

	//for each tag in board, subscribe to the tag's channel - if tag has no channel - create a channel

};

exports.addTagToBoard = function(tag, board, callback){
	
	//if there are no subscriptions to this tag
	client.subscribe(tag);

	//tag = set of boards
	//add board to tag set
	client.sadd(tag, board);


};


//called by the endpoints
exports.savePostToTag = function(post, tag, callback){

	console.log(tag, " --- ", post);
	client.publish(tag, post);
	callback();

}


exports.post = {
	date : 123123123123,
	type : "T|I|G|F",
	description : "message",
	user : { 

	}

};