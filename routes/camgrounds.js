const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const { checkCampgroundOwner, isLoggedIn } = require('../middleware');
//index route, show all campgrounds
router.get('/', (req, res) => {
	// console.log(req.user);
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/campgrounds', { campgrounds: campgrounds });
		}
	});
});
//new route - show form
router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});
//create route, add a new campground
router.post('/', isLoggedIn, (req, res) => {
	if (req.body.name && req.body.url) {
		const author = {
			id: req.user._id,
			username: req.user.username
		};
		Campground.create({
			name: req.body.name,
			img: req.body.url,
			price: req.body.price,
			description: req.body.description,
			author: author
		}, (err, campground) => {
			if (err) {
				console.log(err)
				return res.redirect('/campgrounds/new');
			} else {
				console.log('New campground added: ', campground);
				res.redirect('/campgrounds');
			}
		});
	} else {
		console.log('Invalid info');
		return res.redirect('/campgrounds/new');
	}
});
//show route
router.get('/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
		if (err || !campground) {
			console.log(err);
			req.flash('error', 'Sorry, Campground not found!');
			res.redirect('/campgrounds');
		} else {
			res.render('campgrounds/show', { campground: campground });
		}
	});
});
//edit route (you can't keep it here because of the app.use prefix)
router.get('/:id/edit', checkCampgroundOwner, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		res.render('campgrounds/edit', { campground: campground });
	});
});
//update route   
router.put('/:id', checkCampgroundOwner, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, {
		name: req.body.name,
		img: req.body.url,
		price: req.body.price,
		description: req.body.description
	}, (err, campground) => {
		if(err){
			console.log(err);
			return res.redirect('/campgrounds/'+ req.params.id);
		} else {
			console.log('Campground updated!');
			res.redirect('/campgrounds/' + req.params.id);			
		}
	})
});

//DESTROY ROUTE
router.delete('/:id', checkCampgroundOwner, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, campground) => {
		if(err){
			console.log(err);
			res.redirect('/camprounds/'+req.params.id);
		} else {
			console.log('Deleted successfully!');
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;
