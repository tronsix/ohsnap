// Declare variables.
var fs = require('fs')
var dotenv = require('dotenv')

if (fs.existsSync('.env')) {
    dotenv.load()
}

var port = process.env.PORT
var bodyParser = require('body-parser')
var express = require('express')
var app = express()

var passport = require('passport')
var mongoose = require('mongoose')

var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

// Add the promise to mongoose.
mongoose.Promise = global.Promise
// Connect to the database
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true })
// Db error listener.
mongoose.connection.on('error',console.error.bind(console,'error: '))
// Db open listener.
mongoose.connection.once('open',function(){

    // Set the view engine to ejs.
    app.set('view engine', 'ejs')

    // For serving data/documents.
    app.use(express.static('./public'))
    // Parse json requests to the request body.
    app.use(bodyParser.json())
    // Parse url requests to the request body.
    app.use(bodyParser.urlencoded({ extended: true }))

    // For the login sessions.
    app.use(session({
        secret:process.env.COOKIE_SECRET_OR_KEY,
        saveUninitialized:false,
        resave:false,
        cookie:{ secure:true },
        store:new MongoStore({ mongooseConnection:mongoose.connection })
    }))

    // Initializing Passport and sessions.
    app.use(passport.initialize())
    app.use(passport.session())


    // Pass all requests to the apiRouter.
    app.all('*',require('./backend/router.js'))
    // Open the connection.
    app.listen(port,function(){
        console.log('Connected to app')
    })



})