var post = {
	user : {
		name : data.user.username,
		username : data.user.full_name,
		picture : profile_picture
	},
	created : data.created_time,
	text : data.caption.text,
	images : {
		url : data.images.standard_resolution.url
	},
	tags : data.tags,
	link : data.link,
	location : {
		lng : data.location.longitude,
		lat : data.location.latitude
	},
	media : 't|i'

};