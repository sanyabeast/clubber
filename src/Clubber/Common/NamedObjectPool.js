"use strict";
define([
		"dollaclass"
	], function($Class){

	var NamedObjectPool = new $Class({
		name : "NamedObjectPool",
		namespace : "Clubber.Common"
	}, {
		$constructor : function(trimFunction){
			this.trimFunction = typeof trimFunction == "function" ? trimFunction : null;
			this.content = [];
			this.$trimmingRequestsCount = 0;
		},
		set : function(token){
			var key = Array.prototype.slice.apply(arguments);
			key.shift();
			key = key.join("@");

			this.content.push([key, token]);
		},
		get : function(){
			var token;
			var key = Array.prototype.slice.apply(arguments);
			key = key.join("@");

			for (var a = 0, l = this.content.length; a < l; a++){
				if (this.content[a][0] == key){
					token = this.content[a][1];
					this.content.splice(a, 1);
					return token;
				}
			}
		},
		clear : function(){
			this.content.length = 0;
		},
		trim : function(size, interval){
			var result = false;
			interval = interval || 100;
			this.$trimmingRequestsCount++;

			if (!this.trimFunction){
				if (this.$trimmingRequestsCount % interval == 0 && this.content.length > size) {

					this.content = this.content.slice(this.content.length - size + 1, this.content.length);
					result = true;
				}
			} else {
				if (this.$trimmingRequestsCount % interval == 0 && this.content.length > size) {
					var trimmed = this.content.slice(0, this.content.length - size + 1);
					this.content = this.content.slice(this.content.length - size + 1, this.content.length);
					result = true;

					for (var a = 0, l = trimmed.length; a < l; a++){
						this.trimFunction(trimmed[a]);
					}
				}
			}

			return result;
		}
	});

	return NamedObjectPool;

});