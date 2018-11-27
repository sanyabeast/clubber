"use strict";
define([
		"dollaclass",
		"Clubber/Common/Common",
		"Clubber/Common/Disposable",
	], function($Class, Common, Disposable){

	var SharedStorage = new $Class({ 
		name : "SharedStorage", 
		"namespace" : "Clubber.Common",
		extends : [
			Disposable
		]
	}, {
		$constructor : function(){
			this.content = new Common.StateKeeper();
		},
		set : function(alias, value){
			this.content.set(alias, value);
		},
		get : function(alias){
			return this.content.get(alias);
		},
		isSharedStorageKey : function(value){
			return (typeof value == "string") && (value.indexOf("@") == 0)
		},
		getValueBySharedStorageKey : function(key){
			var result = null;
			key = key.split("@")[1];
			var keys = key.split(".");

			result = this.content[keys[0]];

			for (var a = 1; a < keys.length; a++){
				result = result[keys[a]];
			}

			return result;

		},
		dispose : function(){
			this.content.dispose();
		}
	});

	return SharedStorage;

});