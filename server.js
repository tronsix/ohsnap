// Declare variables.
var fs = require('fs')
if (fs.existsSync('.env')) {
    var dotenv = require('dotenv')
    dotenv.load()
}
var port = process.env.PORT
var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var mongoose = require('mongoose')
var dburl = process.env.MONGODB_URI
var db = mongoose.connection
var apiRouter = require('./backend/router.js')

// Add the promise to mongoose.
mongoose.Promise = global.Promise
// mongoose.connect(dburl)
mongoose.connect(dburl, { useMongoClient: true });

// Log db errors.
db.on('error',console.error.bind(console,'error: '))
// Initialize app on db open.
db.once('open',function(){

    // Set the view engine to ejs.
    app.set('view engine', 'ejs')
    // For serving data/documents.
    app.use(express.static('./public'))
    // For cookie sessions.
    app.use(cookieSession({
        keys:[process.env.COOKIE_SECRET_OR_KEY]
    }))
    // For json requests.
    app.use(bodyParser.json())
    // For url requests.
    app.use(bodyParser.urlencoded({
        extended:true
    }))
    // For the login sessions.
    app.use(session({
        secret:process.env.COOKIE_SECRET_OR_KEY,
        saveUninitialized:false,
        resave:false,
        cookie:{
            secure:true
        },
        store:new MongoStore({
            mongooseConnection:db
        })
    }))
    // Pass all requests to the apiRouter.
    app.all('*',apiRouter)
    // Open the connection.
    app.listen(port,function(){
        console.log('Connected to app')
    })



})