const Question = require("../model/question.js");
const User = require("../model/user.js");

exports.getusers = async (req, res, next) => {
	try {
		const users = await User.find({},{email:0,password:0,confirmPassword:0})
		res.status(200).json(users);
	} catch (err) {
		console.log(err);
	}
};

exports.answerQuestion = async (req, res, next) => {
	const questionId = req.body.questionId || req.query.questionId;
	const choice = req.body.choice || req.query.choice;
	const user = req.body.user;

	// const { questionId, choice, user } = req.query;
	console.log(questionId);
	try {
		const question = await Question.findById(questionId);
		console.log(question);
		if (!question) {
			return res
				.status(400)
				.json({ msg: "there is no question found to add the answer to" });
		}

		const update = await User.updateOne(
			{ _id: user.id, "answers.qId": { $ne: question } },
			{
				$push: {
					answers: {
						qId: questionId,
						answer: choice,
					},
				},
			}
		);
		console.log(update);
		if (update.modifiedCount === 0) {
			return res
				.status(400)
				.json({ msg: "this question has already ben answered" });
		}
		res.status(204).json({ msg: "question answer stored successfully" });
	} catch (err) {
		console.log(err);
		next(err);
	}
};
