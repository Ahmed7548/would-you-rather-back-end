const jwt = require("jsonwebtoken");
const secret = process.env.MYSECRET;

// const extractjsonToken = (headers) => {
// 	const authHeader = headers["authorization"];
// 	const jsonToken = authHeader ? authHeader.split(" ")[1] : false;
// 	return jsonToken;
// };

// const authorize = (headers,secret) => {
// 	// extract the jwt from the request headers
// 	const jsonToken =extractjsonToken(headers);
// 	console.log(jsonToken);
// 	//no jwt attached
// 	if (!jsonToken) return null;

// 	// verify jwt
// 	let verifiedUser = null;
// 	jwt.verify(jsonToken, secret, (err, user) => {
// 		console.log(err);
// 		if (err) return;

// 		//adding the user object to the req
// 		verifiedUser = user;
// 	});
// 	return verifiedUser;
// }

// exports.checkIfUser = (secret) => {
// 	return (req, res, next) => {
// 		const user=authorize(req.headers,secret);
// 		if (!user)
// 		return res.status(403).json({
// 			error: "403",
// 			msg: "user is not authorized to make such an action",
// 		});
// 	req.user =user
// 	next();
// }}

exports.checkAccess = (req, res, next) => {
  const { accessToken } = req.cookies
  jwt.verify(accessToken, secret, (err,decoded) => {
    if (err) {
      return res.status(403).json({msg:"access denied"})
    }
    req.body.user = decoded 
    next()
  })
}
