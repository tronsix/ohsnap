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

	passport.serializeUser(function(user, done) {
		console.log('user: ' + user)
	  	done(null, user.id)
	})

	passport.deserializeUser(function(id, done) {
		console.log('deserialize: ' + id)
		User.findById(id, function(err, user) {
			done(err, user)
		})
	})
}