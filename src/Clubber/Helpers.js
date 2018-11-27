"use strict";
define([
		"dollaclass",
		"Clubber/Common/StringTemplate",
		"Clubber/Common/DataTypes"
	], function($Class, StringTemplate, DataTypes){

	var ClubberHelpers = new $Class({ name : "ClubberHelpers", namespace : "Clubber" }, {
		DPR : {
			static : true,
			value : window.devicePixelRatio
		},
		initTime : {
			static : true,
			value : Math.floor(+new Date())
		},
		coordScale : {
			static : true,
			value : new DataTypes.Num64(Math.pow(10, 3))
		},
		convertX : {
			static : true,
			value : function(value, toReal){
	            return toReal ? ((value * this.coordScale) + this.initTime) : ((value - this.initTime) / this.coordScale)
	        }
		},
		convertXScaleOnly : {
			static : true,
			value : function(value, toReal){
	            return toReal ? ((value * this.coordScale)) : ((value) / this.coordScale)
	        }
		},
		convertScale : {
			static : true,
			value : function(value, toReal){
				return toReal ? value * this.coordScale : value / this.coordScale;
			}
		},
		x : {
			static : true,
			value : function(value, reverse){
				return reverse ? (value * 1000 + this.initTime) : ((value - this.initTime) / 1000);
			}
		},
		/* xml */
		parseXML : {
			static : true,
			value : function(xmlString, rootElementTag){
				var rootElement = document.createElement(rootElementTag);
				rootElement.innerHTML = xmlString;
				return rootElement;
			}
		},
		selectDOMChildren : {
			static : true,
			value : function(source, selector, iteratee){
				var elements = source.querySelectorAll(selector);
				for (var a = 0, l = elements.length; a < l; a++){
					iteratee.call(this, elements[a], a, elements);
				}

				return elements;
			}
		},
		getAttributesObject : {
			static : true,
			value : function(node){
				var result = {};

				this.forEach(node.attributes, function(attribute){
					result[attribute.name] = attribute.value;
				});

				result.innerContent = node.innerHTML;

				return result;
			}
		},
		/*Colors*/
		arguments2Array : {
			static : true,
			value : function(args){
				return Array.prototype.slice.call(args);
			}
		},
		randColors : {
			static : true,
			value : [
		    	0xf44336,
		    	0xe91e63,
		    	0x9c27b0,
		    	0x3f51b5,
		    	0x2196f3,
		    	0x00bcd4,
		    	0x009688,
		    	0x4caf50,
		    	0xcddc39,
		    	0xffeb3b,
		    	0xff9800,
		    	0xff5722,
		    	
		    ]
		},
		randCssColors : {
			static : true,
			value : [
		    	"#f44336",
		    	"#e91e63",
		    	"#9c27b0",
		    	"#3f51b5",
		    	"#2196f3",
		    	"#00bcd4",
		    	"#009688",
		    	"#4caf50",
		    	"#cddc39",
		    	"#ffeb3b",
		    	"#ff9800",
		    	"#ff5722"
		    ]
		},
		randFontFamilies : {
			static : true,
			value : [
				"monospace",
				"arial",
				"cursive",
				"fantasy",
				"serif",
				"sans-serif"
			]
		},
		prevRandColor : {
			static : true,
			value : null,
			writable : true,
			configurable : true
		},
		getRandFontFamily : {
			static : true,
			value : function(){
				var fontFamily = this.prevRandFontFamily;

				while (fontFamily == this.prevRandFontFamily){
					fontFamily = this.randFontFamilies[Math.floor(Math.random() * this.randFontFamilies.length)];
				}

				this.prevRandFontFamily = fontFamily;

				return fontFamily;

			}
		},
		getRandColor : {
			static : true,
			value : function(){
				var color = this.prevRandColor;

				while (color == this.prevRandColor){
					color = this.randColors[Math.floor(Math.random() * this.randColors.length)];
				}

				this.prevRandColor = color;

				return color;

			}
		},
		getRandCssColor : {
			static : true,
			value : function(){
				return this.randCssColors[Math.floor(Math.random() * this.randCssColors.length)];
			}
		},
		unflatArray : {
			static : true,
			value : function(step, array){
	            var result = [];
	            var subArray;

	            this.forEach(array, function(value, index, array){                    
	                if (index % step == 0){
	                    subArray = [];
	                    result.push(subArray);
	                } else {

	                }

	                subArray.push(value);
	            });

	            return result;
	        },
		},
		forEach : {
			static : true,
			value : function(arr, callback, context){
				if (typeof arr.length == "number"){
					for (var a = 0, l = arr.length; a < l; a++){
						if (callback.call(context, arr[a], a, arr)){
							break;
						}
					}
				} else {
					for (var a in arr){
						if (callback.call(context, arr[a], a, arr)){
							break;
						}
					}
				}
				

				return this;
			}
		},
		forEachSampled : {
			static : true,
			value : function(arr, sampleSize, callback, context){
				var samples = [];
				var sampleIndex = 0;

				this.forEach(arr, function(element, index){
					samples.push(element);

					if ((index - sampleSize + 1) % sampleSize == 0){
						samples.unshift(sampleIndex);
						callback.apply(context, samples.slice());
						samples.length = 0;
						sampleIndex++;
					}
				});
			}
		},
		forEachReverse : {
			static : true,
			value : function(arr, callback, context){
				for (var a = arr.length - 1; a >= 0; a--){
					if (callback.call(context, arr[a], a, arr)){
						break;
					}
				}

				return this;
			}
		},
		loop : {
			static : true,
			value : function(looseEq, from, to, step, callback, context){
				if (looseEq){
					for (var a = from; a <= to; a+=step){
						if (callback.call(context, a)){
							break;
						}
					}
				} else {
					for (var a = from; a < to; a+=step){
						if (callback.call(context, a)){
							break;
						}
					}
				}
				
			}
		},
		isFunction : {
			static : true,
			value : function(token){ return typeof token == "function" }
		},
		count : {
			static : true,
			value : function(list){
				var result = 0;

				if (Array.isArray(list)){
					result = list.length;
				} else {
					for (var k in list){
						result++;
					}
				}

				return result;
			}
		},
		createObjectStamp : {
			static : true,
			value : function(object){
				var result = "";

				if (!object){
					return result;
				}

				for (var k in object){
					result = [result, [k, object[k]].join("=")].join("&")
				}
				return result;
			}
		},
		formatArray : {
			static : true,
			value : function(list, formatter, useSame){
				var result = useSame === true ? list : list.slice();

				this.forEach(result, function(value, index, list){
					result[index] = formatter(value, index);
				});

				return result;
			}
		},
		mixin : {
			static : true,
			value : function(){
				var result = {};

				for (var a =0; a < arguments.length; a++){
					for (var k in arguments[a]){
						result[k] = arguments[a][k];
					}
				}

				return result;
			}
		},
		arrSwap : {
			static : true,
			value : function(arr, i1, i2){
				var buff = arr[i1];
				arr[i1] = arr[i2];
				arr[i2] = buff;
				return arr;
			},
		},	
		arrReplace : {
			static : true,
			value : function(arr, replacer){
				var result = [];

				this.forEach(arr, function(token, index){
					result[index] = replacer(token, index);
				});

				return result;
			},
		},
		sortBy : {
			static : true,
			value : function(arr, comp, desc){
				if (!arr){
					konsole.warn("unable to perform sorting", arr);
					return;
				}

				var shuffles = 0;
				var length = arr.length;

				do {

					shuffles = 0;

					for (var a = 0, rule; a < length - 1; a++){
						rule = (desc === true) ? (comp(arr[a]) < comp(arr[a + 1])) : (comp(arr[a]) > comp(arr[a + 1]));

						if (rule){
							shuffles++;
							this.arrSwap(arr, a, a + 1);
						}
					}

				} while (shuffles > 0)

				return arr;

			}
		},
		genRandString : {
			static : true,
			value : function(length, prefix, postfix){
				var string = "";

				while(string.length < length){
					string = string + (Math.random().toString(32).substring(3, 12));
				}

				string = string.substring(0, length);
				string = [prefix || "", string, postfix || ""].join("");
				return string;
			},

		},
		arrFloat32Concat : {
			static : true,
			value : function(first, second){
			    var firstLength = first.length,
			        result = new Float32Array(firstLength + second.length);

			    result.set(first);
			    result.set(second, firstLength);

			    return result;
			}
		},
		arrFloat32Extend : {
			static : true,
			value : function(array, length){
				var extensionArrayLength = length - array.length;
				return (extensionArrayLength < 0 ) ? array.slice(0, length) : this.arrFloat32Concat(array, new Float32Array(extensionArrayLength));
			}
		},
		/*formatting*/
		formatDate : {
			static : true,
			value : function(template, dateObject){
				var hours = dateObject.getUTCHours().toString();
				var minutes = dateObject.getUTCMinutes().toString();
				var seconds = dateObject.getUTCSeconds().toString();
				var date = dateObject.getUTCDate().toString();
				var month = (dateObject.getUTCMonth() + 1).toString();
				var year = dateObject.getUTCFullYear().toString();

				hours = hours.length == 1 ? "0" + hours : hours;
				minutes = minutes.length == 1 ? "0" + minutes : minutes;
				seconds = seconds.length == 1 ? "0" + seconds : seconds;

				return StringTemplate.fast(template, {
					hours : hours,
					minutes : minutes,
					seconds : seconds,
					date : date,
					month : month,
					year : year
				});
			}
		},
		toString : {
			static : true,
			value : function(data){
				if (typeof data == "object" || typeof data == "undefined"){
					return "";
				} else {
					return data.toString();
				}
			}
		},
		objToRegExp : {
			static : true,
			value : function(obj){
				var result = "";
				this.forEach(obj, function(value, key){
					if (typeof key == "object" || typeof key == "undefined" || key == null || typeof key == "function"){
						return;
					}

					result += [key, "=", "(", value, ")"].join("");
					result += "&";
				});

				result = result.substring(0, result.length - 1);

				return result;
			}
		},
		objIsSubset : {
			static : true,
			value : function(superset, subset){
				if (typeof superset == "object") superset = this.objToRegExp(superset);
				if (typeof subset == "object") subset = this.objToRegExp(subset);


				return superset.match(new RegExp(subset, "g"));
			}
		},
		CSSHex2Hex : {
			static : true,
			value : function(value){
				return window.parseInt(value.replace("#", "0x"));
			}
		},
		constructWithParams : {
			static : true,
			value : function(constructFunc, argsMap, params){
				var args = [];

				this.forEach(argsMap, function(argName, index){
					args[index] = params[argName];
				});

				args.unshift(null);


				return new (Function.prototype.bind.apply(constructFunc, args))()

			}
		},
		dispose : {
			static : true,
			value : function(object, level){

				if (typeof object !== "object" || object == null){
					return;
				}

				if ($Class.isInstanceOf(object, "Disposable") && !object.$disposed){
					object.dispose();
				} else {
					if (level == 1 && typeof object.dispose == "function" && !object.$disposed){
						Object.defineProperty(object, "disposed", {
							value : true,
							enumerable : false
						});
						
						object.dispose();
					}

					
				}


				this.forEach(object, function(prop, name){
					if (typeof prop == "object" && prop != null && typeof prop.length != "number" && !prop.$$$checked){
						try {
							Object.defineProperty(prop, "$$$checked", {
								value : true,
								enumerable : false
							});

							setTimeout(function(){
								this.dispose(prop);
							}.bind(this), 16);
						} catch (e){}
					}
				}, this);
			}
		},
		HSL2hex : {
			static : true,
			value : function(h, s, l){
				h /= 360;
				  s /= 100;
				  l /= 100;
				  let r, g, b;
				  if (s === 0) {
				    r = g = b = l; // achromatic
				  } else {
				    const hue2rgb = (p, q, t) => {
				      if (t < 0) t += 1;
				      if (t > 1) t -= 1;
				      if (t < 1 / 6) return p + (q - p) * 6 * t;
				      if (t < 1 / 2) return q;
				      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				      return p;
				    };
				    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				    const p = 2 * l - q;
				    r = hue2rgb(p, q, h + 1 / 3);
				    g = hue2rgb(p, q, h);
				    b = hue2rgb(p, q, h - 1 / 3);
				  }
				  const toHex = x => {
				    const hex = Math.round(x * 255).toString(16);
				    return hex.length === 1 ? '0' + hex : hex;
				  };
				  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
			}
		},
		hex2HSL : {
			static : true,
			value : function(hex){
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			    var r = parseInt(result[1], 16);
			    var g = parseInt(result[2], 16);
			    var b = parseInt(result[3], 16);
			    r /= 255, g /= 255, b /= 255;
			    var max = Math.max(r, g, b), min = Math.min(r, g, b);
			    var h, s, l = (max + min) / 2;
			    if(max == min){
			      h = s = 0; // achromatic
			    }else{
			      var d = max - min;
			      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			      switch(max){
			        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			        case g: h = (b - r) / d + 2; break;
			        case b: h = (r - g) / d + 4; break;
			      }
			      h /= 6;
			    }
			  var HSL = new Object();
			  HSL['h']=h;
			  HSL['s']=s;
			  HSL['l']=l;
			  return HSL;
			}
		}
	});


	window.$Class = $Class;

	return ClubberHelpers;

});