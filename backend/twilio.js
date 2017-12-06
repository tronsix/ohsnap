// Handle requests.
module.exports.handleRequest = function(req,res,next) {
    // Handle all get requests.
    function get(req,res,next) {
        // Responsible for sending data to specified helper(s).
    }

    // Handle all post requests.
    function post(req,res,next) {
        // Responsible for sending data to specified helper(s).
        module.exports.sendGroupUrl(req,res,next)
    }

    // Calls handleGet method.
    if (req.method == 'GET') { get(req,res,next) } 
    // Calls handlePost method.
    else if (req.method == 'POST') { post(req,res,next) }
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