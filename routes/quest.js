const express = require("express")
const { addQuestion } = require("../controller/questions")
const router = express.Router()


router.post("/question",addQuestion)



module.exports=router