"use strict";
define([
        "dollaclass",
		"Clubber/Helpers",
	], function($Class, Helpers){
		
	var HasUUID = new $Class({ name : "HasUUID", namespace : "Clubber.Common" }, {
        UUID : {
            get : function(){
                if (typeof this.__UUID !== "string"){
                    Object.defineProperty(this, "__UUID", {
                        value : this.$genUUID(this.$name),
                        enumerable : false,
                    });
                }

                return this.__UUID;
            },
            enumerable : false,
            configurable : false
        },
        $genUUID : {
            value : function(prefix){
                var length = 32;
                var randString = "";

                while(randString.length < length){
                    randString += (Math.random().toString(32).substring(3, 12));
                }

                randString = randString.substring(0, length);

                return prefix ? [prefix, randString].join("-") : randString;
            },
            enumerable : false,
            writable : false,
            configurable : false
        },
    });

    return HasUUID;

})