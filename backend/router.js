module.exports = function(app) {

    function createS3Object() {
        var aws = require('aws-sdk')
        aws.config = new aws.Config()
        aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID
        aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
        aws.config.region = "us-east-1"
        var s3 = new aws.S3()
        var s3Params = { Bucket: 'nameless-fortress-95164' }
        return [s3,s3Params]
    }

    // Adds all images to the homepage by sending an object with each url in the bucket.
    function showAllPhotos(req,res,next) {
        var s3array = createS3Object()
        var s3 = s3array[0]
        var s3Params = s3array[1]
        var imageArray = []

        s3.listObjects(s3Params,function(err,data){
            if (err) {
                console.log('S3 Error: ')
                console.log(err)
            } else {
                for (var key in data.Contents) {
                    var url = 'https://s3.amazonaws.com/nameless-fortress-95164/' + imageName
                    imageArray.push(url)
                }
            }
            console.log('Looking for photos')
            res.header("Access-Control-Allow-Origin", '*');
            res.header("Access-Control-Allow-Credentials", true);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
            res.json({images:imageArray})
        })
    }

    // Returns url for the group
    function lookForGroup(req,res,next,group) {
        var s3array = createS3Object()
        var s3 = s3array[0]
        var s3Params = s3array[1]
        var imageArray = []

        s3.listObjects(s3Params,function(err,data){
            if (err) {
                console.log('S3 Error: ')
                console.log(err)
            } else {
                for (var key in data.Contents) {
                    var url = 'https://s3.amazonaws.com/nameless-fortress-95164/' + imageName
                    imageArray.push(url)
                }
            }
            console.log('Looking for photos')
            res.header("Access-Control-Allow-Origin", '*');
            res.header("Access-Control-Allow-Credentials", true);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
            res.json({images:imageArray})
        })
    }

    // Send a plain text page with text.
    function sendText(req,res,next) {
        res.sendText('Hi from router')
    }

    // Send the home page.
    function goHome(req,res,next) {

        // var path = require('path')
        // var homeUrl = path.join(__dirname, '../html', 'index.html')
        var array = lookForPhotos(req,res,next)
        res.render('../html/index', {
            images:array
        })
    }

    // Set up variables.
    var async = require('async')
    var express = require('express')
    var apiRouter = express.Router()
    var MessagingResponse = require('twilio').twiml.MessagingResponse

    apiRouter.get('*', function(req,res,next) {
        var url = req.originalUrl
        // Sends object to page with all images.
        if (url == '/photos') {
            showAllPhotos(req,res,next)
        } else {
            res.send('Cant find this page: ' + url)
        }
    })

    function handleMessage(req,res,next,message,number) {
        var twiml = new MessagingResponse()
        twiml.message('Hi!')
        res.writeHead(200, {'Content-Type': 'text/xml'})
        res.end(twiml.toString())
    }

    apiRouter.post('*', function(req,res,next) {
        var url = req.originalUrl
        if (url == '/message') {
            var body = req.body['Body']
            var from = req.body['From']
            handleMessage(req,res,next,body,from)
        } else {
            res.sendStatus(200)
        }
    })

    // Create the apiRouter variable.
    module.exports = apiRouter

    // Pass all routes to the apiRouter.
    app.use('*',apiRouter)



}