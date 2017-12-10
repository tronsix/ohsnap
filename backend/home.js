module.exports.getHome = function(req,res,next) {
    res.render('../html/home',{
        imageUrl:'https://s3.amazonaws.com/shop-lnp-media/FunRun45.jpg'
    })
}