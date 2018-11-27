const path = require('path');
const requireConfig = require("./require.config.js");
const TerserPlugin = require('terser-webpack-plugin');
const jsonfile = require("jsonfile");

var packageJSON = jsonfile.readFileSync("package.json");
var splittedVersion = packageJSON.version.split(".");
var splittedMinorBuild = splittedVersion[2].split("-");
splittedMinorBuild[0]++;
var newVersion = [splittedVersion[0], splittedVersion[1], splittedMinorBuild.join("-")].join(".");
packageJSON.version = newVersion;

jsonfile.writeFileSync("package.json", packageJSON, { spaces : 4 });

module.exports = {
  	entry: {
  		plot3 : 'Plot3/Plot3Core',
  		server : "ServerDev",
  		// app : 'Plot3/Plot3Core',
  	},
  	output: {
  	  filename: '[name].min.js',
  	  path: path.resolve(__dirname, 'dist'),
  	  libraryTarget: 'umd',
  	  auxiliaryComment: 'Test Comment'
  	},
    optimization: {
        minimizer: [new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          terserOptions: {
            ecma: 5,
            warnings: false,
            parse: {},
            compress: {},
            mangle: true, // Note `mangle.properties` is `false` by default.
            module: false,
            output: null,
            toplevel: false,
            nameCache: null,
            ie8: false,
            keep_classnames: undefined,
            keep_fnames: false,
            safari10: true
          }
        })]
    },
  	module : {
  		rules : [
  			  {
	            test: /\.(js$)/,
	            use: [{
	                loader: "babel-loader"
	            }]
	        },
          {
              test: /\.(json)/,
              type: "javascript/auto",
              use: [{
                  loader : path.resolve(__dirname, "scripts/unexportize.js")
              }],
          }
  		]
  	},
  	resolve : {
  		modules: ["src", "node_modules"],
  		alias : {
  			   "postal"        : "postal/postal",
            "unicycle"      : "unicycle/unicycle",
            "tweener"       : "tweener/tweener",
            "todo"          : "todojs/todo",
            "three"         : "threejs_r79_custom/build/three",
            "file"          : "requirejs-text/text",
            "dollaclass"    : "dollaclass/dollaclass",
            "centrifuge"    : "centrifuge/centrifuge",
            "sender"        : "sender/sender",
            "superagent"    : "superagent",
            "harmony"       : "harmony/harmony"
  		}
  	},
  	resolveLoader : {
        alias: {
            "txt" : "raw-loader"
        }
    },
};