var mongoose = require('mongoose')

var eventSchema = new mongoose.Schema({
    owner:String,
    name:String,
    phone:String
},{ timestamps: true })

var phoneSchema = new mongoose.Schema({
    owner:String,
    phone:String,
    event:String
},{ timestamps: true })

module.exports.event = mongoose.model('event', eventSchema)
module.exports.phone = mongoose.model('phone', phoneSchema)