// Handles all requests.
function handleRequest(req,res,next) {
    // Sets the headers.
    function setHeaders() {
        // Allows cross-origin requests from any origin host.
        var origin = req.get('origin') || req.get('host')
        res.header("Access-Control-Allow-Origin", origin)
        res.header("Access-Control-Allow-Credentials", false)
        res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        res.header('Access-Control-Allow-Headers', 'Content-Type')

        // For Cors-Header preflight requests.
        if (req.method == 'OPTIONS') { res.sendStatus(200) }
        // Passes request to next middleware.
        else { next() }
    }

    // Filters requests.
    if (req.method == 'GET' || req.method == 'POST' || req.method == 'OPTIONS') {
        setHeaders()
    } else {
        res.sendStatus(405)
    }
}

// Declare variables.
var passport = require('passport')
var apiRouter = require('express').Router()
var adminjs = require('./admin')
var mlabljs = require('./mlab')

// Treat headers (mostly for Cors-Header requests).
apiRouter.all('*',handleRequest)
// Handle twilio requests.
apiRouter.all('/api/twilio',require('./twilio.js').handleRequest)
// Handle stripe requests.
apiRouter.all('/api/stripe',require('./stripe.js').handleRequest)
// Handle s3 requests.
apiRouter.all('/api/s3',require('./s3.js').handleRequest)
// Handle mLab requests.
// apiRouter.all('/api/mlab/:method',require('./mlab.js').handleRequest)

// Admin pages.
apiRouter.get('/login',adminjs.get.login)
apiRouter.get('/admin',adminjs.get.admin)
apiRouter.get('/dashboard',adminjs.get.dashboard)
apiRouter.post('/create',mlabljs.create)
apiRouter.post('/login',adminjs.post.login)

// Routes land here if they dont match any other api endpoint.
apiRouter.all('*',function(req,res,next) {
    if (req.method == 'GET' && req.path == '/') {
        var url;
        if (req.secure) { url = 'https://' + req.headers.host }
        else { url = 'http://' + req.headers.host }
        res.render('../html/login',{
            status:'Status' || req.flash(),
            rootUrl:url
        })
    } else {
        res.sendStatus(404)
    }
})

// Make the middleware available.
module.exports = apiRouter