define([
        "dollaclass",
        "Clubber/Common/Disposable"
    ], function($Class, Disposable){

    var StateKeeper = new $Class({ 
        name : "StateKeeper", 
        namespace : "Clubber.Common",
        extends : [
            Disposable
        ]
    }, {
        $constructor : function(initialStates){
            for (var a = 0; a < arguments.length; a++){
                this.setMultiple(arguments[a]);
            }
        },
        placeholder : {
            value : null,
            enumerable : false,
            writable : true
        },
        setPlaceholder : function(placeholder){
            this.placeholder = placeholder;
        },
        clonePlaceholder : function(value){
            if (Array.isArray(value)){
                return value.slice();
            } else if (typeof value == "object" && value !== null){
                return Object.create(object);
            } else {
                return value;
            }
        },
        set : {
            enumerable : false,
            value : function(name, value){
                if (typeof value == "function"){
                    Object.defineProperty(this, name, {
                        get : value
                    });
                } else {
                    this[name] = value;
                }

            }
        },
        setMultiple : function(data){
            for (var k in data){
                this.set(k, data[k]);
            }
        },
        get : {
            enumerable : false,
            value : function(name){
                if (this.placeholder && typeof this[name] == "undefined") this[name] = this.clonePlaceholder(this.placeholder);
                return this[name];
            }
        },
        remove : {
            enumerable : false,
            value : function(name){
                delete this[name];
            }
        },
        forEach : {
            enumerable : false,
            value : function(callback, context){
                for (var k in this){
                    if (callback.call(context, this[k], k)){
                        break;
                    }
                }
            }
        },
        clear : function(){
            this.forEach(function(token){
                this.remove(token);
            }, this);
        },
        itemsCount : {
            enumerable : false,
            get : function(){
                var count = 0;
                this.forEach(function(){
                    count++;
                });
                return count;
            }
        },
        dispose : function(){
            this.forEach(function(token){
                if ($Class.isInstanceOf(token, "Disposable")){
                    token.dispose();
                }
            });

            this.clear();
        }
    });

    return StateKeeper;

});