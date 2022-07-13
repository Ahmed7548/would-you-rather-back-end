const express = require("express");
const { searchUsers, answerQuestion } = require("../controller/user");
const { checkAccess } = require("../middleware/auth");
const router = express.Router();

//json validator
const validator = require("../middleware/json-validator");
const ajvInstance = require("../json-schemas/ajv-instance");

router.get(
	"/users",
	checkAccess,
	validator(ajvInstance.getSchema("answer-question")),
	searchUsers
);
router.put(
	"/answer",
	checkAccess,
	validator(ajvInstance.getSchema("answer-question")),
	answerQuestion
);

module.exports = router;
