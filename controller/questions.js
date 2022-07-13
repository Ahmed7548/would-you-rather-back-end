const Question = require("../model/question");
const User = require("../model/user");

Question;

exports.addQuestion = async (req, res, next) => {
	const { text, user, optionOne, optionTwo } = req.body;
	const question = new Question({
		text: text,
		author: user.id,
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
	const addQuestionToUSer = User.updateOne(
		{ _id: user.id },
		{ $push: { questions: question._id } }
	);
	try {
		await Promise.all[(question.save(), addQuestionToUSer.exec())];
		res.status(201).json({ msg: "question added successfuly" });
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.getQuestions = async (req, res, next) => {
	const { userId, id, search, page, limit } = req.query;

	const findQuestions = Question.find();

	if (page && page > 0 && limit) findQuestions.skip(limit * (page - 1));
	if (limit) findQuestions.limit(limit);
	if (userId) findQuestions.where("author").equals(userId);
	if (id) findQuestions.where("_id").equals(id);
	if (search) findQuestions.where("text").regex(`.*${search}.*`);
	findQuestions.populate("author");
	try {
		const questions = await findQuestions;
		res.status(200).json(questions);
	} catch (err) {
		console.log(err);
		next(err);
	}
};
