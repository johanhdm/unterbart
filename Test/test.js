var restify = require('restify'),
	client = restify.createJsonClient({
  		url: 'http://127.0.0.1:3000'
		});


var subscriptions = [
    {
        "subscription_id": "1",
        "object": "tag",
        "object_id": "565879895808556847",
        "changed_aspect": "media",
        "time": 1297286541
    }
]	

client.post('/subscriptions/tags/yolo', subscriptions, function(err, req, res, obj) {
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});