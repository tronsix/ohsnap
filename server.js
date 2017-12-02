var fs = require('fs')
if (fs.existsSync('.env')) {
    var dotenv = require('dotenv')
    dotenv.load()
}
var port = process.env.PORT
var express = require('express')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var mongoose = require('mongoose')
var dburl = process.env.MONGODB_URI
var db = mongoose.connection

mongoose.Promise = global.Promise
mongoose.connect(dburl)

db.on('error',console.error.bind(console,'error: '))
db.once('open',function(){

    var app = express()

    app.use(express.static('./public'))
    app.use(cookieSession({
        keys:[process.env.COOKIE_SECRET_OR_KEY]
    }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended:true
    }))
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
    
    // us this router
    require('./backend/routerMain.js')(app)

    app.listen(port,function(){
        console.log('Connected to app')
    })



})