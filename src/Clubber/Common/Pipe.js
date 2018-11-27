"use strict";
define([
		"dollaclass",
		"Clubber/Helpers",
	], function($Class, Helpers){

	var Pipe = new $Class({
		name : "Pipe",
		namespace : "Clubber.Common"
	}, {
		$constructor : function(executor, deffered){
			this.$resolve = this.$resolve.bind(this);
			this.$flow = this.$flow.bind(this);
			this.executor = executor;
			!deffered && this.$flow();
		},
		pipe : function(executor){
			if (this.nextPipe instanceof Pipe){
				var nextPipe = this.nextPipe;
				this.nextPipe = [nextPipe];
				this.nextPipe.push(new Pipe(executor, true));
			} else if (this.nextPipe == null){
				this.nextPipe = new Pipe(executor, true);
			}
			
			if (this.isResolved){
				this.$runPipe();
			}

			return this.nextPipe;
		},
		$flow : function(){
			var args = Array.prototype.slice.call(arguments);
			args.unshift(this.$resolve);
			this.executor.apply(null, args);
		},
		$resolve : function(){
			this.value = Array.prototype.slice.call(arguments);
			this.isResolved = true;

			if (this.nextPipe){
				this.$runPipe();
			}
		},
		$runPipe : function(){
			if (Array.isArray(this.nextPipe)){
				Helpers.forEach(this.nextPipe, function(pipe){
					console.log(pipe);
					pipe.$flow.apply(null, this.value);
				}.bind(this));
			} else {
				this.nextPipe.$flow.apply(null, this.value);
				
			}
		},
		isResolved : {
			value : false,
			writable : true
		},
		value : {
			value : null,
			writable : true
		},
		nextPipe : {
			value : null,
			writable : true
		}
	});

	window.PlotPipe = Pipe;



	return Pipe;

});