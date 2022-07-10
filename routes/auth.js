const express = require("express")
const router = express.Router()

const multer = require("multer")
const { signup, logIn, refreshAccess, signOut } = require("../controller/auth")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null,`./public/uploads`)
  }, filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[file.mimetype.split("/").length - 1];
    cb(null, `image-${Date.now()}.${extension}`);
  }
})


const fileFilter = (req,file,cb) => {
  console.log(file,"ahooo")
  if (
    file &&
    file.mimetype !== "image/png" &&
    file.mimetype !== "image/jpeg"
    ) {
      req.rightExtension = false;
      return cb(new Error("this wasn't the right exxtension"), false);
    }
    cb(null, true);
  }
  
 
  //validator//ajv instance
  const ajvInstance= require("../json-schemas/ajv-instance")
  const validator= require("../middleware/json-validator")
  
  
  
const uploads = multer({ storage: storage, fileFilter: fileFilter, })

router.post("/signup", uploads.single("image"),validator(ajvInstance.getSchema("signup")), signup)
router.post("/login",validator(ajvInstance.getSchema("login")), logIn)
router.post("/refresh/sign-out",signOut)
router.get("/refresh/access",refreshAccess)



module.exports =router