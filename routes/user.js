const express= require("express")
const { getuser } = require("../controller/user")
const router = express.Router()

router.get("/users",getuser)



module.exports=router