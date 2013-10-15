var restify = require('restify')
    , client = restify.createStringClient({ 
        url : 'https://api.instagram.com'
      })
    , instagram = {
        id : 'fa3365c8208a4dc5b71bcc13ba8c594e',
        secret : '7e00090a17cf43849d09a2aa1a739ae9'
      } 
    , accessToken = '10330001.1fb234f.798540347923465e81566f7eeaa912f9';


    var b = {
      client_id : instagram.id,
      client_secret : instagram.secret,
      aspect : 'media',
      object : 'tag',
      object_id : 'selfie',
      callback_url : 'http://instagram.unterbart.com/subscriptions/tags/selfie'

    };

    client.post('/v1/subscriptions/', b, function(err, req, res, obj){
      console.log(err);
      console.log(obj);
      
    });


/*	

-F 'client_id=CLIENT-ID' \
     -F 'client_secret=CLIENT-SECRET' \
     -F 'object=tag' \
     -F 'aspect=media' \
     -F 'object_id=nofilter' \
     -F 'callback_url=http://YOUR-CALLBACK/URL' \
     https://api.instagram.com/v1/subscriptions/


client = restify.createJsonClient({
  		url: 'http://127.0.0.1:3000'
		});*/



/*
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

*/