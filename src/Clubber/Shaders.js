"use strict";
define([
		"txt!../../res/shaders/frag.color.xml",
		"txt!../../res/shaders/frag.color-dash.xml",
		/*candlesticks*/
		"txt!../../res/shaders/frag.candlestick.xml",
		"txt!../../res/shaders/vert.candlestick.xml",
		"txt!../../res/shaders/vert.candlebar.xml",
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
		"txt!../../res/shaders/special/frag.plotter.xml",
		"txt!../../res/shaders/frag.plane-text.xml",
		"txt!../../res/shaders/frag.mapped-text.xml",
		"txt!../../res/shaders/frag.genius-text.xml",
		"txt!../../res/shaders/draw-manager/vert.fragment-debug-info.xml",
		"txt!../../res/shaders/binary-options/vert.binary-option-tag.xml",
		/*binary options*/
		"txt!../../res/shaders/binary-options/frag.tag-color.xml",
		"txt!../../res/shaders/binary-options/vert.horizontal-line.xml",
		"txt!../../res/shaders/binary-options/vert.vertical-line.xml",
		/*dev debug*/
		"txt!../../res/shaders/dev-debug/frag.field.xml",
		"txt!../../res/shaders/dev-debug/vert.field.xml",
		/*expiration indicator*/
		"txt!../../res/shaders/expiration-indicator/vert.box.xml",
		"txt!../../res/shaders/expiration-indicator/vert.line.xml",
		"txt!../../res/shaders/expiration-indicator/vert.text.xml",
		/*grid pattern*/
		"txt!../../res/shaders/grid-pattern/frag.grid.xml",
		"txt!../../res/shaders/grid-pattern/vert.grid.xml",
		"txt!../../res/shaders/grid-pattern/vert.x-caption.xml",
		"txt!../../res/shaders/grid-pattern/vert.y-caption.xml",
		/*pointer value*/
		"txt!../../res/shaders/pointer-value/vert.line.xml",
		/*up down hiliter*/
		"txt!../../res/shaders/up-down-hilighter/vert.box.xml",
		"txt!../../res/shaders/up-down-hilighter/frag.box.xml",
		"txt!../../res/shaders/up-down-hilighter/vert.arrow.xml",
		"txt!../../res/shaders/up-down-hilighter/frag.arrow.xml",
		/*points loading*/
		"txt!../../res/shaders/points-loading/vert.box.xml",
		"txt!../../res/shaders/points-loading/vert.text.xml",
		/*live popint*/
		"txt!../../res/shaders/live-point/vert.hline.xml",


	], function(
		fragColor,
		fragColorDash,
		/*candlesticks*/
		fragCandlestick,
		vertCandlestick,
		vertCandlebar,
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
		vertBinaryOptions_tag,
		/*bninary options*/
		fragBinaryOptions_tagColor,
		vertBinaryOptions_horizontalLine,
		vertBinaryOptions_verticalLine,
		/*dev debug*/
		fragDevDebug_field,
		vertDevDebug_field,
		/*expiration indicator*/
		vertExpirationIndicator_box,
		vertExpirationIndicator_line,
		vertExpirationIndicator_text,
		/*grid pattern*/
		fragGridPattern_grid,
		vertGridPattern_grid,
		vertGridPattern_xCaption,
		vertGridPattern_yCaption,
		/*pointer value*/
		vertPointerValue_line,
		/*up down hiliter*/
		vertUpDownHilighterBox,
		fragUpDownHilighterBox,
		vertUpDownHilighterArrow,
		fragUpDownHilighterArrow,
		/*points loading*/
		vertPointsLoading_box,
		vertPointsLoading_text,
		/*live popint*/
		vertLivePoint_hLine
	){


	return {
		"frag.color" 								: fragColor,
		"frag.color-dash" 							: fragColorDash,
		/*candlesticks*/
		"frag.candlestick" 							: fragCandlestick,
		"vert.candlestick" 							: vertCandlestick,
		"vert.candlebar" 							: vertCandlebar,
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
		"frag.plotter" 								: fragPlotter,
		"frag.plane-text" 							: fragPlaneText,
		"frag.mapped-text" 							: fragMappedText,
		"frag.genius-text" 							: fragGeniusText,
		"vert.draw-manager.fragment-debug-info" 	: vertDrawManager_fragmentDebugInfo,
		"vert.binary-options.tag" 					: vertBinaryOptions_tag,
		/*binary options*/
		"frag.binary-options.tag" 					: fragBinaryOptions_tagColor,
		"vert.binary-options.horizontal-line"		: vertBinaryOptions_horizontalLine,
		"vert.binary-options.vertical-line"			: vertBinaryOptions_verticalLine,
		/*dev debug*/
		"frag.dev-debug.field"						: fragDevDebug_field,
		"vert.dev-debug.field"						: vertDevDebug_field,
		/*expiration indicator*/
		"vert.expiration-indicator.box" 			: vertExpirationIndicator_box,
		"vert.expiration-indicator.line" 			: vertExpirationIndicator_line,
		"vert.expiration-indicator.text" 			: vertExpirationIndicator_text,
		/*grid pattern*/
		"frag.grid-pattern.grid" 					: fragGridPattern_grid,
		"vert.grid-pattern.grid" 					: vertGridPattern_grid,
		"vert.grid-pattern.x-caption"				: vertGridPattern_xCaption,
		"vert.grid-pattern.y-caption"				: vertGridPattern_yCaption,
		/*pointer value*/
		"vert.pointer-value.line" 					: vertPointerValue_line,
		/*up down hiliter*/
		"vert.up-down-hilighter.box"				: vertUpDownHilighterBox,
		"frag.up-down-hilighter.box"				: fragUpDownHilighterBox,
		"vert.up-down-hilighter.arrow"				: vertUpDownHilighterArrow,
		"frag.up-down-hilighter.arrow"				: fragUpDownHilighterArrow,
		/*points loading*/
		"vert.points-loading.box"					: vertPointsLoading_box,
		"vert.points-loading.text"					: vertPointsLoading_text,
		/*live popint*/
		"vert.live-point.hline"						: vertLivePoint_hLine
		
		

	};

});