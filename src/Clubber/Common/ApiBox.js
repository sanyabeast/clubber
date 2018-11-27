"use strict";
define([
		"dollaclass"
	], function($Class){

	var ApiBox = new $Class({
		name : "ApiBox",
		namespace : "Clubber.Common"
	}, {
		$constructor : function(model){
			if (Array.isArray(model.api)){
				for (var a = 0, propName; a < model.api.length; a++){
					propName = model.api[a];

					if (typeof model[propName] == "function"){
						this[propName] = model[propName].bind(model);
					} else {

						(function(apiBox, propName, model){
							Object.defineProperty(apiBox, propName, {
								set : function(v){
									model[propName] = v;
								},
								get : function(){
									return model[propName];
								}
							})
						})(this, propName, model)
						
					}
				}
			}
		}
	});

	return ApiBox;

});