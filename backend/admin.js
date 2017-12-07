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
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.sendStatus(200)
            });
        })(req, res, next)
    }
}