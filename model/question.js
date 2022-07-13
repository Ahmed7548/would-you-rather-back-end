const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const questionSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		author: {
			type: ObjectId,
			required: true,
			index:true,
			ref: "user",
		},
		optionOne: {
			votes: [{ type: ObjectId }],
			text: {
				type: String,
				required: true,
			},
		},
		optionTwo: {
			votes: [{ type: ObjectId }],
			text: {
				type: String,
				required: true,
			},
		},
		answers: {
			userId: { type: ObjectId, ref: "user" },
			answer: { type: String, enum: ["optionOne", "optionTwo"] },
		},
	},
	{
		timestamps: true,
	}
);

const Question = mongoose.model("question", questionSchema);

module.exports = Question;
