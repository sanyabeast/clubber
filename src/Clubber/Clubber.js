"use strict";
define([
		"dollaclass",
		"Clubber/Common/Common"
	], function($Class, Common){

	var Clubber = new $Class({
		name : "Clubber",
		namespace : "Clubber"
	}, {
		$constructor : function(){
			this.modules = new Common.ModulesKeeper();
		}
	});

	return Clubber;

});