var express = require('express')
var apiRouter = express.Router()
var Image = require("./image.js").Image
var async = require('async')
var reader = require('fs');

var aws = require('aws-sdk');

aws.config = new aws.Config();
aws.config.accessKeyId = process.env.AWS_SES_YY_ACCESS;
aws.config.secretAccessKey = process.env.AWS_SES_YY_SECRET;
aws.config.region = "us-east-1";
var s3 = new aws.S3();
var s3Bucket = new aws.S3( { params: {Bucket: 'yumyum-images'} } )

apiRouter.get('*', function(req,res,next){

	var fileName = req.query['file-name'];
	var fileType = req.query['file-type'];
	var s3Params = {
		Bucket: 'yumyum-images',
		Key: fileName,
		Expires: 60,
		ContentType: fileType,
		ACL: 'public-read'
	};

	s3.getSignedUrl('putObject', s3Params, (err, data) => {
		if(err){
			console.log(err);
			return res.json({
				status:false,
				reason:err
			})
		}
		var returnData = {
			signedRequest: data,
			url: 'https://yumyum-images.s3.amazonaws.com/' + fileName
		};
		res.write(JSON.stringify(returnData));
		res.end();
	});

})

module.exports = apiRouter