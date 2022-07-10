const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../model/Tokens");
const {getImgUrl}=require("../utils/helpers")

// const getImgUrl = (file) => {
// 	console.log(file);
// 	return file.path.replaceAll("\\\\", `/`).replace(/public/g, "");
// };

exports.signup = async (req, res, next) => {
	// return res.send(getImgUrl(req.file))
	if (!req.file) {
		return res.status(403).send("you must enter a file");
	}
	const { name, password, confirmedPassword, email } = req.body;
	const imgURL = getImgUrl(req.file);
	const user = new User({
		name,
		password,
		confirmPassword: confirmedPassword,
		email: email,
		avatarURL: imgURL,
	});
	try {
		await user.save();
		return res.status(200).json({ msg: "user has signed up successfully " });
	} catch (err) {
		console.log(err);
		res.send(err.message);
	}
};

exports.logIn = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(400).json({ msg: "the email is wrong" });
		}

		if (!bcrypt.compare(password, user.password)) {
			return res.status(403).json({ msg: "you entered an invvalid password" });
		}
		const token = jwt.sign(
			{ name: user.name, email: user.email, id: user._id },
			process.env.MYSECRET,
			{ expiresIn: 300 }
		);
		const refreshToken = jwt.sign(
			{ name: user.name, email: user.email, id: user._id },
			process.env.RFSHSECRET,
			{
				noTimestamp: false,
			}
		);
		const sentUser = {
			name: user.name,
			email: user.email,
			questions: user.questions,
			answers: user.answers,
		};
		await new Token({ token: refreshToken, email: user.email }).save();
		res.cookie("accessToken", token, { httpOnly: true, maxAge: 500000 });
		// setting the path on refresh token so it will only be sent when request is made to that specific path
		res.cookie("refreshToken", refreshToken, { path: "/auth/refresh" });
		res.status(200).json({
			...sentUser,
			password: null,
			accesToken: token,
			refreshToken: refreshToken,
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.refreshAccess = async (req, res, next) => {
	const refreshToken = req.cookies.refreshToken;
	let verifiedUser = null;
	jwt.verify(refreshToken, process.env.RFSHSECRET, (err, decoded) => {
		if (err) {
			return;
		}
		verifiedUser = decoded;
	});
	if (!verifiedUser) {
		return res.status(403).json({ msg: "access denied" });
	}
	try {
		const storedToken = await Token.findOne({ token: refreshToken });
		if (!storedToken || !storedToken.valid) {
			return res.status(403).json({ msg: "access denied" });
		}
		const token = jwt.sign(
			{
				name: verifiedUser.name,
				email: verifiedUser.email,
				id: verifiedUser.id,
			},
			process.env.MYSECRET,
			{
				// expiresIn: 300,
			}
		);
		res.cookie("accessToken", token);
		res.status(200).json({ msg: "access token sent" });
	} catch (err) {
		console.log(err);
		next(err);
	}
};

// protected route
exports.signOut = async (req, res, next) => {
	const { refreshToken } = req.cookies;
	if (!refreshToken) {
		return res.status(403).json({ msg: "no token provided" });
	}
	try {
		await Token.deleteOne({ token: refreshToken });
		res.status(200).json({ msg: "signed out successfully" });
	} catch (err) {
		console.log(err);
		next(err);
	}
};
