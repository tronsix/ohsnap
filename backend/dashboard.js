var async = require('async')
var UserEvent = require('../schema/dataModel').event
var Phone = require('../schema/dataModel').phone
var User = require('../schema/userModel')

module.exports.getDashboard = function(req,res,next) {
    if (!req.user) {
        res.sendStatus(401)
    } else {
        res.render('../html/dashboard',{
            status:'Ready'
        })
    }
}

module.exports.getDashboardData = function(req,res,next) {
    if (!req.user) {
        res.sendStatus(401)
    } else {
        function getEvents(done) {
            UserEvent.find({owner:req.user.email},function(err,eventDataArray) {
                if (err) {
                    done(err,[500])
                } else {
                    done(null,eventDataArray)
                }
            })
        }
    
        function getPhones(eventDataArray,done) {
            Phone.find({owner:req.user.email},function(err,phoneDataArray) {
                if (err) {
                    done(err,[500])
                } else {
                    done(null,[eventDataArray,phoneDataArray])
                }
            })
        }
    
        async.waterfall([
            getEvents,
            getPhones
        ], function(err, resultArray){
            if (err) { console.log(err);return res.sendStatus(resultArray[0]) }
            res.status(200).json({
                eventDataArray:resultArray[0],
                phoneDataArray:resultArray[1]
            })
        })
    }
}

module.exports.createEvent = function(req,res,next) {
    if (!req.user) {
        res.sendStatus(401)
    } else {
        function createEvent(done) {
            var newEvent = new UserEvent({
                owner:req.user.email,
                event:req.body.eventName
            })
            newEvent.save(function(err){
                if (err) {
                    done(err,[500])
                } else {
                    done(null)
                } 
            })
        }
    
        async.waterfall([
            createEvent
        ], function (err, resultArray) {
            if (err) { console.log(err);return res.sendStatus(resultArray[0]) }
            res.sendStatus(200)
        })
    }
}

module.exports.purchasePhone = function(req,res,next) {
    if (!req.user) {
        res.sendStatus(401)
    } else {

        function findAvailablePhones(done) {
            twilio.availablePhoneNumbers('US').local.list({
                areaCode: req.body.areaCode,
                voiceEnabled: true,
                smsEnabled: true
            }).then(function(searchResults) {
                if (searchResults.length === 0) {
                    done(true,[401])
                } else {
                    done(null,searchResults)
                }
            })
        }


        function purchasePhone(searchResults,done) {
            var url = global.rootUrl + '/twilio/message'
            twilio.incomingPhoneNumbers.create({
                phoneNumber: searchResults[0].phoneNumber,
                smsUrl: url,
                smsMethod: 'POST'
            }, function(err,number) {
                if (err){
                    done(err,[500])
                } else {
                    done(null,number)
                }
            })
        }

        function updatePhoneData(number,done) {
            var newNumber = number.phoneNumber
            var friendlyName = number.friendlyName || number.FriendlyName
            console.log(number.friendlyName)
            console.log(number.FriendlyName)
            var phone = new Phone({
                owner:req.user.email,
                phone:newNumber,
                friendlyName:friendlyName
            })
            phone.save(function(err){
                if (err){
                    done(err,[500])
                } else {
                    done(null)
                }
            })
        }

        var twilio = require('twilio')(process.env.TWILIO_SID,process.env.TWILIO_AUTH_TOKEN)

        async.waterfall([
            findAvailablePhones,
            purchasePhone,
            updatePhoneData
        ], function(err,resultArray) {
            if (err) { console.log(err);return res.sendStatus(resultArray[0]) }
            res.sendStatus(200)
        })

    }
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