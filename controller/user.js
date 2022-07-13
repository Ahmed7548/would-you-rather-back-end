const Question = require("../model/question.js");
const User = require("../model/user.js");

exports.searchUsers= async (req, res, next) => {
	// const userId = req.body.userId || req.query.userId
	const name = req.body.name || req.query.name
	
	const findUser=User.find({},{email:0,password:0,confirmPassword:0})


	try {
		const users = await User.find({},{email:0,password:0,confirmPassword:0}).populate(["answers","questions"])
		res.status(200).json(users);
	} catch (err) {
		console.log(err);
	}
};

exports.answerQuestion = async (req, res, next) => {
	const questionId = req.body.questionId || req.query.questionId;
	const choice = req.body.choice || req.query.choice;
	const user = req.body.user;


	try {
		const question = await Question.findById(questionId);
		if (!question) {
			return res
				.status(400)
				.json({ msg: "there is no question found to add the answer to" });
		}
		const questionUpdateQuery = Question.updateOne({ _id: questionId,"answers.userId": { $ne: user.id } }, {
			$push: {
				answers: {
					UId: questionId,
					answer: choice,
			}
		}})
		const userUpdateQuery =  User.updateOne(
			{ _id: user.id, "answers.qId": { $ne: question.id } },
			{
				$push: {
					answers: {
						qId: questionId,
						answer: choice,
					},
				},
			}
		);
		const [userUpdate,questionUpdate]= await Promise.all([await userUpdateQuery,await questionUpdateQuery])
		if (userUpdate.modifiedCount === 0||questionUpdate.modifiedCount===0) {
			return res
				.status(400)
				.json({ msg: "this question has already ben answered" });
		}
		res.status(200).json({ msg: "question answer stored successfully" });
	} catch (err) {
		console.log(err);
		next(err);
	}
};
