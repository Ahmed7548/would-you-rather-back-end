const Question = require("../model/question");

Question;

exports.addQuestion = async (req, res, next) => {
	const { text, author, optionOne, optionTwo } = req.body;
	const question = new Question({
		text: text,
    author: author,
    timeStamp: {
      default:Date.now()
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
	try {
		await question.save();
		res.status(201).json({ msg: "question added successfuly" });
	} catch (err) {
		console.log(err);
		next(err);
	}
};
