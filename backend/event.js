var async = require('async')
var UserEvent = require('../schema/dataModel').event
var Phone = require('../schema/dataModel').phone
var User = require('../schema/userModel')

module.exports.getEvent = function(req,res,next) {
    if (!req.user) res.sendStatus(401)

    function getEvent(done) {
        UserEvent.findOne({_id:req.params.eventid},function(err,eventData) {
            if (err) done(err,500)
            if (!eventData) done(true,401)
            if (eventData.owner !== req.user.email) done(true,401)
            res.render('../html/event',{
                eventData:eventData
            })
        })
    }

    UserEvent.findOne({_id:req.params.eventid},function(err,eventData) {
        // if (err) done(err,500)
        // if (!eventData) done(true,401)
        // if (eventData.owner !== req.user.email) done(true,401)
        res.render('../html/event',{
            status:'Ready',
            eventData:eventData
        })
    })

}