const router = require('express').Router();
const passport = require('passport');
const { User } = require('../db');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('../../secrets');

// Mounted on /auth/google
router.get(
	'/',
	passport.authenticate('google', { scope: ['email', 'profile'] })
);

/* handle the callback from google */
router.get(
	'/callback',
	passport.authenticate('google', {
		successRedirect: '/home', //where do we want to send the user if they can log in?
		failureRedirect: '/login', // send the user back to the login page if they failed to login with google
	})
);

//
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:3000/auth/google/callback', // or whatever the app domain name is
		},
		async (token, tokenSecret, profile, done) => {
			try {
				const [result] = await User.findOrCreate({
					where: {
						googleId: profile.id,
					},
					defaults: {
						name: profile.displayName,
						imageUrl: profile.photos[0].value,
						email: profile.emails[0].value,
					},
				});
				done(null, result);
			} catch (error) {
				done(error); // server failed somehow
			}
		}
	)
);

module.exports = router;
