var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var userSchema = new mongoose.Schema({
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err)
        callback(null, isMatch)
    })
}

// From http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt.
userSchema.pre('save', function(next) {
    var user = this
    var saltWorkFactor = 10

    // Only hash the password if it has been modified (or is new).
    if (!user.isModified('password')) return next()

    // Generate a salt.
    bcrypt.genSalt(saltWorkFactor, function(err, salt) {
        if (err) return next(err)
        // Hash the password along with our new salt.
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)
            // Override the cleartext password with the hashed one.
            user.password = hash
            next()
        })
    })
})

module.exports = mongoose.model('user', userSchema)