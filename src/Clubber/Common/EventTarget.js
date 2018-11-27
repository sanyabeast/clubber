"use strict";
define([
        "dollaclass",
        "Clubber/Common/HasUUID",
        "Clubber/Common/Disposable",
        "Clubber/Helpers",
    ], function($Class, HasUUID, Disposable, Helpers){

    /**Сущность, которая может служить источником и целью событий*/
    var EventTarget = new $Class({ 
            name : "EventTarget", 
            namespace : "Clubber.Common",
            extends : [
                HasUUID,
                Disposable
            ]
    }, {
        addEventListener : function(eventName, callback, context){
            postal.listen([this.UUID, eventName].join("."), callback, context);
        },
        addEventListeners : function(listeners, context){
            for (var k in listeners){
                this.addEventListener(k, listeners[k], context);
            }
        },
        dispatchEvent : function(eventName, data){
            if (this.$eventProxyFunction){
                this.$eventProxyFunction(eventName, data);
            } else {
                postal.say([this.UUID, eventName].join("."), data);
                
            }

        },
        removeEventListener : function(subscription){
            subscription.unsubscribe();
        },
        setEventProxy : function(eventProxyFunction){
            this.$eventProxyFunction = eventProxyFunction;
        },
        dispose : function(){
            this.super();
            postal.unsubscribeWithRegExp(this.UUID);
        }
    });

    return EventTarget;

})