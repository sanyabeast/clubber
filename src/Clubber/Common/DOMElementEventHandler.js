"use strict";
define([
		"dollaclass",
		"Clubber/Common/StateKeeper",
		"Clubber/Common/EventTarget",
		"Clubber/Common/HasUUID",
		"Clubber/Common/Logger",
		"Clubber/Common/DOMElementEventHandler/ClubberDOMEvent",
		"Clubber/Helpers",
		"Clubber/ClubberMath"
	], function($Class, StateKeeper, EventTarget, HasUUID, Logger, ClubberDOMEvent, Helpers, PLot3Math){

	var DOMElementEventHandler = new $Class({
		name : "DOMElementEventHandler",
		namespace : "Clubber/Renderer",
		extends : [
			EventTarget,
			HasUUID,
			Logger
		]

	}, {
		logLevel : {
			value : 3
		},
		$eventsMap : {
            enumerable : false,
            value : {
                "mousemove"             : "pointermove",
                "mouseover"             : "pointerover",
                "mouseout"              : "pointerout",
                "mousedown"             : "pointerdown",
                "mouseup"               : "pointerup",
                "touchstart"            : "pointerdown",
                "touchend"              : "pointerup",
                "touchmove"             : "pointermove",
                "click"                 : "pointertap",
                "mousewheel"            : "pointerzoom"
            }
        },
		$constructor : function(shared, domElement){
			this.shared = shared;
			
			this.$domElement = domElement;

			this.$event = new ClubberDOMEvent(domElement);

			this.interactionState = new StateKeeper({
                hovered : false,
                captured : false,
                prevInteractionDate : +new Date(),
                capturedTime : +new Date(),
                releasedTime : +new Date(),
                maxMoveFreq : 1000 / 60,
                maxWheelFreq : 1000 / 16,
                pointertapTime : 100
            });

			this.eventsState = new StateKeeper({
                pointertap : {
                    prevInteractionDate : +new Date(),
                },
                pointerdown : {
                    prevInteractionDate : +new Date(),
                },
                pointerup : {
                    prevInteractionDate : +new Date(),
                }
            });

            this.$setupDomEvents();
		},
		$setupDomEvents : function(){
            for (var eventName in this.$eventsMap){
                this.$domElement.addEventListener(eventName, this.$handleEvent.bind(this, this.$eventsMap[eventName]));
            }
        },
        $handleEvent : function(type, evt){
            evt.preventDefault();
            var isTouchDevice = this.isTouchDevice;
            var state = this.interactionState;

            if (type == "pointerout" && this.$domElement.contains(evt.srcElement)){
                return;
            }

            if ((type == "pointermove") && (+new Date() - state.prevInteractionDate) < state.maxMoveFreq){
                return;
            }

            if ((type == "pointerzoom") && (+new Date() - state.prevInteractionDate) < state.maxWheelFreq){
                return;
            }

            state.prevInteractionDate = +new Date();
            evt = this.$event.update(evt, this.$domElement);    

            if (evt.pointersCount == 1){
                if (type == "pointerout"){
                    state.hovered = false;
                    state.captured = false;
                    this.dispatchEvent("pointerout", evt);
                }

                if (type == "pointerover"){
                    if (!state.hovered){
                        state.hovered = true;
                        this.dispatchEvent("pointerover", evt);
                    }
                }

                if (type == "pointerdown"){
                    if (!state.hovered){
                        state.hovered = true;
                        this.capturedTime = +new Date();
                        this.dispatchEvent("pointerover", evt);
                    }

                    state.captured = true;
                    this.dispatchEvent("pointerdown", evt);
                    this.eventsState.pointerdown.prevInteractionDate = +new Date();
                }

                if (type == "pointerup"){
                    state.captured = false;
                    this.dispatchEvent("pointerup", evt);
                    if (isTouchDevice && +new Date() - state.capturedTime < state.pointertapTime){
                        this.dispatchEvent("pointertap", evt);
                    }

                    if (this.shared.get("isMobile") && +new Date() - this.eventsState.pointerdown.prevInteractionDate < 200){
                        type = "pointertap";
                    }
                }

                if (type == "pointertap" && state.prevInteractionDate - this.eventsState.pointertap.prevInteractionDate > 200){
                    this.eventsState.pointertap.prevInteractionDate = state.prevInteractionDate;
                    this.dispatchEvent("pointertap", evt);
                } else if (type == "pointertap" && state.prevInteractionDate - this.eventsState.pointertap.prevInteractionDate < 200){
                    this.eventsState.pointertap.prevInteractionDate = state.prevInteractionDate;
                    this.dispatchEvent("doublepointertap", evt);
                }

                if (type == "pointermove" && !state.captured){
                    this.dispatchEvent("pointermove", evt);
                } 

                if (type == "pointermove" && state.captured){
                    this.dispatchEvent("pointerdrag", evt);
                }

                if (type == "pointerzoom"){
                    this.dispatchEvent("pointerzoom", evt);
                }
            } else if (evt.pointersCount == 2){
                if (type == "pointermove"){
                    this.dispatchEvent("panning", evt);
                }
            }

        },
	});

	return DOMElementEventHandler;

});