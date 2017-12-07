module.exports.getLogin = function(req,res,next) {
    req.logOut()
    var url;
    if (req.secure) { url = 'https://' + req.headers.host }
    else { url = 'http://' + req.headers.host }
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