const mongoose = require("mongoose")
const ObjectId=mongoose.Schema.Types.ObjectId

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required:true
  },
  author: {
    type: ObjectId,
    required:true
  },
  optionOne: {
    votes: [{ type: ObjectId }],
    text: {
      type: String,
      required:true
    }
  },
  optionTwo: {
    votes: [{ type: ObjectId }],
    text: {
      type: String,
      required:true
    }
  }
}, {
  timestamps:true
})


const Question = mongoose.model("question", questionSchema)

module.exports=Question