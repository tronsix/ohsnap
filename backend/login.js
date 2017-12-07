module.exports.getLogin = function(req,res,next) {
    req.logOut()
    var url;
    if (req.headers.host.includes('nameless-fortress-95164')) {
        url = 'https://' + req.headers.host
    } else {
        url = 'http://' + req.headers.host
    }
    console.log('url: ' + url)
    res.render('../html/login',{
        status:'Ready',
        rootUrl:url
    })
}

module.exports.getDashboard = function(req,res,next) {
    if (req.user) { res.render('../html/dashboard') }
    else { res.sendStatus(401) }
}

module.exports.postLogin = function(req,res,next) {
    var passport = require('passport')
    passport.authenticate('local', function(err, user, info) {
        if (err) { console.log(err);return res.sendStatus(500) }
        if (!user) { return res.sendStatus(401) }
        req.logIn(user, function(err) {
            if (err) { console.log(err);return res.sendStatus(500) }
            return res.sendStatus(200)
        })
    })(req, res, next)
}

module.exports.postCreate = function(req,res,next) {
    var User = require('../schema/userModel')
    User.findOne({email:req.body.email},function(err,user){
        if (err) { console.log(err);return res.sendStatus(500) }
        if (user) { return res.sendStatus(401) }
        var user = new User({
            username:req.body.email,
            email:req.body.email,
            password:req.body.password
        })
        user.save(function(err){
            if (err) { console.log(err);return res.sendStatus(500) }
            req.logIn(user, function(err) {
                if (err) { console.log(err);return res.sendStatus(500) }
                return res.sendStatus(200)
            })
        })
    })
}

module.exports.postReset = function(req,res,next) {
    var User = require('../schema/userModel')
    var crypto = require('crypto')
    var async = require('async')
    async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err,buf) {
                if (err) { console.log(err);return res.sendStatus(500) }
				var token = buf.toString('hex')
				done(err,token)
			})
		},
		function(token,done) {
			User.findOne({username:req.body.email}, function(err,user) {
                if (err) { console.log(err);return res.sendStatus(500) }
                if (!user) { return res.sendStatus(401) }
                user.resetPasswordToken = token
                user.resetPasswordExpires = Date.now() + 3600000
                user.save(function(err) {
                    done(err,user,token)
                })
			})
		},
		function(user,token,done) {

            var url;
            if (req.headers.host.includes('nameless-fortress-95164')) {
                url = 'https://' + req.headers.host
            } else {
                url = 'http://' + req.headers.host
            }

            var content = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            url + '/login?token=' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'

            var nodemailer = require('nodemailer')
            var aws = require('aws-sdk')
            aws.config = new aws.Config()
            aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID
            aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
            aws.config.region = "us-east-1"
            var transporter = nodemailer.createTransport({ SES: new aws.SES({ apiVersion: '2010-12-01' }) })

            transporter.sendMail({
                from:process.env.EMAIL,
                to:user.email,
                subject:'Password Reset',
                text:content
            }, (err, info) => {
                if (err) { console.log(err);return res.sendStatus(500) }
                return res.sendStatus(200)
        
            })

		}
	])
}

module.exports.postUpdate = function(req,res,next) {
    var User = require('../schema/userModel')

    User.findOne({resetPasswordToken:req.body.token,resetPasswordExpires: {$gt: Date.now()}}, function(err,user) {
        if (err) { console.log(err);return res.sendStatus(500) }
        if (!user) { return res.sendStatus(401) }

        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        user.save(function(err){
            if (err) { console.log(err);return res.sendStatus(500) }
            res.sendStatus(200)
        })
    })
}