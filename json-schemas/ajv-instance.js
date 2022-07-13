const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajvInstance = new Ajv({
    allErrors: true,
    coerceTypes: true,
    allowUnionTypes:true
})
addFormats(ajvInstance)




//schemas
const loginSchema = require("./schemas/login.json")
const signUpSchema = require("./schemas/sign-up.json")
const addQuestionSchema = require("./schemas/add-question.json")
const getQuestions = require("./schemas/getQuestions.json")
const answerQuestion= require("./schemas/answerQuestion.json")


//
const strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
const alpha = new RegExp(/^[a-zA-Z]+$/)
const alphNumericRgx = new RegExp(/[a-zA-Z0-9]/)
const checkForObjectId = new RegExp(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
const checkIfStrOfInt = new RegExp('^[0-9]*$')
const checkIfStrOfFlt = new RegExp('[+-]?([0-9]*[.])?[0-9]+')
const checkIfUnvSize = new RegExp('^(\d*(?:M|X{0,2}[SL]))(?:$|\s+.*$)')
const checkIfhexColor = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")


ajvInstance.addFormat('strong-password', {
    validate: (password)=> strongPassword.test(password)
})

ajvInstance.addFormat("int-string-only", {
    validate: (string)=>checkIfStrOfInt.test(string)
})

ajvInstance.addFormat("number-string", {
    validate: (string)=>checkIfStrOfFlt.test(string)
})

ajvInstance.addFormat('objectId', {
    validate:(string)=> checkForObjectId.test(string)
})

ajvInstance.addFormat('only-letters', {
    validate: (alpah)=>alpha.test(alpah)
})

ajvInstance.addFormat('alph-numeric', {
    validate:(string)=>alphNumericRgx.test(string)
})


ajvInstance.addFormat('universal-size', {
    validate:(string)=> checkIfUnvSize.test(string)
})

ajvInstance.addFormat("cate-abrv", {
    validate:(input)=> input.trim().length===2
})

ajvInstance.addFormat("num-size", {
    validate:(input)=>parseFloat(input)>22&&parseFloat(input)<50
})

ajvInstance.addFormat("size", {
    validate: (input) => {
        if ((parseFloat(input) > 22 && parseFloat(input) < 50) || checkIfUnvSize.test(input)) return true
        return false
    }
})

ajvInstance.addFormat('hex-decimal-color', {
    validate:(string)=> checkIfhexColor.test(string)
})

ajvInstance.addFormat("positive-number", {
    validate:(input)=>input>=0
})

ajvInstance.addFormat("positive-intiger", {
    validate: (input) => {
        const num=parseFloat(input)
        if (typeof input === "string") {
            if (isNaN(num)) return false
        }
        if (Math.floor(num) !== num) return false
        return true
    }
})

ajvInstance.addFormat("five-star-rating", {
    validate:(input)=>input>=0&&input<=5
})

ajvInstance.addFormat("number-string", {
    validate:(input)=>parseFloat(input)!==NaN&& parseFloat(input)>=0
})


ajvInstance.addSchema(loginSchema, "login")
ajvInstance.addSchema(signUpSchema,"signup")
ajvInstance.addSchema(addQuestionSchema, "add-question")
ajvInstance.addSchema(getQuestions,"get-questions")
ajvInstance.addSchema(answerQuestion,"answer-question")






module.exports=ajvInstance