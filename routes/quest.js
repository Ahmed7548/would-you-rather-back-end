const express = require("express")
const { addQuestion, getQuestions } = require("../controller/questions")
const router = express.Router()

//json validator
const {bodyQueryValidator} = require("../middleware/json-validator")
const ajvInstance=require("../json-schemas/ajv-instance")


router.post("/question", bodyQueryValidator(ajvInstance.getSchema("add-question")),addQuestion)
router.get("/questions",bodyQueryValidator(ajvInstance.getSchema("get-questions")),getQuestions)



module.exports=router