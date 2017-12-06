// Handle requests.
module.exports.handleRequest = function(req,res,next) {
    // Handle all get requests.
    function get(req,res,next) {
        // Declare the acceptable paths to this route (/*).
        var authPaths = ['/login','/create','/reset']
        var dashboardPaths = ['/dashboard']

        // Route paths to functions or send rendered html pages.
        if (authPaths.indexOf(req.path) >= 0) {
            res.render('../html/login',{status:'Ready'})
        } else if (dashboardPaths.indexOf(req.path) >= 0) {
            next()
        } else {
            next()
        }
    }

    // Handle all post requests.
    function post(req,res,next) {
        // Responsible for sending data to specified helper(s).
    }

    // Calls handleGet method.
    if (req.method == 'GET') { get(req,res,next) } 
    // Calls handlePost method.
    else if (req.method == 'POST') { post(req,res,next) }
}

module.exports.login = function(req,res,next) {

}

module.exports.create = function(req,res,next) {
    
}

module.exports.reset = function(req,res,next) {
    
}