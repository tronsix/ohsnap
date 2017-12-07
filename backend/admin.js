module.exports.get = {
    login(req,res,next) {
        var url;
        if (req.secure) { url = 'https://' + req.headers.host }
        else { url = 'http://' + req.headers.host }
        res.render('../html/login',{
            status:'Status',
            rootUrl:url
        })
    },
    admin(req,res,next) {
        res.render('../html/admin')
    },
    dashboard(req,res,next) {
        console.log(req.user)
        res.render('../html/dashboard')
    }
}

module.exports.post = {
    login(req,res,next) {
        var passport = require('passport')
        passport.authenticate('local', function(err, user, info) {
            console.log(err)
            console.log(user)
            console.log(info)
            if (err) { return res.sendStatus(401) }
            if (!user) { return res.sendStatus(401) }
            req.logIn(user, function(err) {
                return res.sendStatus(200)
            })
        })(req, res, next)
    }
}