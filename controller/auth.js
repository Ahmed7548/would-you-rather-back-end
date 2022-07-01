const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../model/Tokens");

const getImgUrl = (file) => {
	console.log(file);
	return file.path.replaceAll("\\\\", `/`).replace(/public/g, "");
};

exports.signup = async (req, res, next) => {
	// return res.send(getImgUrl(req.file))
	if (!req.file) {
		return res.status(403).send("you must enter a file");
	}
	const { name, password, confirmedPassword, email } = req.body;
	console.log(email);
	console.log(req.file, "isfiel");
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
			{ name: user.name, avatarURL: user.avatarURL },
			process.env.MYSECRET,
			{ expiresIn: 30 }
		);
		const refreshToken = jwt.sign({ name: user.name }, process.env.RFSHSECRET, {
			noTimestamp: false,
		});
		const sentUser = {
			name: user.name,
			email: user.email,
			questions: user.questions,
			answers: user.answers,
		};
		await new Token({ token: refreshToken }).save();
		res.cookie("accessToken", token);
		res.cookie("refreshToken", refreshToken);
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
			return res.status(403).json({ msg: "access denied" });
		}
		verifiedUser = decoded;
	});
	if (!verifiedUser) {
		return res.status(403).json({ msg: "access denied" });
	}
	try {
		const storedToken = await Token.findOne({ token: refreshToken });
		if (!storedToken.valid) {
			return res.status(403).json({ msg: "access denied" });
		}
		const token = jwt.sign(verifiedUser, process.env.MYSECRET, {
			expiresIn: 300,
		});
    res.cookie("accessToken", token);
    res.status(200).json({msg:"access token sent"})
	} catch (err) {
		console.log(err);
		next(err);
	}
};
