 exports.getImgUrl = (file) => {
	console.log(file);
	return file.path.replaceAll(`\\`, `/`).replace(/public/g, "");
};