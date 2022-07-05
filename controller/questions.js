const Question = require("../model/question");
const User = require("../model/user");

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
	const addQuestionToUSer = User.where("_id").equals(author).update({
		$push:{questions:question._id}
	})
	try {
		await Promise.all[question.save(),addQuestionToUSer.exec()]
		res.status(201).json({ msg: "question added successfuly" });
	} catch (err) {
		console.log(err);
		next(err);
	}
};


exports.getQuestion = (req,res,next) => {
	
}
