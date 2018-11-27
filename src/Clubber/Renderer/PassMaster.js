"use strict";
define([
		"dollaclass",
		"three",
		"Clubber/Helpers",
		"Clubber/Common/Common"
	]
	, function($Class, THREE, Helpers, Common){
	
	var PassMaster = new $Class({
		name : "PassMaster",
		namespace : "Clubber.Renderer",
		extends : [
			Common.Initable

		]
	}, {
		atlas : {
			static : true,
			value : {
				"RenderPass" : {
					creator : THREE.RenderPass,
					args : ["scene", "camera"],
				},
				"UnrealBloomPass" : {
					creator : THREE.UnrealBloomPass,
					args : ["resolution", "strength", "radius", "threshold"]
				},
				"FXAAPass" : {
					creator : THREE.ShaderPass,
					shader : THREE.FXAAShader,
					args : ["shader"],
				},
				"FilmPass" : {
					creator : THREE.FilmPass,
					args : ["noiseIntensity", "scanlinesIntensity", "scanlinesCount", "grayscale"]
				},
				"SMAAPass" : {
					creator : THREE.SMAAPass,
					args : ["width", "height"]
				},
				"OutlinePass" : {
					creator : THREE.OutlinePass,
					args : ["resolution", "scene", "camera", "selectedObjects"],
				}
			}
		},
		$constructor : function(shared, composer, fxConfig){

			this.passes = new Common.ModulesKeeper({});
			shared.set("composerPasses", this.passes);

			this.shared = shared;
			this.composer = composer;
			this.fxConfig = fxConfig;

		},
		init : function(){
			this.setupComposer(this.composer, this.fxConfig.passes);
		},
		$createPass : function(config){
			var constructConfig = this.atlas[config.type];

			config = this.$getProcessedConfig(config, constructConfig);

			var pass = Helpers.constructWithParams(constructConfig.creator, constructConfig.args, config);

			Helpers.forEach(config, function(value, key){
				pass[key] = value;
			});

			return pass;
		},
		$getProcessedConfig : function(config, constructConfig){
			var result = {};


			Helpers.forEach(constructConfig, function(value, key){

				if (typeof config[key] == "undefined"){
					result[key] = value;
				}

			});

			Helpers.forEach(config, function(value, key){

				if (this.shared.isSharedStorageKey(value)){
					result[key] = this.shared.getValueBySharedStorageKey(value);
				} else {
					result[key] = value;
				}

			}, this);

			return result;
		},
		setupComposer : function(composer, passes){
			Helpers.forEach(passes, function(passConfig, index){
				var pass = this.$createPass(passConfig);
				this.composer.addPass(pass);
				this.passes[passConfig.name] = pass;
			}, this);

			// console.log(this.composer);
		},
		update : function(width, height){
			this.composer.setSize(width, height);
			for (var a = this.composer.passes.length - 1; a >= 0; a--){
                
                if (this.composer.passes[a].enabled){
                	this.composer.passes[a].renderToScreen = true;
                	break;
                }

                // if (this.composer.passes[a].resolution instanceof THREE.Vector2){
                //     this.composer.passes[a].resolution.set(width, height);
                // }

            }
		}
	});

	return PassMaster;

});