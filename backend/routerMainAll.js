var express = require('express')
var apiRouter = express.Router()

function imageRelated() {
    // For image outside the router.

    var mongoose = require('mongoose')
    var ImageSchema = new mongoose.Schema({
        group:{type:String},
        image:{type:String},
        url:{type:String}
    })

    var Image = mongoose.model('Image', ImageSchema)

    var express = require('express')
    var apiRouter = express.Router()
    var Image = require("./image.js").Image
    var async = require('async')
    var reader = require('fs')

    var aws = require('aws-sdk')

    aws.config = new aws.Config()
    aws.config.accessKeyId = process.env.AWS_SES_YY_ACCESS
    aws.config.secretAccessKey = process.env.AWS_SES_YY_SECRET
    aws.config.region = "us-east-1"
    var s3 = new aws.S3()
    var s3Bucket = new aws.S3( { params: {Bucket: 'yumyum-images'} } )
    // For image inside the Router
    var fileName = req.query['file-name']
    var fileType = req.query['file-type']
    var s3Params = {
        Bucket: 'yumyum-images',
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    }
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
            console.log(err);
            return res.json({
                status:false,
                reason:err
            })
        }
        var returnData = {
            signedRequest: data,
            url: 'https://yumyum-images.s3.amazonaws.com/' + fileName
        };
        res.write(JSON.stringify(returnData));
        res.end();
    })

}

function sendText() {
    res.sendText('Hi from router')
}

function goHome() {
    var path = require('path')
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
}

function uploadImage() {

}

apiRouter.get('*', function(req,res,next) {
    console.log('Recieving a GET url')
    console.log(req.url)
    goHome()
})

apiRouter.post('*', function(req,res,next) {
    console.log('Recieving a POST url')
    console.log(req.url)
    sendText()
})

module.exports = apiRouter
