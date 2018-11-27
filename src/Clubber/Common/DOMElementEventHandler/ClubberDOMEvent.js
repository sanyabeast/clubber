"use strict";
define([
        "dollaclass",
        "three"
    ], function($Class, THREE){

    var ClubberDOMEvent = new $Class({ name : "ClubberDOMEvent", namespace : "Clubber.DomDriver" }, {
        $constructor : function(targetElement){
            var _this = this;

            this.targetElement = targetElement;
            this.x = 0;
            this.y = 0;
            this.pointersCount = 1;
            this.pointers = [];

            this.dragDistance = {
                get x(){
                    return _this.prevX - _this.x;
                },    
                get y(){
                    return _this.y - _this.prevY;
                },
                get angular(){
                    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
                }
            };

            this.panDistance = {
                get x(){
                    return _this.prevX - (_this._prevSecondX || 0);
                }, 
                get y(){
                    return _this.prevY - (_this._prevSecondY || 0);
                }, 
                get angular(){
                    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
                },
                $anchor : new THREE.Vector2(0, 0),
                get anchor(){
                    this.$anchor.x = (_this._prevSecondX + _this.prevX) / 2;
                    this.$anchor.y = (_this._prevSecondY + _this.prevY) / 2;

                    return this.$anchor;
                },
                prevAngular : 0,
                get delta(){ return this.angular - this.prevAngular },
                get factor(){ return this.angular / this.prevAngular }
            };
        },
        prevX : { value : 0, writable : true },
        prevY : { value : 0, writable : true },
        x : {
            get : function(){ return this.__x || 0; },
            set : function(x){
                this.prevX = this.x;
                this.__x = x;
            }
        },
        y : {
            get : function(){ return this.__y || 0; },
            set : function(y){
                this.prevY = this.y;
                this.__y = y;
            }
        },
        update(evt, element){
            var bounds = element.getBoundingClientRect();

            var DPR = window.devicePixelRatio;
            var isTouchEvent = this.isTouchEvent;

            if (!isTouchEvent){
                this.x = (evt.pageX - bounds.left) * DPR,
                this.y = (evt.pageY - bounds.top) * DPR;

                this.pointersCount = 1;
                this.pointers.length = 0;
                this.pointers.push({
                    x : (evt.pageX - bounds.left) * DPR,
                    y : (evt.pageY - bounds.top) * DPR
                });
            } else {
                if (evt.touches && evt.touches.length){
                    this.pointers.length = 0;
                    this.pointersCount = evt.touches.length;

                    this.x = (evt.touches[0].pageX - bounds.left) * DPR;
                    this.y = (evt.touches[0].pageY - bounds.top) * DPR;

                    for (var a = 0; a < evt.touches.length; a++){

                        if (a == 1){
                            this.panDistance.prevAngular = this.panDistance.angular;
                            this._prevSecondX = (evt.touches[a].pageX - bounds.left) * DPR;
                            this._prevSecondY = (evt.touches[a].pageY - bounds.top) * DPR;
                        }

                        this.pointers.push({
                            x : (evt.touches[a].pageX - bounds.left) * DPR,
                            y : (evt.touches[a].pageY - bounds.top) * DPR,
                        });
                    }
                }
            }

            if (typeof evt.wheelDeltaY == "number"){
                this.wheelDown = evt.wheelDeltaY < 0;
            }

            return this;
        },
        getPanDistance : function(){
            return this.panDistance;
        },
        getDragDistance : function(){
            return this.dragDistance;
        },
        isTouchEvent : {
            get : function(){
                if (typeof this.__isTouchEvent == "undefined"){
                    this.__isTouchEvent = !!('ontouchstart' in window || navigator.msMaxTouchPoints);
                }

                return this.__isTouchEvent; 
            }
        }
    });

    return ClubberDOMEvent;

});