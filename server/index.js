const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const { db, User } = require('./db');

if (process.env.NODE_ENV === 'development') require('../secrets');

/* logging middleware */
app.use(morgan('dev'));

/* parsing middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* session store and session middleware */
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dbStore = new SequelizeStore({ db });

dbStore.sync(); // sync so that our session table gets created

app.use(
	session({
		secret: process.env.SESSION_SECRET || 'rEalLy BAd sEcreT :c',
		store: dbStore,
		resave: false, // Forces the session to be saved back to the session store
		saveUninitialized: false, // Forces a session that is 'uninitialized' to be saved to the store. False is useful for implementing login sessions
	})
);

/* passport middleware */
app.use(passport.initialize());
app.use(passport.session());

/* passport registration */
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findByPk(id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});

/* static middleware */
app.use(express.static(path.join(__dirname, '../public')));

/* routes */
app.use('/api', require('./api'));
app.use('/auth', require('./auth')); // authentication

/* send index HTML with all requests */
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

/* 500 handling; internal server error */
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send(err.message || 'Internal server error');
});

module.exports = app;
