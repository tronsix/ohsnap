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
var apiRouter = require('express').Router()

// Treat headers (mostly for Cors-Header requests).
apiRouter.all('*',handleRequest)
// Handle admin requests.
apiRouter.all('/admin',require('./admin.js').handleRequest)
// Handle twilio requests.
apiRouter.all('/api/twilio',require('./twilio.js').handleRequest)
// Handle stripe requests.
apiRouter.all('/api/stripe',require('./stripe.js').handleRequest)
// Handle s3 requests.
apiRouter.all('/api/s3',require('./s3.js').handleRequest)
// Handle mLab requests.
apiRouter.all('/api/mlab',require('./mlab.js').handleRequest)

// Routes land here if they dont match any other api endpoint.
apiRouter.all('*',function(req,res,next) { res.sendStatus(404) })

// Make the middleware available.
module.exports = apiRouter