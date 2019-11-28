const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/', (req, res) => {
	res.render('home');
});

//register
router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', (req, res) => {
	User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			req.flash('error', err.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, () => {
			console.log('New user registered!');
			req.flash('success', `Welcome to YelpCamp, ${user.username}!`);
			res.redirect('/campgrounds');
		})
	});
} 
);
//logins
router.get('/login', (req, res) => {
	res.render('login');
});
router.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/register'
}), (req, res) => {
	//this callback can be removed!
});
//logout route
router.get('/logout', (req, res) => {
	req.logOut();
	req.flash('success', 'You have been logged out. See you later!');
	res.redirect('/campgrounds');
});


module.exports = router;
