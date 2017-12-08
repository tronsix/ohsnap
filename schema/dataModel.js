var mongoose = require('mongoose')

var eventSchema = new mongoose.Schema({
    owner:String,
    event:String,
    phoneData:mongoose.Schema.Types.Mixed
},{ timestamps: true })

var phoneSchema = new mongoose.Schema({
    owner:String,
    phone:String,
    friendlyPhone:String,
    eventData:mongoose.Schema.Types.Mixed
},{ timestamps: true })

module.exports.event = mongoose.model('event', eventSchema)
module.exports.phone = mongoose.model('phone', phoneSchema)