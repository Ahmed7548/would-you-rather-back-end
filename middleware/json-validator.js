const fs = require("fs");

const validator = (validatorObj) => {
	return (req, res, next) => {
		const valid = validatorObj({ ...req.query, ...req.body });
		if (!valid) {
			if (req.file) {
				fs.unlink(`./${req.file.path}`, (err) => {
					console.log(err);
				});
			}
			const errors = validatorObj.errors;
			return res.status(403).json({
				errors: errors.map((ele) => {
					return { msg: ele.instancePath + " " + ele.message };
				}),
			});
		}
		return next();
	};
};

// const testValidator = () => {
// 	return (ajvValidator) => {
// 		return (req, res, next) => {
// 			const valid = ajvValidator({ ...req.query, ...req.body });
// 				if (!valid) {
// 					if (req.file) {
// 						fs.unlink(`./${req.file.path}`, err => {
// 							console.log(err)
// 						})
// 					}
// 					const errors = ajvValidator.errors;
// 					return res.status(403).json({
// 						errors: errors.map((ele) => {
// 							return { msg: ele.instancePath + " " + ele.message };
// 						}),
// 					});
// 				}
// 				return next();
// 		};
// 	}
// }

// class Validator {
// 	constructor(instance) {
// 		this.ajv=instance
// 	}
// 	_deleteFile(...paths) {
// 		paths.forEach(path => {
// 			fs.unlink(`./${path}`, err => {
// 				console.log(err)
// 			})
// 		})
// 	}
// 	bodyAndQueryValidator(schemaName) {
// 		const validatorObj=this.ajv.getSchema(schemaName)
// 		return (req, res, next) => {
// 			const valid = validatorObj({ ...req.query, ...req.body });
// 				if (!valid) {
// 					if (req.file) {
// 						this._deleteFile(req.file.path)
// 					}
// 					if (req.files.length > 0) {
// 						this._deleteFile(...req.file.map(file=>file.path))
// 					}
// 					const errors = validatorObj.errors;
// 					return res.status(403).json({
// 						errors: errors.map((ele) => {
// 							return { msg: ele.instancePath + " " + ele.message };
// 						}),
// 					});
// 				}
// 				return next();
// 		};
// 	}
// 	paramValidator(schemaName) {
// 		const validatorObj=this.ajv.getSchema(schemaName)
// 		return (req, res, next) => {
// 			const valid = validatorObj({ ...req.params});
// 				if (!valid) {
// 					if (req.file) {
// 						this._deleteFile(req.file.path)
// 					}
// 					if (req.files.length > 0) {
// 						this._deleteFile(...req.file.map(file=>file.path))
// 					}
// 					const errors = validatorObj.errors;
// 					return res.status(403).json({
// 						errors: errors.map((ele) => {
// 							return { msg: ele.instancePath + " " + ele.message };
// 						}),
// 					});
// 				}
// 				return next();
// 		};
// 	}
// }

const deleteFile = (...paths) => {
	paths.forEach((path) => {
		fs.unlink(`./${path}`, (err) => {
			console.log(err);
		});
	});
};

const validatorCreator = (...reqProps) => {
	return (validatorObj) => {
		return (req, res, next) => {
			const data = {};
			reqProps.forEach((prop) => {
				Object.assign(data, req[prop]);
			});
			const valid = validatorObj(data);
			if (!valid) {
				if (req.file) {
					deleteFile(req.file.path);
				}
				if (req.files&&req.files.length > 0) {
					deleteFile(...req.file.map((file) => file.path));
				}
				const errors = validatorObj.errors;
				return res.status(403).json({
					errors: errors.map((ele) => {
						return { msg: ele.instancePath + " " + ele.message };
					}),
				});
			}
			req.body=data
			return next();
		};
	};
};

exports.bodyQueryValidator = validatorCreator("body", "query");
exports.paramsValidator = validatorCreator("params");
// module.exports = validatorCreator;
