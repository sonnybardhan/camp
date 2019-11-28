const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const { checkCommentOwner, isLoggedIn } = require('../middleware');

router.get('/new', isLoggedIn, (req, res) => {
	const id = req.params.id;
	Campground.findById(id, (err, campground) => {
		res.render('comments/new', { campground: campground });
	});
});

router.post('/', isLoggedIn, (req, res) => {
	if (req.body.text) {
		req.body.text = req.sanitize(req.body.text);
		  
		Campground.findById(req.params.id, (err, campground) => {
			if (err) {
				console.log(err);
				res.redirect('/campgrounds/' + req.params.id);
			} else {
				Comment.create({
					text: req.body.text
				}, (err, comment) => {
					if (err) {
						console.log(err);
						req.flash('error', `Unable to create comment.`);
						res.redirect('/campgrounds/' + req.params.id);
					} else {
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						comment.save();
						console.log(comment);  
						campground.comments.push(comment);
						campground.save((err, campground) => {
							if (err) {
								console.log(err);
							} else {
								console.log('Saved!');
								req.flash('success', `Successfully added new comment!`);
								res.redirect('/campgrounds/' + req.params.id);
							}
						});
					}
				});
			}
		})
	} else {
		console.log('empty fields!')
		res.redirect('/campgrounds/' + req.params.id);
	}
});
//comment edit route
router.get('/:comment_id/edit', checkCommentOwner, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err || !campground){
			req.flash('error', 'Campground not found!');
			return res.redirect('back');
		}
		Comment.findById(req.params.comment_id, (err, comment) => {
			if(err) {
				return res.redirect('back')
			} else {
				res.render('comments/edit', {comment: comment, campgroundId: req.params.id});
			}
		});
	});
});
//comment update route
router.put('/:comment_id', checkCommentOwner, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, {
		text: req.body.text
	}, (err, comment) => {
		if(err) {
			console.log(err);
			return res.redirect('back');
		} else {
			console.log('Comment updated and saved!', comment);
			// res.redirect('/campgrounds');
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
});
//DESTROY ROUTE
router.delete('/:comment_id', checkCommentOwner, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
		if(err) {
			console.log(err);
		} else {
			console.log('comment removed!');
			req.flash('success', `Comment deleted.`);
			res.redirect('/campgrounds/'+req.params.id);
		}
	});
});


module.exports = router;