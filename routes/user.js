const express= require("express")
const { getuser, answerQuestion } = require("../controller/user")
const { checkAccess } = require("../middleware/auth")
const router = express.Router()

router.get("/users", getuser)
router.put("/answer",checkAccess,answerQuestion)



module.exports=router