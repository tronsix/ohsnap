module.exports = function(app) {

    // Handle image files.
    function uploadImage() {
        
        }

    // Interact with the AWS api.
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

    // Send a plain text page with text.
    function sendText(req,res,next) {
        res.sendText('Hi from router')
    }

    // Send the home page.
    function goHome(req,res,next) {
        var path = require('path')
        res.sendFile(path.join(__dirname, '../html', 'index.html'))
    }

    // Set up variables.
    var express = require('express')
    var apiRouter = express.Router()

    apiRouter.get('*', function(req,res,next) {
        var url = req.originalUrl
        console.log('GET Request: ' + url)
        // console.log(req)
        if (url == '/') {
            console.log('Sending home')
            goHome(req,res,next)
        } else {
            res.send('Cant find this page: ' + url)
        }
    })

    apiRouter.post('*', function(req,res,next) {
        console.log('POST Request: ' + req.url)
        if (req.url == '/') {
            goHome(req,res,next)
        } else {
            res.send('Cant find that page')
        }
    })

    // Create the apiRouter variable.
    module.exports = apiRouter

    // Pass all routes to the apiRouter.
    app.use('*',apiRouter)



}