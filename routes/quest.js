const express = require("express")
const { addQuestion, getQuestions } = require("../controller/questions")
const router = express.Router()


router.post("/question", addQuestion)
router.get("/questions",getQuestions)



module.exports=router