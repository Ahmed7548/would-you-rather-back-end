const fs= require("fs");

const validator = (ajvValidator) => {
	return (req, res, next) => {
		const valid = ajvValidator({ ...req.query, ...req.body });
			if (!valid) {
				if (req.file) {
					fs.unlink(`./${req.file.path}`, err => {
						console.log(err)
					})
				}
				const errors = ajvValidator.errors;
				return res.status(403).json({
					errors: errors.map((ele) => {
						return { msg: ele.instancePath + " " + ele.message };
					}),
				});
			}
			return next();
	};
};

module.exports = validator;