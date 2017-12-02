module.exports = function(app) {
    app.use('/*',function(){
        console.log('connecting to this app')
    })
}