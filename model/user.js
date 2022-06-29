const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required:[true,"name is required"]
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required:true,
  },
  avatarURL: {
    type: String,
    required:[true,"user avatar is required"]
  },
  answers: [{qID:{type:ObjectId,required:true},answer:{type:String,enum:["optionOne","optionTwo"]}}],
  questions:[{type:ObjectId,ref:"question"}]
},{timestamps:true})




const User = mongoose.model("user", userSchema)


module.exports=User
