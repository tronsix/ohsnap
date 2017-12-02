module.exports = function(app) {
    var uploadimage = require('./uploadImage.js')
    app.use('/upload', uploadimage)
    
    var gethome = require('./gethome.js')
    app.use('*', gethome)
}