// Handles all requests.
function handleRequest(req,res,next) {
    // Sets the global variable for rootUrl.
    function setRootUrl() {
        var url;
        if (req.headers.host.includes(process.env.APP_NAME)) {
            url = 'https://' + req.headers.host
        } else {
            url = 'http://' + req.headers.host
        }
        global.rootUrl = url
    }
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
        setRootUrl()
        setHeaders()
    } else {
        res.sendStatus(405)
    }
}

// Declare variables.
var passport = require('passport')
var apiRouter = require('express').Router()

// Treat headers (mostly for Cors-Header requests).
apiRouter.all('*',handleRequest)

// Login routes.
var loginPage = require('./backend/login')
apiRouter.get('/login',loginPage.getLogin)
apiRouter.post('/login',loginPage.postLogin)
apiRouter.post('/create',loginPage.postCreate)
apiRouter.post('/reset',loginPage.postReset)
apiRouter.post('/update',loginPage.postUpdate)

// Dashboard routes.
var dashboardPage = require('./backend/dashboard')
apiRouter.get('/dashboard',dashboardPage.getDashboard)
apiRouter.post('/getDashboardData',dashboardPage.getDashboardData)
apiRouter.post('/createEvent',dashboardPage.createEvent)
apiRouter.post('/purchasePhone',dashboardPage.purchasePhone)

// Event routes.
var eventPage = require('./backend/event')
apiRouter.get('/event/:eventid',eventPage.getEvent)
apiRouter.post('/getEventData',eventPage.getEventData)
apiRouter.post('/assignPhone',eventPage.assignPhone)
apiRouter.post('/releasePhone',eventPage.releasePhone)

// Twilio routes.
var shopPage = require('./backend/image')
apiRouter.get('/images/:image',shopPage.getImage)
apiRouter.post('/twilio/message',shopPage.postMessage)

// Home routes.
var homePage = require('./backend/home')
apiRouter.get('/home',homePage.getHome)
apiRouter.get('/',homePage.getHome)
apiRouter.post('/getHomeData',homePage.getHomeData)

// Routes land here if they dont match any other api endpoint.
apiRouter.all('*',function(req,res,next) { res.sendStatus(404) })

// Make the middleware available.
module.exports = apiRouter