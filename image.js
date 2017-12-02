var mongoose = require('mongoose')
var ImageSchema = new mongoose.Schema({
	image:{type:String,required:false},
	url:{type:Boolean,required:false}
})
var Image = mongoose.model('Image', ImageSchema)
module.exports = {
  Image: Image
}