"use strict";
define([
		"dollaclass",
		"unicycle",
		"Clubber/PrePatcher",
		"Clubber/Config",
		"Clubber/Shaders",
		"Clubber/Helpers",
		"Clubber/Common/Common",
		"Clubber/Common/SharedStorage",
		"Clubber/Renderer",
		"Clubber/DomDriver",
	], function(
		  $Class
		, unicycle
		, PrePatcher
		, Config
		, shaders
		, Helpers
		, Common
		, SharedStorage
		, Renderer
	){

	unicycle = new unicycle();

    var __commonCollections = {

    };

	new PrePatcher();

	var Clubber = new $Class({
		name : "Clubber",
		namespace : "Clubber"
	}, {
		$constructor : function(){
			this.shared = new SharedStorage();
			this.$setupSharedTokensCollections();
			this.shared.set("shaders", shaders);

			this.modules = new Common.ModulesKeeper({
				renderer : new Renderer(this, this.shared),
			});
		},
		$setupSharedTokensCollections : function(){
            this.shared.set("colors", __commonCollections.colors);
            this.shared.set("texts", __commonCollections.texts);
            this.shared.set("values", __commonCollections.values);
        },
        createSharedTokensCollection : {
            static : true,
            value : function(){
                __commonCollections.colors = __commonCollections.colors || new Common.ObservablePrecomputedTokensKeeper(Config.defaultColors, function(hexValue, colorVector){
                    hexValue = Helpers.CSSHex2Hex(hexValue);

                    var color = colorVector || new THREE.Color();
                    color.setHex(hexValue);

                    this.r = color.r;
                    this.g = color.g;
                    this.b = color.b;

                    return color;
                });

                __commonCollections.values = __commonCollections.values || new Common.ObservableTokensKeeper(Config.defaultValues);
                __commonCollections.texts = __commonCollections.texts  || new Common.ObservableTokensKeeper();
            }
        },
	});

	Clubber.createSharedTokensCollection();

	return Clubber;

});