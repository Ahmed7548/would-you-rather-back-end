const Question = require("../model/question");
const User = require("../model/user");

Question;

exports.addQuestion = async (req, res, next) => {
	const { text, author, optionOne, optionTwo } = req.body;
	const question = new Question({
		text: text,
		author: author,
		timeStamp: {
			default: Date.now(),
		},
		optionOne: {
			text: optionOne,
			votes: [],
		},
		optionTwo: {
			text: optionTwo,
			votes: [],
		},
	});
	const addQuestionToUSer = User.where("_id")
		.equals(author)
		.update({
			$push: { questions: question._id },
		});
	try {
		await Promise.all[(question.save(), addQuestionToUSer.exec())];
		res.status(201).json({ msg: "question added successfuly" });
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.getQuestions = async (req, res, next) => {
	const { userId, questionId, search, page, limit } = req.query;

	const findQuestions = Question.find();

	if (page &&page>0 && limit) findQuestions.skip(limit * (page - 1));
	if (limit) findQuestions.limit(limit);
	if (userId) findQuestions.where("author").equals(userId);
	if (questionId) findQuestions.where("_id").equals(questionId);
	if (search) findQuestions.where("text").regex(`.*${search}.*`);
	
	try {
		const questions = await findQuestions;
		res.status(200).json(questions);
	} catch (err) {
		console.log(err);
		next(err);
	}
};
