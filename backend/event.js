var async = require('async')
var UserEvent = require('../schema/dataModel').event
var Phone = require('../schema/dataModel').phone
var User = require('../schema/userModel')

module.exports.getEvent = function(req,res,next) {
    if (!req.user) res.sendStatus(401)

    function getEventData(done) {
        UserEvent.findOne({_id:req.params.eventid},function(err,eventData) {
            if (err) {
                done(err,[500])
            } else if (!eventData) {
                done(err,[401])
            } else if (eventData.owner !== req.user.email) {
                done(err,[401])
            } else {
                done(null,eventData)
            }
        })
    }

    async.waterfall([
        getEventData
    ], function(err,resultArray) {
        if (err) {
            console.log(err)
            res.sendStatus(resultArray[0])
        } else {
            res.render('../html/event',{
                status:'Ready',
                eventDataId:resultArray._id
            })
        }
    })

}

module.exports.getEventData = function(req,res,next) {
    if (!req.user) res.sendStatus(401)

    function getEventData(done) {
        UserEvent.findOne({_id:req.body.eventDataId},function(err,eventData) {
            if (err) {
                done(err,[500])
            } else if (!eventData) {
                done(err,[401])
            } else if (eventData.owner !== req.user.email) {
                done(err,[401])
            } else {
                done(null,eventData)
            }
        })
    }

    function getPhoneDataArray(eventData,done) {
        Phone.find({owner:req.user.email},function(err,phoneDataArray) {
            if (err) {
                done(err,[500])
            } else {
                done(null,[eventData,phoneDataArray])
            }
        })
    }

    async.waterfall([
        getEventData,
        getPhoneDataArray
    ], function(err,resultArray) {
        if (err) {
            console.log(err)
            res.sendStatus(resultArray[0])
        } else {
            res.status(200).json({
                eventData:resultArray[0],
                phoneDataArray:resultArray[1]
            })
        }
    })

}



module.exports.releasePhone = function(req,res,next) {
    if (!req.user) res.sendStatus(401)

    function updateEventData(done) {
        UserEvent.findOne({_id:req.body.eventDataId},function(err,eventData) {
            if (err) {
                done(err,[500])
            } else if (!eventData) {
                done(true,[401])
            } else if (eventData.owner !== req.user.email) {
                done(true,[401])
            } else {
                eventData.phone = {}
                eventData.save(function(err) {
                    if (err) {
                        done(err,[500])
                    } else {
                        done(null)
                    }
                })
            }
        })
    }

    function updatePhoneData(done) {
        Phone.findOne({_id:req.body.phoneDataId},function(err,phoneData){
            if (err) {
                done(err,[500])
            } else if (!phoneData) {
                done(true,[401])
            } else if (phoneData.owner !== req.user.email) {
                done(true,[401])
            } else {
                phoneData.phone = {}
                phoneData.save(function(err) {
                    if (err) {
                        done(err,[500])
                    } else {
                        done(null)
                    }
                })
            }
        })
    }

    async.waterfall([
        updateEventData,
        updatePhoneData
    ], function(err,resultArray) {
        if (err) {
            console.log(err)
            res.sendStatus(resultArray[0])
        } else {
            res.sendStatus(200)
        }
    })
}

module.exports.assignPhone = function(req,res,next) {
    if (!req.user) res.sendStatus(401)

    function updateEventData(done) {
        UserEvent.findOne({_id:req.body.eventDataId},function(err,eventData) {
            if (err) {
                done(err,[500])
            } else if (!eventData) {
                done(true,[401])
            } else if (eventData.owner !== req.user.email) {
                done(true,[401])
            } else {
                eventData.phone = req.body.phoneData
                eventData.save(function(err) {
                    if (err) {
                        done(err,[500])
                    } else {
                        done(null)
                    }
                })
            }
        })
    }

    function updatePhoneData(done) {
        Phone.findOne({_id:req.body.phoneDataId},function(err,phoneData){
            if (err) {
                done(err,[500])
            } else if (!phoneData) {
                done(true,[401])
            } else if (phoneData.owner !== req.user.email) {
                done(true,[401])
            } else {
                phoneData.phone = req.body.eventData
                phoneData.save(function(err) {
                    if (err) {
                        done(err,[500])
                    } else {
                        done(null)
                    }
                })
            }
        })
    }

    async.waterfall([
        updateEventData,
        updatePhoneData
    ], function(err,resultArray) {
        if (err) {
            console.log(err)
            res.sendStatus(resultArray[0])
        } else {
            res.sendStatus(200)
        }
    })
}