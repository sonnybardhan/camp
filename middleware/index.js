const Campground = require('../models/campground');
const Comment = require('../models/comment');
const passport = require('passport');
// const flash = require('connect-flash');
//log in check

const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	console.log('You need to log in or register');
	req.flash('error', 'You need to log in to do that.');
	res.redirect('/login');
}

//campground middleware
middlewareObj.checkCampgroundOwner = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, campground) => {
			if (err || !campground) {
				req.flash('error', `Campground not found, sorry!`);
				res.redirect('back');
			} else {
				if (campground.author.id.equals(req.user._id)) {
					next();
				} else {
					console.log('You are not authorized to do that.');
					req.flash('error', `You aren't authorized to do that.`);
					res.redirect('back');
				}
			}
		});
	} else {
		console.log('Log in first!');
		req.flash('error', 'You need to log in first.');
		res.redirect('/login');
	}
}
//comment middleware
middlewareObj.checkCommentOwner = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, comment) => {
			if (err || !comment) {
				req.flash('error', `Comment not found!`);
				res.redirect('back');
			} else {
				if (comment.author.id.equals(req.user._id)) {
					next();
				} else {
					console.log('You are not authorized for that.');
					req.flash('error', `You aren't authorized to do that.`);
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to log in first.');
		console.log('You need to be logged in for that.');
		res.redirect('/login');
	}
}

module.exports = middlewareObj;
   