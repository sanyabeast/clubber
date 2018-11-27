module.exports = function(source){
	source = source.replace("module.exports = ", "");
	return source;
}