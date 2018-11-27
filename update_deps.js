var jsonfile = require("jsonfile");
var colors = require("colors");
var fs = require("fs");
var fsExtra = require("fs-extra");
var rimraf = require("rimraf");
var path = require("path");
var exec = require('child_process').exec;

var package = jsonfile.readFileSync("package.json");

for (var k in package.dependencies){
	if (package.dependencies[k].indexOf("git://") > -1){
		clone(package.dependencies[k], "node_modules", k);
	}
}

for (var k in package.devDependencies){
	if (package.devDependencies[k].indexOf("git://") > -1){
		clone(package.devDependencies[k], "node_modules", k);
	}
}

function clone(gitUrl, location, dirName){
	gitUrl = gitUrl.replace("git://", "https://");
	var targetPath = path.join(location, dirName);
	rimraf(targetPath, function(err, data){
		if (err){
			console.log("Unable to remove directory `".red + targetPath + "`".red, err);
		} else {
			fs.mkdirSync(targetPath);
			exec(["git", "clone", gitUrl, "./"].join(" "), {
				cwd : targetPath
			}, function(err, stdout, stderr){
				if (err){
					console.log("Cloning failed".red, err);
				}
			});
		}
	});
}