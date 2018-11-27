"use strict";
define([
		"dollaclass"
	], function($Class){

	var EventBus = new $Class({
		name : "EventBus",
		namespace : "Clubber.Common.EventBus"
	}, {
		$constructor : function(){
			this.domNode = document.createElement("div");
			this.eventData = {};
			this.events = {};
		},
		on : function(eventName, callback, context){
			var eventCallback = function(customEvent){
				callback.call(context, customEvent.detail.data);
			};

			var subscription = {
				eventName : eventName,
				eventCallback : eventCallback
			};

			this.checkEvent(eventName);

			this.domNode.addEventListener(eventName, eventCallback, false);

			return subscription;
		},
		off : function(subscription){
			this.domNode.removeEventListener(subscription.eventName, subscription.eventCallback, false);
		},
		trigger : function(eventName, data){
			if (!this.events[eventName]){
				return;
			}

			this.eventData.data = data;

			this.checkEvent(eventName);
			this.domNode.dispatchEvent(this.events[eventName]);
		},
		checkEvent : function(eventName){
			this.events[eventName] = this.events[eventName] || new CustomEvent(eventName, {
				detail : this.eventData
			});
		}
	});

	return EventBus;

});