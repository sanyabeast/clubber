"use strict";
define([
        "dollaclass",
        "postal",
        "Clubber/Helpers",
        "Clubber/Common/Common",
        "Clubber/DomDriver/DomLayer",
        "Clubber/DomDriver/StylesBundle",
        "Clubber/DomDriver/AttributesBundle",
    ], function($Class, postal, Helpers, Common, DomLayer, StylesBundle, AttributesBundle){

    window.postal = postal;

    var DomDriver = new $Class({ 
        name : "DomDriver", 
        namespace : "Plot4",
        extends : [
            Common.EventTarget,
            Common.Logger
        ]
    }, {
        /*---*/
        StylesBundle : StylesBundle,
        logLevel : { value : 0 },
        $constructor : function(clubber, shared){
            this.shared = shared;
            this.clubber = clubber;

            this.element = this.createElement("div", new AttributesBundle({
                "class" : "_clubber-dom",
                "data-clubber-uuid" : clubber.UUID
            }), new StylesBundle({
                "position" : "relative",
                "overflow" : "hidden"
            }));



            this.modules = new Common.ModulesKeeper({
                domLayer : new DomLayer(this.createElement("div", new AttributesBundle({
                    "data-dom-driver-uuid" : this.UUID
                }), new StylesBundle({
                    "position" : "absolute",
                    "top" : "0",
                    "left" : "0",
                    "width" : "100%",
                    "height" : "100%",
                    "z-index" : "1",
                    "background" : "transparent",
                }))),
                elementEventHandler : new Common.DOMElementEventHandler(this.shared, this.element)
            });

            this.modules.elementEventHandler.setEventProxy(function(eventName, data){
                this.dispatchEvent(eventName, data);
            }.bind(this));


            this.element.appendChild(this.modules.domLayer.element);



        },
        setSizeAsParent : function(){
            var parentNode = this.element.parentNode;
            var rect;
            if (parentNode){
                rect = parentNode.getBoundingClientRect();
                this.element.style.width = rect.width + "px";
                this.element.style.height = rect.height + "px";
            }
        },
        createTest : function(){

            var box = this.createElement("div", new StylesBundle({
                "background" : "rgba(0,0,0,0.5)",
                "border-radius" : "4px",
                "text-align" : "center",
                "overflow" : "hidden",
                "color" : "#fff",
                "display" : "flex",
                "align-items" : "center",
                "justify-content" : "center",
                "border" : "1px solid black",
                "padding" : "8px",
                "transformOrigin" : "center"
            }));

            this.addItemToLayer("test-ox", box, {
                relative : ["x", "y", "height", "width"],
                snap : ["left", "top", "bottom", "right"],
                x : 100,
                y : 100,
                width : 100,
                height : 100
            });

            var group;

            for (var a = 0, c; a < Math.min(window.uPoints.length, 20); a++){
                group = (Math.random() > 0.5) ? "redds" : "greeens"; 
                var test = this.createElement("div", new StylesBundle({
                    "width" : "50px",
                    "height" : "auto",
                    "background" : group == "redds" ? "#f44336" : "#009688",
                    "border-radius" : "4px",
                    "text-align" : "center",
                    "overflow" : "hidden",
                    "color" : "#fff",
                    "display" : "flex",
                    "align-items" : "center",
                    "justify-content" : "center",
                    "border" : "1px solid black",
                    "padding" : "8px"
                }));


                test.textContent = group;

                this.addItemToLayer("test" + a, test, {
                    relative : ["x", "y"],
                    snap : ["left", "top", "bottom", "right"],
                    x : window.uPoints[a][0],
                    y : window.uPoints[a][1],
                    width : 200,
                    height : 20,
                    group : group,
                    onGroup : function(){
                    }
                });
            }

        },
        addRenderer : function(renderer){
            var domElement = renderer.dom;
            var styles = new StylesBundle({
                "width" : "100%!importnat",
                "height" : "100%!importnat",
                "z-index" : "0"
            });

            styles.apply(domElement);
            this.element.appendChild(domElement);
            return this;
        },
        setNavigator : function(navigator){
            this.modules.domLayer.setNavigator(navigator);
        },
        addItemToLayer : function(id, item, params){
            this.CLOG("adding item to layer", id);
            this.modules.domLayer.addItem(id, item, params);
        },
        updateItemOnLayer : function(id, params){
            this.modules.domLayer.updateItem(id, params);
        },
        createElement : function(descriptor, attributes, styles, textNodeStyles){
            descriptor = descriptor.split(".");

            var element = document.createElement(descriptor.shift());
            var textNode = document.createElement("p");
            textNode.style.margin = "0";
            element.appendChild(textNode);

            Helpers.forEach(descriptor, function(className){
                element.classList.add(className);
            });

            if (attributes instanceof StylesBundle){
                textNodeStyles = styles;
                styles = attributes;
                attributes = null;
            }

            if (attributes instanceof AttributesBundle){
                attributes.apply(element);
            }

            if (styles instanceof StylesBundle){
                styles.apply(element);
            }

            if (textNodeStyles instanceof StylesBundle){
                textNodeStyles.apply(textNode);
            }

            return element;
        },
        createFragment : function(elements){
            var fragment = new DocumentFragment();

            for (var a = 0, l = elements.length; a < l; a++){
                fragment.appendChild(elements[a]);
            }

            return fragment;
        },
        getLayerSize : function(){
            return this.modules.domLayer.size;
        },
    });

    return DomDriver;

});