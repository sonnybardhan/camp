const mongoose = require('mongoose');
const Comment = require('./comment');

const campgroundSchema = new mongoose.Schema({
	name: String,
	img: String,
	// description: String,
	description: {
		type: String,
		trim: true
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	}],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	price: String
});

module.exports = mongoose.model('Campground', campgroundSchema);

