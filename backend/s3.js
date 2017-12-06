// Handle requests.
module.exports.handleRequest = function(req,res,next) {
    // Handle all get requests.
    function get(req,res,next) {
        // Responsible for sending data to specified helper(s).
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

module.exports.createObject = function() {
    // Create aws object.
    var aws = require('aws-sdk')
    aws.config = new aws.Config()
    aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID
    aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    aws.config.region = "us-east-1"

    // Return s3 related items.
    return {
        s3:new aws.S3(),
        s3Params:{ Bucket: 'nameless-fortress-95164' },
        s3Url:'https://s3.amazonaws.com/nameless-fortress-95164/'
    }
}

module.exports.getGroupImages = function(req,res,next,group) {
    var s3Object = Helper.s3.createObject()
    var images = []

    s3Object.s3.listObjects(s3Object.s3Params,function(err,data){
        if (err) { console.log(err) } 
        else {
            for (var key in data.Contents) {
                var imageName = data.Contents[key]['Key']
                var noExtension = imageName.replace('.jpg','')
                var groupNumber = noExtension.split('_')[1]
                if (Number(group) == Number(groupNumber)) {
                    var url = s3Object.s3Url + imageName
                    images.push(url)
                }
            }
            res.render('../html/index',{
                imageArray:images
            })
        }
    })
}