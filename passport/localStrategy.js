var User = require('../schema/userModel')
var strategy = require('passport-local').Strategy

module.exports = function(passport) {

	passport.use(new strategy({usernameField: 'email'},
		function(email, password, done) {
			User.findOne({ email: email }, function(err, user) {
				console.log(1)
				if (err) return done(err)
				console.log(2)
				if (!user) return done(null, false)
				console.log(3)
				user.comparePassword(password, function(err, isMatch) {
					if (isMatch) {
						console.log(4)
						// req.logIn(user, function(err) {
						// 	console.log(5)
							
						// })
						return done(null, user)
					} else {
						console.log(6)
						return done(null, false)
					}
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