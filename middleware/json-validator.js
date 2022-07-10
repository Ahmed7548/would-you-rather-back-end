const {getSchema}= require("../utils/helpers")

const validator = (ajvValidator) => {
	return (req, res, next) => {
			const valid = ajvValidator({...req.query,...req.body});
			if (!valid) {
				if (req.file) {
					
				}
				const errors = ajvValidator.errors;
				return res.status(403).json({
					errors: errors.map((ele) => {
						return { msg: ele.instancePath + " " + ele.message, ele };
					}),
				});
			}
			return next();
	};
};

module.exports = validator;