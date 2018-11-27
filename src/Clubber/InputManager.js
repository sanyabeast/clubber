"use strict";
define([
		"dollaclass",
		"Clubber/Common/Common",
		"Clubber/Helpers",
		"Clubber/ClubberMath",
	], function($Class, Common, Helpers, PLot3Math){

	var InputManager = new $Class({
		name : "InputManager",
		namespace : "Clubber/Renderer",
		extends : [
			Common.EventTarget,
			Common.HasUUID,
			Common.Logger
		]

	}, {
		logLevel : {
			value : 3
		},
		$constructor : function(shared, renderer, domElement){
			this.shared = shared;
			this.state = new Common.StateKeeper();
			this.$domElement = domElement;


			this.event = new Common.StateKeeper({
				pageX : 0,
				pageY : 0
			});

			this.state = new Common.StateKeeper({
				prevPointerdownTime : 0
			});

			this.modules = new Common.ModulesKeeper({
				renderer : renderer,
				scene : renderer.scene,
				elementEventHandler : new Common.DOMElementEventHandler(this.shared, domElement)
			});

			this.modules.elementEventHandler.addEventListener("pointermove", function(eventData){
				this.$check(eventData.x, eventData.y, "pointermove");
			}, this);

			this.modules.elementEventHandler.addEventListener("pointerdown", function(eventData){
				this.$check(eventData.x, eventData.y, "pointerdown");
			}, this);

			this.modules.elementEventHandler.addEventListener("pointerup", function(eventData){
				this.$check(eventData.x, eventData.y, "pointerup");
			}, this);


		},
		$check : function(x, y, eventType){
			var pageCoords = this.modules.renderer.getPointerPageCoords(x, y);

			this.event.pageX = pageCoords.x;
			this.event.pageY = pageCoords.y;

			if (this.modules.scene.interactiveChildren){
				Helpers.forEach(this.modules.scene.interactiveChildren, function(child, uuid){



					var interactiveBox = child.interactiveBox;
					var realCoords = this.modules.renderer.getRealCoords(interactiveBox.position.x, interactiveBox.position.y);
					var isUnderPointer = this.$contains(
						realCoords.x - interactiveBox.anchor.x * interactiveBox.size.x, 
						realCoords.y - interactiveBox.anchor.y * interactiveBox.size.y, 
						interactiveBox.size.x, 
						interactiveBox.size.y, x, y
					);

					this.event.element = child;
					this.event.attributes = interactiveBox.attrs;

					this.$processNode(
						eventType, 
						isUnderPointer, 
						this.event,
						child, 
						interactiveBox
					);

				}, this);
			}
			
		},
		$processNode : function(eventType, isUnderPointer, event, node, interactiveBox){

			if (isUnderPointer && !interactiveBox.getState("hovered")){
				interactiveBox.setState("hovered", true);
				event.type = "pointerover";
				interactiveBox.dispatchEvent("pointerover", event);
			}

			if (!isUnderPointer && interactiveBox.getState("hovered")){
				interactiveBox.setState("hovered", false);
				event.type = "pointerout";
				interactiveBox.dispatchEvent("pointerout", event);
			}

		},
		$contains : function(posX, posY, sizeX, sizeY, x, y){
			return (
				x > posX &&
				x < posX + sizeX &&
				y > posY && 
				y < posY + sizeY
			)
		}
	});

	return InputManager;

});