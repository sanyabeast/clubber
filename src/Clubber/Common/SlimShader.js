"use strict";
define([
		"dollaclass",
		"Clubber/Helpers",
		"Clubber/Common/StringTemplate",
		"three"
	], function($Class, Helpers, StringTemplate, THREE){

	var cache = {};

	var SlimShader = new $Class({
		name : "SlimShader",
		namespace : "Clubber.DrawManager.ShapeMaster.SlimShader"
	}, {
		$constructor : function(type, shaderXML){

			if (cache[shaderXML]){
				return cache[shaderXML];
			}


			this.$type = type;
			this.$shaderXML = shaderXML;
			this.$shaderDOM = Helpers.parseXML(shaderXML, "shader");

			cache[shaderXML] = this;
		},
		shaderCode : {
			get : function(){
				if (!this.$shaderCode){
					this.$shaderCode = this.$generateShaderCode();
				}

				return this.$shaderCode;
			}
		},
		shaderUniformsData : {
			get : function(){
				if (!this.$shaderUniformsData){
					this.$shaderUniformsData = this.$generateUniformsList();
				}

				return this.$shaderUniformsData;
			}
		},
		collectUniforms : function(finalUniformsContainer, shared, params, useFallback){
			var shaderUniformsData = this.shaderUniformsData;

			Helpers.forEach(shaderUniformsData, function(uniformData){
				var name = uniformData.name;
				var type = uniformData.type;
				var defaultValue = uniformData.defaultValue;

				var finalUniformValue;

				switch (true){
					case (typeof params[name] != "undefined"):
						if (shared.isSharedStorageKey(params[name])){
							finalUniformValue = this.$normalizeUniformValue(type, shared.getValueBySharedStorageKey(params[name]));
						} else {
							finalUniformValue = this.$normalizeUniformValue(type, params[name]);							
						}
					break;
					case (typeof shared.get(name) != "undefined"):
						finalUniformValue = this.$normalizeUniformValue(type, shared.get(name));
					break;
					case (defaultValue):
						finalUniformValue = this.$normalizeUniformValue(type, defaultValue);
					break;
					case (useFallback):
						finalUniformValue = this.$getFallbackUniformValue(type);
					break;
					default:
					break;
				}

				finalUniformsContainer[name] = {
					value : finalUniformValue
				};

			}.bind(this));

			return finalUniformsContainer;
		},
		$generateUniformsList : function(){
			var list = {}; 	

			Helpers.selectDOMChildren(this.$shaderDOM, "uniforms", function(uniformsContainer){

				Helpers.selectDOMChildren(uniformsContainer, "item", function(uniformItem){
					var name = uniformItem.getAttribute("name");
					var type = uniformItem.getAttribute("type");
					var isPredefined = uniformItem.getAttribute("predefined");
					var defaultValue = uniformItem.getAttribute("default");

					if (isPredefined){
						return;
					}

					if (typeof defaultValue == "string"){
						try {
							defaultValue = JSON.parse(defaultValue);
						} catch (err){
							defaultValue = null
						}
					}

					list[name] = {
						name : name,
						type : type,
						defaultValue : defaultValue
					};

				});

			}.bind(this));

			return list;
		},
		$generateShaderCode : function(){
			var shaderCode = "";

			/* generating uniforms declaration */

			shaderCode += this.$createItemsListCode("uniforms");
			shaderCode += this.$createItemsListCode("attributes");
			shaderCode += this.$createItemsListCode("defines");
			shaderCode += this.$createItemsListCode("varyings");

			Helpers.selectDOMChildren(this.$shaderDOM, "program", function(programNode){

				var inputProgramName = programNode.getAttribute("name");

				shaderCode += ["/*", "program", "*/\n"].join("");
				shaderCode += programNode.textContent;
				shaderCode += ["/*", "!program", "*/\n"].join("");
				shaderCode += [
					"void main(){", 
					(this.$type == "fragment" ? "gl_FragColor = " : "gl_Position = "), 
					inputProgramName, 
					"();",
					"}"
				].join("");
			}.bind(this));

			return shaderCode;

		},
		$createItemsListCode : function(type){
			var code = "";

			code += ["/*", type, "*/\n"].join("");

			Helpers.selectDOMChildren(this.$shaderDOM, type, function(listContainer){
				
				Helpers.selectDOMChildren(listContainer, "item", function(itemContainer){
					var attributesObject = Helpers.getAttributesObject(itemContainer);

					if (typeof attributesObject.predefined != "undefined"){
						return;
					}

					code += StringTemplate.fast(this.$itemsListDeclarationTemplates[type], attributesObject);
					code += "\n";
				}.bind(this));

			}.bind(this));

			code += ["/*!", type, "*/\n"].join("");

			return code;

		},
		$normalizeUniformValue : function(type, value){
			var _value = value;

			if (type == "vec3" && typeof value.valueOf() == "number"){
				_value = new THREE.Color();
				_value.setHex(value);
			}

			if (type == "vec2" && Array.isArray(value.valueOf())){
				_value = new THREE.Vector2();
				_value.fromArray(value);
			}

			if (type == "vec3" && Array.isArray(value.valueOf())){
				_value = new THREE.Vector3();
				_value.fromArray(value);
			}

			if (type == "vec4" && Array.isArray(value.valueOf())){
				_value = new THREE.Vector4();
				_value.fromArray(value);
			}

			return _value;
		},
		/* statics */
		$itemsListDeclarationTemplates : {
			static : true,
			value : {
				uniforms : "uniform {{type}} {{name}};",
				defines : "#define {{name}} {{value}}",
				attributes : "attribute {{type}} {{name}};",
				varyings : "varying {{type}} {{name}};",
			}
		},
		/* private */
		$shaderCode : {
			writable : true,
			value : null
		},
		$type : {
			writable : true,
			value : null
		},
		$shaderXML : {
			writable : true,
			value : null
		},
		$shaderDOM : {
			writable : true,
			value : null
		},
		$uniformTypeFallbackValues : {
			value : {
				"float" 	: 0.0,
				"int" 		: 0,
				"vec2" 		: new THREE.Vector2(0,0), 
				"vec3" 		: new THREE.Vector3(0,0,0), 
				"vec4" 		: new THREE.Vector4(0,0,0,0), 
				"mat3"		: new THREE.Matrix3(),
				"mat4"		: new THREE.Matrix4(),
			}
		},
		$getFallbackUniformValue : function(type, name){
			return this.$uniformTypeFallbackValues[type];
		},
	});

	return SlimShader;

});