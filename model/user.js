const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
///////////
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "name is required"],
		},
		email: {
			type: String,
      required: true,
      index: true,
      unique:true
		},
		password: {
			type: String,
			required: true,
		},
		confirmPassword: {
			type: String,
		},
		avatarURL: {
			type: String,
			// required:[true,"user avatar is required"]
		},
		answers: [
			{
				qId: { type: ObjectId, required: true,ref:"question" },
				answer: { type: String, enum: ["optionOne", "optionTwo"] },
			},
		],
		questions: [{ type: ObjectId, ref: "question" }],
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	this.password = await bcrypt.hash(this.password, 12);
	this.confirmPassword = undefined;
	next();
});

// doc instant method
userSchema.methods.checkPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
