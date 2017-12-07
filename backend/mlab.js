// Handle requests.
module.exports.handleRequest = function(req,res,next) {
    console.log(req.params.method)
    // Handle all get requests.
    function get(req,res,next) {
        // Responsible for sending data to specified helper(s).
    }

    // Handle all post requests.
    function post(req,res,next) {
        // Responsible for sending data to specified helper(s).
        console.log(req.path)
        res.sendStatus(200)
    }

    // Calls handleGet method.
    if (req.method == 'GET') { get(req,res,next) } 
    // Calls handlePost method.
    else if (req.method == 'POST') { post(req,res,next) }
}