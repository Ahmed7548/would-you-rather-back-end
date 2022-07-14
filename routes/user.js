const express = require("express");
const { searchUsers, answerQuestion,getUser } = require("../controller/user");
const { checkAccess } = require("../middleware/auth");
const router = express.Router();

//json validator
const {bodyQueryValidator,paramsValidator} = require("../middleware/json-validator");
const ajvInstance = require("../json-schemas/ajv-instance");

router.get(
	"/users",
	checkAccess,
	bodyQueryValidator(ajvInstance.getSchema("search-users")),
	searchUsers
);
router.put(
	"/answer",
	checkAccess,
	bodyQueryValidator(ajvInstance.getSchema("answer-question")),
	answerQuestion
	);
	
	router.get(
		"/:id",
		checkAccess,
		paramsValidator(ajvInstance.getSchema("single-user")),
		getUser
	);
	module.exports = router;
	