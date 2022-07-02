const mongoose = require("mongoose")

const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required:true
  },
  valid: {
    type: Boolean,
    default:true
  },
  email: {
    type: String,
    required:true
  }
}, { timestamps: true })


const Token = mongoose.model("token", TokenSchema)


module.exports= Token