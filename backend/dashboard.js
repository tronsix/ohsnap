module.exports.createObject = function() {
    // Create aws object.
    var aws = require('aws-sdk')
    aws.config = new aws.Config()
    aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID
    aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    aws.config.region = "us-east-1"

    // Return s3 related items.
    return {
        s3:new aws.S3(),
        s3Params:{ Bucket: 'nameless-fortress-95164' },
        s3Url:'https://s3.amazonaws.com/nameless-fortress-95164/'
    }
}

module.exports.getGroupImages = function(req,res,next,group) {
    var s3Object = Helper.s3.createObject()
    var images = []

    s3Object.s3.listObjects(s3Object.s3Params,function(err,data){
        if (err) { console.log(err) } 
        else {
            for (var key in data.Contents) {
                var imageName = data.Contents[key]['Key']
                var noExtension = imageName.replace('.jpg','')
                var groupNumber = noExtension.split('_')[1]
                if (Number(group) == Number(groupNumber)) {
                    var url = s3Object.s3Url + imageName
                    images.push(url)
                }
            }
            res.render('../html/image',{
                imageArray:images
            })
        }
    })
}

module.exports.createResponse = function() {
    var twilio = require('twilio')
    var MessagingResponse = twilio.twiml.MessagingResponse
    return new MessagingResponse()
}

module.exports.sendGroupUrl = function(req,res,next,group) {
    var twiml = module.exports.createResponse()
    twiml.message('Thanks for reaching out')
    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString())
}