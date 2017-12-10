module.exports.getHomeData = function(req,res,next) {

    function creates3Object() {
        var aws = require('aws-sdk')
        aws.config = new aws.Config()
        // aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID
        // aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
        aws.config.region = "us-east-1"
    
        // Return s3 related items.
        var url = process.env.S3_HOST_URL + '/' + process.env.S3_BUCKET
        return {
            s3:new aws.S3(),
            s3Params:{ Bucket: process.env.S3_BUCKET },
            s3Url: url
        }
    }

    
    var s3Object = creates3Object()
    var imageArray = []

    s3Object.s3.listObjects(s3Object.s3Params,function(err,data){
        if (err) {
            console.log(err)
            res.sendStatus(500)
        } else {
            for (var i = 0; i < data.Contents.length; i++) {
                var url = 'https://s3.amazonaws.com/shop-lnp-media/' + data.Contents[i]['Key']
                imageArray.push(url)
            }
            res.status(200).json({
                imageArray:imageArray
            })
        }
    })
}

module.exports.getHome = function(req,res,next) {
        res.render('../html/home')
}