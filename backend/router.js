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
                    var imageName = data.Contents[key]['Key']
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
    function lookForGroup(req,res,next,groupNumber) {
        var s3array = createS3Object()
        var s3 = s3array[0]
        var s3Params = s3array[1]
        // console.log(s3)
        // console.log(s3Params)
        var groupArray = []
        var twiml = new MessagingResponse()

        s3.listObjects(s3Params,function(err,data){
            if (err) {
                console.log('S3 Error: ')
                console.log(err)
            } else {
                if (data.Contents.length < 1) {
                    twiml.message('Visit the Trail of Lights Facebook page to see your photos!')
                } else {

                    for (var key in data.Contents) {
                        // includes name and extension like:
                        // 1_1.jpg
                        var imageName = data.Contents[key]['Key']
                        var noExtension = imageName.replace('.jpg','')
                        var group = noExtension.split('_')[0]
                        console.log(group)
                        console.log(groupNumber)
                        if (Number(group) == Number(groupNumber)) {
                            var url = 'https://nameless-fortress-95164.herokuapp.com/' + imageName
                            groupArray.push(url)
                        }
                    }

                    if (groupArray.length < 1) {
                        twiml.message('Visit the Trail of Lights Facebook page to see your photos!')
                    } else {
                        for (i = 0; i < groupArray.length; i++) { 
                            twiml.message(groupArray[i])
                        }
                    }
                    
                }

                res.header("Access-Control-Allow-Origin", '*');
                res.header("Access-Control-Allow-Credentials", true);
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    
                res.writeHead(200, {'Content-Type': 'text/xml'})
                res.end(twiml.toString())

            }
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
            res.render('../html/index',{
                image:url
            })
        }
    })

    apiRouter.post('*', function(req,res,next) {
        var url = req.originalUrl
        if (url == '/message') {
            var groupNumber = req.body['Body']
            lookForGroup(req,res,next,groupNumber)
        } else {
            res.sendStatus(200)
        }
    })

    // Create the apiRouter variable.
    module.exports = apiRouter

    // Pass all routes to the apiRouter.
    app.use('*',apiRouter)



}