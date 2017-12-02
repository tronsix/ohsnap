var path = require('path')
var express = require('express')
var apiRouter = express.Router()

apiRouter.get('*', function(req,res,next){
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
})

module.exports = apiRouter