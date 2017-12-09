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
            var friendlyName = number.friendlyName
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