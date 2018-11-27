"use strict";
define([
		"txt!../../res/shaders/frag.color.xml",
		"txt!../../res/shaders/frag.color-dash.xml",
		/*custom geometry*/
		"txt!../../res/shaders/vert.line2D.xml",
		"txt!../../res/shaders/vert.line2DV.xml",
		"txt!../../res/shaders/vert.line-area.xml",
		"txt!../../res/shaders/vert.unscale.xml",
		"txt!../../res/shaders/vert.normal.xml",
		"txt!../../res/shaders/frag.test.xml",
		"txt!../../res/shaders/frag.gradient.xml",
		"txt!../../res/shaders/frag.gradient-uv.xml",
		"txt!../../res/shaders/frag.pulsar.xml",
		"txt!../../res/shaders/special/frag.cosmic.xml",
		"txt!../../res/shaders/special/frag.viral.xml",
		"txt!../../res/shaders/special/frag.clubberter.xml",
		"txt!../../res/shaders/frag.plane-text.xml",
		"txt!../../res/shaders/frag.mapped-text.xml",
		"txt!../../res/shaders/frag.genius-text.xml",
		"txt!../../res/shaders/draw-manager/vert.fragment-debug-info.xml",

	], function(
		fragColor,
		fragColorDash,
		/*custom geometry*/
		vertLine2D,
		vertLine2DV,
		vertLineArea,
		vertUnscale,
		vertNormal,
		fragTest,
		fragGradient,
		fragGradientUV,
		fragPulsar,
		fragCosmic,
		fragViral,
		fragPlotter,
		fragPlaneText,
		fragMappedText,
		fragGeniusText,
		vertDrawManager_fragmentDebugInfo,
	){


	return {
		"frag.color" 								: fragColor,
		"frag.color-dash" 							: fragColorDash,			
		/*custom geometry*/
		"vert.line2D" 								: vertLine2D,
		"vert.line2DV" 								: vertLine2DV,
		"vert.line-area" 							: vertLineArea,
		"vert.unscale" 								: vertUnscale,
		"vert.normal" 								: vertNormal,
		"frag.test" 								: fragTest,
		"frag.gradient" 							: fragGradient,
		"frag.gradient-uv" 							: fragGradientUV,
		"frag.pulsar" 								: fragPulsar,
		"frag.cosmic" 								: fragCosmic,
		"frag.viral" 								: fragViral,
		"frag.clubberter" 								: fragPlotter,
		"frag.plane-text" 							: fragPlaneText,
		"frag.mapped-text" 							: fragMappedText,
		"frag.genius-text" 							: fragGeniusText,
		"vert.draw-manager.fragment-debug-info" 	: vertDrawManager_fragmentDebugInfo,
	};

});