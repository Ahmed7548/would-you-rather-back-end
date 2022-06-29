const mongoose = require("mongoose")


const connectToDataBase = async (url,cb) => {
  await mongoose.connect(url)
  try {
    cb()
    // console.log(mongoose.connection)
  } catch(err) {
    console.log(err)
  }
}

module.exports= connectToDataBase