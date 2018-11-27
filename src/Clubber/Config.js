"use strict";
define([
		"dollaclass",
		"postal",
		"Clubber/Common/Common"
	], function($Class, postal, Common){

	var Config = new $Class({
		name : "Config",
		namespace : "Clubber.Config"
	}, {
		defaultColors : {
			static : true,
			value : {
				"backgroundColor"							: "#13263b",
            }
		},
		defaultValues : {
			static : true,
			value : {
				"navigatorChunkSize"							: 200,
			}
		},
		renderer : {
			static : true,
			value : {
				postprocessing : {
					passes : [
						{
							type : "RenderPass",
							camera : "@clubber.modules.renderer.modules.camera",
							scene : "@clubber.modules.renderer.modules.scene",
							name : "render"
						},
						// {
						// 	type : "UnrealBloomPass",
						// 	name : "bloom",
						// 	strength : 1,
						// 	radius : 0.2, 
						// 	treshold : 0.2,
						// 	enabled : true
						// },
						// {
						// 	type : "OutlinePass",
						// 	camera : "@clubber.modules.renderer.modules.camera",
						// 	scene : "@clubber.modules.renderer.modules.scene",
						// 	resolution : "clubber.modules.renderer.state.size",
						// 	name : "outline",
						// 	edgeStrength: 3.0,
						// 	edgeGlow: 0.0,
						// 	edgeThickness: 1.0,
						// 	pulsePeriod: 0,
						// 	rotate: false,
						// 	usePatternTexture: false
						// }
					]
				}
			}
		}
	});

	return Config;

});