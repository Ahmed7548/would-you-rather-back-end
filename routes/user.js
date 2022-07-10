const express= require("express")
const { getusers, answerQuestion } = require("../controller/user")
const { checkAccess } = require("../middleware/auth")
const router = express.Router()

router.get("/users", checkAccess,getusers)
router.put("/answer",checkAccess,answerQuestion)



module.exports=router