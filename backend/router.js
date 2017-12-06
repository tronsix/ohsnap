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

function sendGroupUrl(req,res,next,group) {
    var twiml = new MessagingResponse()
    var url = 'https://nameless-fortress-95164.herokuapp.com/' + group
    twiml.message(url)
    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString())
}

function getGroupImages(req,res,next,group) {
    var s3array = createS3Object()
    var s3 = s3array[0]
    var s3Params = s3array[1]
    var twiml = new MessagingResponse()
    var images = []

    s3.listObjects(s3Params,function(err,data){
        if (err) { console.log(err) } 
        else {
            for (var key in data.Contents) {
                var imageName = data.Contents[key]['Key']
                var noExtension = imageName.replace('.jpg','')
                var groupNumber = noExtension.split('_')[1]
                if (Number(group) == Number(groupNumber)) {
                    var url = 'https://s3.amazonaws.com/nameless-fortress-95164/' + imageName
                    images.push(url)
                }
            }
            res.render('../html/index',{
                imageArray:images
            })
        }
    })
}

function handleAllRequests(req,res,next) {
    // For Cors-Header requests
    // Allows cross-origin requests from any origin host.
    if (req.get('origin')) {
        res.header("Access-Control-Allow-Origin", req.get('origin'))
    } else {
        res.header("Access-Control-Allow-Origin", req.get('host'))
    }
    res.header("Access-Control-Allow-Credentials", false)
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
}

function handleOptionsRequests(req,res,next) {
    // For Cors-Header requests
    res.sendStatus(200)
}

function handleGetRequests(req,res,next) {
    var url = req.originalUrl
    var group = url.replace('/','')
    if (url == '/photos') {
        // Send all images 10 or 20 at a time
        res.sendStatus(200)
    } else {
        getGroupImages(req,res,group)
    }
}

function handlePostRequests(req,res,next) {
    var url = req.originalUrl
    if (url == '/message') {
        var group = req.body['Body']
        sendGroupUrl(req,res,next,group)
    }
}

// Declare variables.
var async = require('async')
var express = require('express')
var apiRouter = express.Router()
var MessagingResponse = require('twilio').twiml.MessagingResponse

// Treat the headers here.
apiRouter.all('*',handleAllRequests)
// Treat the headers here.
apiRouter.options('*',handleOptionsRequests)
// Handle get requests.
apiRouter.get('*',handleGetRequests)
// Handle post requests.
apiRouter.post('*',handlePostRequests)

// Make the middleware available.
module.exports = apiRouter;