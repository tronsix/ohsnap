var mongoose = require('mongoose')

var eventSchema = new mongoose.Schema({
    owner:String,
    event:String,
    phoneData:{}
},{ timestamps: true })

var phoneSchema = new mongoose.Schema({
    owner:String,
    phone:String,
    eventData:{}
},{ timestamps: true })

module.exports.event = mongoose.model('event', eventSchema)
module.exports.phone = mongoose.model('phone', phoneSchema)