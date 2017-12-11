module.exports.getImage = function(req,res,next) {
    var imageUrl = process.env.S3_HOST_URL + '/' + process.env.S3_BUCKET + '/' + req.params.image + '.jpg'
    var stripeKey;
    if (req.headers.host.includes(process.env.APP_NAME)) {
        stripeKey = process.env.STRIPE_LIVE_FRONT
    } else {
        stripeKey = process.env.STRIPE_DEBUG_FRONT
    }

    res.render('../html/image',{
        imageUrl:imageUrl,
        stripeKey:stripeKey
    })

}



module.exports.postMessage = function(req,res,next) {

    if (Number(req.body.Body) < 1) {
        module.exports.sendTwilioMessage(req,res,next,'Could not find image. Fix your message and try again.')
    } else {
        console.log(req.body.From + ' is requesting: ' + req.body.Body)

        function creates3Object() {
            var aws = require('aws-sdk')
            aws.config = new aws.Config()
            // aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID
            // aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
            aws.config.region = "us-east-1"
        
            // Return s3 related items.
            var url = process.env.S3_HOST_URL + '/' + process.env.S3_BUCKET
            return {
                s3:new aws.S3(),
                s3Params:{ Bucket: process.env.S3_BUCKET },
                s3Url: url
            }
        }

        
        var s3Object = creates3Object()
        var requestedImage = 'FunRun' + Number(req.body.Body)
        var sendImage = ''

        s3Object.s3.listObjects(s3Object.s3Params,function(err,data){
            if (err) {
                console.log(err)
                res.sendStatus(500)
            } else {

                for (var i = 0; i < data.Contents.length; i++) {
                    var imageName = data.Contents[i]['Key'].replace('.jpg','')
                    if (imageName == requestedImage) {
                        sendImage = 'https://lnp.media/images' + '/' + imageName
                    }
                }

                if (sendImage == '') {
                    module.exports.sendTwilioMessage(req,res,next,'Please try again in a few minutes.')
                } else {
                    module.exports.sendTwilioMessage(req,res,next,sendImage)
                }

            }
        })


    }

}

module.exports.sendTwilioMessage = function(req,res,next,message) {
    var twilio = require('twilio')
    var MessagingResponse = twilio.twiml.MessagingResponse
    var twiml = new MessagingResponse()

    twiml.message(message)

    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString())
}


module.exports.downloadImage = function(req,res,next) {


    console.log(req.body)
    console.log(req.params)

    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe;
    if (req.headers.host.includes(process.env.APP_NAME)) {
        stripe = require("stripe")(process.env.STRIPE_LIVE_BACK)
    } else {
        stripe = require("stripe")(process.env.STRIPE_DEBUG_BACK)
    }

    // console.log(req.body)
    // console.log(req.params)

    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    var token = req.body.stripeToken; // Using Express

    // Charge the user's card:
    stripe.charges.create({
        amount: 199,
        currency: "usd",
        description: "Download Image",
        source: token,
    }, function(err, charge) {
    // asynchronously called
        if (err) {
            console.log(err)
        } else {
            console.log(charge)
        }
    });
}