module.exports.createObject = function() {
    // Create aws object.
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

module.exports.getImage = function(req,res,next) {
    console.log(req.params.image)

    var imageUrl = process.env.S3_HOST_URL + '/' + process.env.S3_BUCKET + '/' + req.params.image

    res.render('../html/image',{
        imageUrl:imageUrl
    })

}



module.exports.postMessage = function(req,res,next) {

    
    var s3Object = module.exports.createObject()
    var requestedImage = 'FunRun' + Number(req.body.message)
    var sendImage = ''

    s3Object.s3.listObjects(s3Object.s3Params,function(err,data){
        if (err) {
            console.log(err)
            res.sendStatus(500)
        } else {

            for (var i = 0; i < data.Contents.length; i++) {
                var imageName = data.Contents[key]['Key'].replace('.jpg','')
                if (imageName == requestedImage) {
                    sendImage = s3Object.s3Url + '/' + imageName
                }
            }

            if (sendImage == '') {
                module.exports.sendTwilioMessage(req,res,next,'Please try again in a few minutes.')
            } else {
                module.exports.sendTwilioMessage(req,res,next,sendImage)
            }

        }
    })

}

module.exports.sendTwilioMessage = function(req,res,next,message) {
    var twilio = require('twilio')
    var MessagingResponse = twilio.twiml.MessagingResponse
    var twiml = new MessagingResponse()

    twiml.message(message)

    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString())
}