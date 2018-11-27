"use strict";
define([
        "dollaclass"
    ], function($Class){

    var string2Color = function(string) {
        var h = (string.charCodeAt(0) * 1000) % 360;
        var s = 80;
        var l = string.charCodeAt(1) / 4;
        
        return ["hsl(", h, ",", s, "%, ", l, "%)"].join("");
    }

	var Logger = new $Class({
        name : "Logger",
        namespace : "Clubber.Common.Logger"
    }, {
        logLevel : {
            static : true,
            value : 3
        },
        CLOG : {
            static : true,
            value : function(){
                if (this.logLevel >= 3){
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift("font-weight: bold; color: " + string2Color(this.$name));
                    args.unshift("%c" + this.$name + ":");
                    console.log.apply(console, args);
                }
            }
        },
        CWARN : {
            static : true,
            value : function(){
                if (this.logLevel >= 2){
                    var args = Array.prototype.slice();
                    args.unshift(this.$name + ":");
                    console.warn.apply(console, args);
                }
            }
        },
        CERR : {
            static : true,
            value : function(){
                if (this.logLevel >= 1){
                    var args = Array.prototype.slice();
                    args.unshift(this.$name + ":");
                    console.error.apply(console, args);
                }               
            }
        },
        CLOGVARS : {
            static : true,
            value : function(list){
                var args = ["%c" + this.$name, "font-weight: bold; color: " + string2Color(this.$name), "\n"];

                for (var k in list){
                    args.push(k);
                    args.push(":");
                    args.push(list[k]);
                    args.push("\n");
                }

                console.log.apply(console, args);
            }
        }
    });

    return Logger;

});