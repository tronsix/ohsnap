var User = require('../schema/userModel')
var strategy = require('passport-local').Strategy

module.exports = function(passport) {
	
	// Passes err,user,info back to passport.authenticate('local')
	passport.use(new strategy({usernameField: 'email'},
		function(email, password, done) {
			User.findOne({ email: email }, function(err, user) {
				if (err) return done(err)
				if (!user) return done(null, false)
				user.comparePassword(password, function(err, isMatch) {
					if (err) return done(err)
					if (!isMatch) return done(null, false)
					return done(null, user)
				})
			})
		}
	))

	// Happens when the user creates an account.
	passport.serializeUser(function(user, done) {
	  	done(null, user.id)
	})

	// Happens when the user is already logged in.
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user)
		})
	})
}