const express = require("express")
const { addQuestion, getQuestions } = require("../controller/questions")
const router = express.Router()

//json validator
const validator = require("../middleware/json-validator")
const ajvInstance=require("../json-schemas/ajv-instance")


router.post("/question", validator(ajvInstance.getSchema("add-question")),addQuestion)
router.get("/questions",validator(ajvInstance.getSchema("get-questions")),getQuestions)



module.exports=router