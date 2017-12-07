var User = require('../auth/user')

module.exports.create = function(req,res,next) {
    var email = req.body.email
    User.findOne({email:email},function(err,user){
		if (user) {
			return res.sendStatus(401)
		} else {
            var user = new User({
                email:req.body.email,
                password:req.body.password
            })
            user.save(function(err){
                return res.sendStatus(200)
            })
		}
    })

}