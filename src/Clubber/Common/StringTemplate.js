"use strict";
define([
		"dollaclass"
	], function($Class){


	var StringTemplate = new $Class({
		name : "StringTemplate",
		namespace : "Clubber.Common"
	}, {
		$constructor : function(tplString){
			tplString = tplString || "";
			this.string = tplString.toString();
		},
		fast : {
			static : true,
			value : function(string, settings, getter){
				var t = new StringTemplate(string);
				return t.make(settings, getter);
			}
		},
		preparsers : {
			static : true,
			value : []
		},
		string : {
			get : function(){
				return this._string;
			},
			set : function(value){
				this._string = value;
				this.update();
			}
		},
		update : function(){
			var matches = this._string.match(/\{{[^${]*}}/g) || [];
			var vars = [];

			for (var a = 0, l = matches.length, name; a < l; a++){
				name = matches[a].substring(2, matches[a].length - 2);
				if (vars.indexOf(name) < 0) vars.push(name);
			}

			this._vars = vars;
		},
		make : function(settings, /*func*/getter){
			settings = settings || {};

			var string = this._string;
			var vars = this._vars;

			for (var b = 0, l = StringTemplate.preparsers.length; b < l; b++){
				string = StringTemplate.preparsers[b].make(string, settings, getter);
			}

			if (getter){
				for (var a = 0, l = vars.length; a < l; a++){
					string = string.replace(new RegExp("\\{{" + vars[a] + "}}", "g"), (getter(vars[a], settings)) || "");
				}

			} else {
				for (var a = 0, l = vars.length; a < l; a++){
					string = string.replace(new RegExp("\\{{" + vars[a] + "}}", "g"), (typeof settings[vars[a]] == "undefined" ? "" : settings[vars[a]]));
				}
			}

			
			return string;
		}
	});



	return StringTemplate;

});