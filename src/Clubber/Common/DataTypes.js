"use strict";
define([
		"dollaclass",
		"Clubber/Common/EventTarget"
	], function($Class, EventTarget){

	var DataTypeContainer = new $Class({
		name : "DataTypeContainer",
		namespace : "Clubber.Common.DataTypes"
	}, {
		$constructor : function(value){
			this.value = value;
		},
		valueOf : function(){
			return this.value;
		},
		set : function(value){
			this.value = value;
			return this;
		}
	});

	var DataTypePrecomputed = new $Class({
		name : "DataTypePrecomputed",
		namespace : "Clubber.Common",
	}, {
		$constructor : function(value, computeFunction){
			this.computeFunction = computeFunction;
			this.value = value;
		},
		$value : {
			value : null,
			writable : true,
		},
		valueOf : function(){
			return this.$value;
		},
		set : function(v){
			this.value = v;
		},	
		value : {
			set : function(v){
				this.$value = this.computeFunction(v, this.$value);
			},
			get : function(){
				return this.valueOf();
			}
		}
	});

	var DataTypeComputed = new $Class({
		name : "DataTypeComputed",
		namespace : "Clubber.Common",
	}, {
		$constructor : function(value, computeFunction){
			this.computeFunction = computeFunction;
			this.value = value;
		},
		computeFunction : {
            value : null,
            enumerable : false,
            writable : true
        },
		$value : {
			value : null,
			writable : true,
		},
		valueOf : function(){
			return this.computeFunction(this.$value);
		},
		set : function(v){
			this.value = v;
		},	
		value : {
			set : function(v){
				this.$value = v;
			},
			get : function(){
				return this.valueOf();
			}
		}
	});

	/*Number*/	
	var Num = new $Class({
		name : "Num",
		namespace : "Clubber.Common.DataTypes",
		extends : [
			DataTypeContainer
		]
	}, {
		$constructor : function(){
			this.super();
		}
	});

	var Num64 = new $Class({
		name : "Num64",
		namespace : "Clubber.Common.DataTypes",
	}, {
		$constructor : function(value){
			this.array64 = new Float64Array(1);
			this.array64[0] = value;
		},
		valueOf : function(){
			return this.array64[0];
		},
		set : function(value){
			this.array64[0] = value;
		},
		value : {
			get : function(){
				return this.valueOf();
			},
			set : function(value){
				this.set(value);
			}
		}
	});

	/*Boolean*/
	var Bool = new $Class({
		name : "Bool",
		namespace : "Clubber.Common.DataTypes",
		extends : [
			DataTypeContainer
		]
	}, {
		$constructor : function(){
			this.super();
		}
	});


	/* Observable типы */
	var NumObservable = new $Class({
		name : "NumObservable",
		namespace : "Clubber.Common.DataTypes",
		extends : [
			DataTypeContainer,
			EventTarget,
		]
	}, {
		$constructor : function(){
			this.super();
		},
		value : {
			get : function(){
				return this.$value;
			},
			set : function(v){
				this.$value = v;
				this.dispatchEvent("change", this);
			}
		}
	});


	var DataTypes = new $Class({
		name : "DataTypes",
		namespace : "Clubber.Common"
	}, {
		Num : {
			static : true,
			value : Num
		},
		Num64 : {
			static : true,
			value : Num64
		},
		Bool : {
			static : true,
			value : Bool
		},
		NumObservable : {
			static : true,
			value : NumObservable
		},
		DataTypeContainer : {
			static : true,
			value : DataTypeContainer
		},
		DataTypePrecomputed : {
			static : true,
			value : DataTypePrecomputed
		},
		DataTypeComputed : {
			static : true,
			value : DataTypeComputed
		}
	});

	return DataTypes;

});