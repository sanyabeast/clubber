"use string";
define(["dollaclass"], function($Class){

	var Disposable = new $Class({
		name : "Disposable",
		namespace : "Clubber.Common",	
	}, {
		$constructor : function(){

		},
		dispose : function(){
			if (this.$disposed){
				return;
			}

			console.log(this.UUID);

			this.$disposed = true;
		}
	});

	return Disposable;

});