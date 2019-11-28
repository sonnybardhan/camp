const flash = require('connect-flash');
const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const passport = require('passport');
const localStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const expressSession = require('express-session');
const User = require('./models/user');

const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');
const campgroundRoutes = require('./routes/camgrounds');

mongoose.connect('mongodb://localhost:27017/yelpcamp_v6', { useNewUrlParser: true , useUnifiedTopology: true});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public')); 
app.use(flash()); //this has to come before passport confirguration

//passport configuration
app.use(expressSession({
	secret: 'world champion',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
   
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
 	next();
});

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//requiring routes
app.use('/campgrounds/:id/comments', commentRoutes);
app.use(authRoutes);
app.use('/campgrounds', campgroundRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('Listening on port: ', port);
});

