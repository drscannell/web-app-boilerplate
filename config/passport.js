var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../app/models/user');

// load credentials
var configAuth = require('./auth');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// ------------- local login -------------
	
	passport.use('local-signup', new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true
		},
		function(req, email, password, done) {
			User.findOne({ 'local.email' :  email }, function(err, user) {
				if (err) {
					return done(err);
				}
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				} else {
					var newUser= new User();

					newUser.local.email= email;
					newUser.local.password = newUser.generateHash(password);
					newUser.save(function(err) {
						if (err)
						throw err;
						return done(null, newUser);
					});
				}

			});

	}));

	passport.use('local-login', new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true
		},
		function(req, email, password, done) {
			User.findOne({ 'local.email' :  email }, function(err, user) {
				if (err)
					return done(err);
				if (!user)
					return done(null, false, req.flash('loginMessage', 'No user found.'));
				if (!user.validPassword(password))
					return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
			return done(null, user);
			});
	}));

	// ------------ facebook login --------------
	
	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		passReqToCallback: true
	},
	function(req, token, refreshToken, profile, done) {
		process.nextTick(function() {
			if (!req.user) {
				User.findOne({
					'facebook.id':profile.id
				}, function(err, user) {
					if (err) {
						return done(err);
					} else if (user) {
						// found user id in database
						if (!user.facebook.token) {
							// no token. user must have unlinked
							// at some point
							user.facebook.token = token;
							user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
							user.facebook.email = profile.emails[0].value;
							user.save(function(err) {
								if (err)
									throw err;
								return done(null, user);
							});
						}
						return done(null, user);
					} else {
						var newUser = new User();
						newUser.facebook.id = profile.id;
						newUser.facebook.token = token;
						newUser.facebook.name = profile.name.givenName + 
							' ' + profile.name.familyName;
						newUser.facebook.email = profile.emails[0].value;

						newUser.save(function(err) {
							if (err) {
								throw err;
							}
							return done(null, newUser);
						});
					}
				});
			} else {
				var user = req.user;
				user.facebook.id = profile.id;
				user.facebook.token = token;
				user.facebook.name = profile.name.givenName + 
					' ' + profile.familyName;
				user.facebook.email = profile.emails[0].value;

				user.save(function(err) {
					if (err) {
						throw err;
					}
					return done(null, user);
				});
			}
		});
	}));


	// ----------------- twitter login --------------
	
	passport.use(new TwitterStrategy({
		consumerKey: configAuth.twitterAuth.consumerKey,
		consumerSecret: configAuth.twitterAuth.consumerSecret,
		callbackURL: configAuth.twitterAuth.callbackURL,
		passReqToCallback: true
	},
	function(req, token, tokenSecret, profile, done) {
		process.nextTick(function() {
			if (!req.user) {
				User.findOne({'twitter.id': profile.id}, function(err, user) {
					if (err) {
						return done(err);
					} else if (user) {
						// found user id in database
						if (!user.twitter.token) {
							// no token. user must have unlinked
							// at some point
							user.twitter.token = token;
							user.twitter.username = profile.username;
							user.twitter.displayName = profile.displayName;
							user.save(function(err) {
								if (err)
									throw err;
								return done(null, user);
							});
						}
						return done(null, user);
					} else {
						var newUser = new User();
						newUser.twitter.id = profile.id;
						newUser.twitter.token = token;
						newUser.twitter.username = profile.username;
						newUser.twitter.displayName = profile.displayName;
						newUser.save(function(err) {
							if (err) {
								throw err;
							}
							return done(null, newUser);
						});
					}
				});
			} else {
				var user = req.user;
				user.twitter.id = profile.id;
				user.twitter.token = token;
				user.twitter.username = profile.username;
				user.twitter.displayName = profile.displayName;
				user.save(function(err) {
					if (err) {
						throw err;
					}
					return done(null, user);
				});
			}
		});
	}));
	

	// ----------------- google login -------------------
	
	passport.use(new GoogleStrategy({
		clientID: configAuth.googleAuth.clientID,
		clientSecret: configAuth.googleAuth.clientSecret,
		callbackURL: configAuth.googleAuth.callbackURL,
		passReqToCallback: true
	}, 
	function(req, token, refreshToken, profile, done) {
		process.nextTick(function() {
			if (!req.user) {
				// mongoose
				User.findOne({'google.id': profile.id}, function(err, user) {
					if (err) {
						return done(err);
					} else if (user) {
						// found user id in database
						if (!user.google.token) {
							// no token. user must have unlinked
							// at some point
							user.google.token = token;
							user.google.name = profile.displayName;
							user.google.email = profile.emails[0].value;
							user.save(function(err) {
								if (err)
									throw err;
								return done(null, user);
							});
						}
						return done(null, user);
					} else {
						var newUser = new User();
						newUser.google.id = profile.id;
						newUser.google.token = token;
						newUser.google.name = profile.displayName;
						newUser.google.email = profile.emails[0].value;
						newUser.save(function(err) {
							if (err) {
								throw err;
							}
							return done(null, newUser);
						});
					}
				});
			} else {
				var user = req.user;
				user.google.id = profile.id;
				user.google.token = token;
				user.google.name = profile.displayName;
				user.google.email = profile.emails[0].value;
				user.save(function(err) {
					if (err) {
						throw err;
					}
					return done(null, user);
				});
			}
		});
	}));

};









