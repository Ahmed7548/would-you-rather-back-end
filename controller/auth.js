const User = require("../model/user")
const jwwt=require("jsonwebtoken")

const getImgUrl = (file) => {
  console.log(file)
 return file.path.replaceAll("\\\\", `/`).replace(/public/g, "")
}


exports.signup = async (req, res, next) => {
  // return res.send(getImgUrl(req.file))
  if (!req.file) {
    return res.status(403).send("you must enter a file")
  }
  const { name, password, confirmedPassword, email } = req.body
  console.log(email)
  console.log(req.file,"isfiel")
  const imgURL=getImgUrl(req.file)
  const user = new User({ name, password, confirmPassword: confirmedPassword, email:email,avatarURL:imgURL })
  try {
    await user.save()
    return res.status(200).json({msg:"user has signed up successfully "})
  } catch (err) {
    console.log(err)
    res.send(err.message)
  }
}