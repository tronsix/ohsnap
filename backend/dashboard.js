var async = require('async')
var UserEvent = require('../schema/dataModel').event
var Phone = require('../schema/dataModel').phone
var User = require('../schema/userModel')

module.exports.getDashboard = function(req,res,next) {
    if (!req.user) res.sendStatus(401)

    function getEvents(done) {
        UserEvent.find({owner:req.user.email},function(err,eventData) {
            if (err) done(err,500)
            if (!eventData) done(true,401)
            done(null,eventData)
        })
    }

    function getPhones(eventData,done) {
        Phone.find({owner:req.user.email},function(err,phoneData) {
            if (err) done(err,500)
            if (!phoneData) done(true,401)
            done(null,[eventData,phoneData])
        })
    }

    function render(data) {
        res.render('../html/dashboard',{
            status:'Ready',
            events:data[0],
            phones:data[1]
        })
    }

    async.waterfall([
        getEvents,
        getPhones
    ], function(err, result){
        if (err) { console.log(err);return res.sendStatus(result) }
        render(result)
    })

}

module.exports.createEvent = function(req,res,next) {

    function createEvent(done) {
        var newEvent = new UserEvent({
            owner:req.user.email,
            name:req.body.eventName
        })
        newEvent.save(function(err){
            if (err) done(err,500)
            done(null,newEvent._id)
        })
    }

    function updateUserEvents(id,done) {
        User.findOne({email:req.user.email},function(err,user) {
            if (err) done(err,500)
            if (!user) done(true,401)
            user.events.push({
                eventid:id
            })
            user.save(function(err) {
                if (err) done(err,500)
                done(null,200)
            })
        })
    }

    async.waterfall([
        createEvent,
        updateUserEvents
    ], function (err, result) {
        if (err) { console.log(err);return res.sendStatus(result) }
        res.sendStatus(result)
    })

}

module.exports.buyPhone = function(req,res,next) {
    
    
    req.body.areaCode

    var newPhone = new Phone({

    })
}




























































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