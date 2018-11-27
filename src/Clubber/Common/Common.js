"use strict";
define([
        "dollaclass",
        "postal",
        "Clubber/Common/StateKeeper",
        "Clubber/Common/Pipe",
        "Clubber/Common/DataTypes",
        "Clubber/Helpers",
        "Clubber/Common/Logger",
        "Clubber/Common/StringTemplate",
        "Clubber/Common/EventBus",
        "Clubber/Common/NamedObjectPool",
        "Clubber/Common/EventTarget",
        "Clubber/Common/HasUUID",
        "Clubber/Common/ApiBox",
        "Clubber/Common/DOMElementEventHandler",
        "Clubber/Common/SlimShader",
        "Clubber/Common/Disposable",
    ], function(
        $Class, 
        postal, 
        StateKeeper,
        Pipe,
        DataTypes,
        Helpers,
        Logger,
        StringTemplate,
        EventBus,
        NamedObjectPool,
        EventTarget,
        HasUUID,
        ApiBox,
        DOMElementEventHandler,
        SlimShader,
        Disposable
    ){


    /**
    * Хранилище состояния сущности. ВНИМАНИЕ! Передача функции в качесвте значения приводит к тому, что
    * она (функция) будет использоваться в качестве ГЕТТЕРА 
    *
    */
    

    /**Хранилище субмодулей*/
    var ModulesKeeper = new $Class({
        name : "ModulesKeeper",
        namespace: "Clubber.Common",
        extends : [
            StateKeeper
        ]
    }, {
        $constructor : function(){
            this.super();
        },
        with : function(moduleName, callback, context){
            callback.call(context, this.get(moduleName));
        }
    })

    /**Хранилище временных данных*/
    var TempDataKeeper = new $Class({ name : "TempDataKeeper", namespace : "Clubber.Common", extends : [StateKeeper] }, {})
    var TokensKeeper = new $Class({ name : "TokensKeeper", namespace : "Clubber.Common", extends : [StateKeeper] }, {})

    var ObservableTokensKeeper = new $Class({
        name : "ObservableTokensKeeper",
        namespace : "Clubber.Common",
        extends : [
            StateKeeper
        ]
    }, {
        $constructor : function(data){
            if (typeof data == "object"){
                Helpers.forEach(data, function(value, id){
                    this.set(id, value);
                }, this);
            }
        },
        set : function(id, value){
            this[id] = new DataTypes.DataTypeContainer(value)
        },
        remove : function(id){
            delete this[id];
        },
        get : function(id){
            return this[id];
        }
    });

    var ObservablePrecomputedTokensKeeper = new $Class({
        name : "ObservablePrecomputedTokensKeeper",
        namespace : "Clubber.Common",
        extends : [
            ObservableTokensKeeper
        ]
    }, {
        $constructor : function(data, computeFunction){
            Object.defineProperty(this, "computeFunction", {
                value : computeFunction,
                enumerable : false
            });
            
            this.super();
        },
        computeFunction : {
            value : null,
            enumerable : false,
            writable : true
        },
        set : function(id, value){
            this[id] = new DataTypes.DataTypePrecomputed(value, this.computeFunction);
        },
        get : function(){
            return this[id];
        },
        remove : function(id){
            delete this[id];
        },
        updateCollection : function(data){
            Helpers.forEach(data, function(value, id){
                this.updateValue(id, value);
            }, this);
        },
        updateValue : function(id, value){
            if (this[id]){
                this[id].set(value);
            } else {
                this.set(id, value);
            }
        }
    });

    /**Хранилище элементов, наделенными аттрибутами*/
    var AttributedTokensKeeper = new $Class({
        name : "AttributedTokensKeeper",
        namespace : "Clubber.Common",
        extends : [
            StateKeeper,
            Logger
        ]
    }, {
        logLevel : { value : 0 }, 
        $constructor : function(){
            this.super();
        },
        select : function(attributes, callback){
            var result = [];
            this.forEach(function(token){
                if (token.attrs.matches(attributes)){
                    result.push(token);
                }
            });

            if (callback){
                for (var a = 0, l = result.length; a < l; a++){
                    callback(result[a], a, result);
                }
            }

            return result;

        },
        selectNot : function(attributes, callback){
            var result = [];
            this.forEach(function(token){
                if (!token.attrs.matches(attributes)){
                    result.push(token);
                }
            });

            if (callback){
                for (var a = 0, l = result.length; a < l; a++){
                    callback(result[a], a, result);
                }
            }

            return result;
        },
        removeNot : function(attributes){
            this.selectNot(attributes, function(token){
                this.remove(token);
            }.bind(this));
        },
        set : function(token){
            this[token.attrs.UUID] = token;
        },
        remove : function(token){
            this.CLOG("Removing", token, token.attrs);
            delete this[token.attrs.UUID];
        }
    });

    /**Хранилище аттрибутов некоей сущностии*/
    var AttributesKeeper = new $Class({
        name : "AttributesKeeper",
        namespace : "Clubber.Common",
        extends : [StateKeeper, HasUUID]
    }, {
        $regexp : {
            value : "",
            writable : true
        },
        $constructor : function(){
            this.super();
            // this.$regexp = Helpers.objToRegExp(this);
        },  
        matches : function(attributes){
            var result = true;

            this.forEach(function(value, key){
                var localValue = Helpers.toString(value);
                var checkValue = Helpers.toString(attributes[key]);

                if (attributes[key] && !localValue.match(new RegExp(checkValue, "g"))){
                    result = false;
                    return true;
                }
            }.bind(this));


            return result;
        },
        link : function(element){
            element.attrs = this;
        },

    });

    /**Кэширование*/
    var CacheStorage = new $Class({
        name : "CacheStorage",
        namespace : "Clubber.Common",
        extends : [HasUUID],
    }, {
        $constructor : function(content){
            this.content = new TempDataKeeper(content);
        },
        set : function(){
            var args = Array.prototype.slice.call(arguments);
            var data = args.shift();
            var key = args.join("/");
            this.content.set(key, data);
        },
        get : function(){
            var args = Array.prototype.slice.call(arguments);
            var key = args.join("/");
            return this.content.get(key);
        },
        remove : function(){
            var args = Array.prototype.slice.call(arguments);
            var key = args.join("/");
            this.content.remove(key);
        }
    });

    /*Инициализируемы модуль*/
    var Initable = new $Class({
        name : "Initable",
        namespace : "Clubber.Common",
    }, {
        $constructor : function(){
            this.state = this.state || new StateKeeper({});
        },
        inited : {
            get : function(){
                return this.state.inited;
            }
        },
        init : function(){
            if (this.state.inited){
                return;
            } else {
                this.state.inited = true;

                // if (this.CLOG){
                //     this.CLOG("Inited!");
                // }

                if (this.modules){
                    // this.CLOG("Initing submodules...");

                    this.modules.forEach(function(module){
                        if (typeof module.init == "function"){
                            module.init();
                        }
                    });
                }

            }
        }
    });


    /*Task*/
    var Task = new $Class({
        name : "Task",
        namespace : "Clubber.Common",
        extends : [
            EventTarget,
            HasUUID,
            Logger
        ]
    }, {
        logLevel : { value : 0},
        $constructor : function(id, program, delayed){
            this.CLOG("task created", id);
            this.id = id;
            this.program = program;

            this.$rejectCallbacks = [];
            this.$resolveCallbacks = [];

            this.$resolve = this.$resolve.bind(this);
            this.$reject = this.$reject.bind(this);
            this.$resolve.id = this.id;
            this.$reject.id = this.id;

            if (!delayed) this.program(this.$resolve, this.$reject);

        },
        run : function(){
            this.program(this.$resolve, this.$reject);
        },
        $resolve : function(){
            this.CLOG("task resolved", this.id, arguments);
            this.$resolvedValues = Array.prototype.slice.call(arguments);
            this.$resolvedValues.push(this.id);
            this.isResolved = true;
            this.$runResolveCallbacks();
        },
        $reject : function(){
            this.CLOG("task rejecte", this.id, arguments);
            this.$rejectedValues = Array.prototype.slice.call(arguments);
            this.$rejectedValues.push(this.id);
            this.isRejected = true;
            this.$runRejectCallbacks();
        },
        isResolved : {
            writable : true,
            configurable : true,
            value : false
        },
        isRejected : {
            writable : true,
            configurable : true,
            value : false
        },
        /*values container*/
        $resolvedValues : {
            writable : true,
            configurable : true,
            value : []
        },
        $rejectedValues : {
            writable : true,
            configurable : true,
            value : []
        },
        /*callbacks containers*/
        $resolveCallbacks : {
            value : null,
            writable : true,
            configurable : true
        },
        $rejectCallbacks : {
            value : null,
            writable : true,
            configurable : true,
        },
        /*runners*/
        $runResolveCallbacks : function(){
            var callback;
            while(this.$resolveCallbacks.length > 0){
                callback = this.$resolveCallbacks.pop();
                callback.apply(null, this.$resolvedValues);
            }

            Helpers.forEach(this.$resolveCallbacks, function(cb, index, list){
                if (cb == null){
                    return;
                }

                var done = cb.apply(null, this.$resolvedValues);

                if (done){
                    list[index] = null;
                }
            }.bind(this));
        },
        $runRejectCallbacks : function(){
            var callback;
            

            Helpers.forEach(this.$rejectCallbacks, function(cb, index, list){
                if (cb == null){
                    return;
                }

                var done = cb.apply(null, this.$rejectedValues);
                
                if (done){
                   list[index] = null;
                }
            }.bind(this));
        },
        /*public api*/
        onResolved : function(callback){
            this.$resolveCallbacks.push(callback);
            if (this.isResolved){
                this.$runResolveCallbacks();
            }

            return this;
        },
        onRejected : function(callback){
            this.$rejectCallbacks.push(callback);
            if (this.isRejected){
                this.$runRejectCallbacks();
            }

            return this;
        }
    });

    /*TaskGroup*/
    var TaskGroup = new $Class({
        name : "TaskGroup",
        namespace : "Clubber.Common"
    }, {
        $constructor : function(id, callback){
            this.id = id;
            this.content = new TempDataKeeper();  
            this.callback = callback;  
            this.resolved = [];
            this.rejected = [];
            this.resolvedTasksCount = 0;
            this.totalTasksCount = 0;
        },
        add : function(program){
            var id = Helpers.genRandString(16, this.id, "-task");
            var task = new Task(id, program, true);

            task.onResolved(function(){
                this.resolved.push(Helpers.arguments2Array(arguments));
                this.resolvedTasksCount++;
                if (this.resolvedTasksCount >= this.totalTasksCount){
                    this.callback(this.resolved);
                }
            }.bind(this));

            this.content.set(id, task);
            this.totalTasksCount++;
        },
        run : function(){
            if (this.resolvedTasksCount >= this.totalTasksCount){
                this.callback(this.resolved);
            }

            this.content.forEach(function(task){
                task.run();
            });
        }
    });

    return new (new $Class({ name : "Common", namespace : "Clubber"}, {
        StateKeeper : StateKeeper,
        HasUUID : HasUUID,
        EventTarget : EventTarget,
        StateKeeper : StateKeeper,
        ModulesKeeper : ModulesKeeper,
        TempDataKeeper : TempDataKeeper,
        TokensKeeper : TokensKeeper,
        Pipe : Pipe,
        AttributesKeeper : AttributesKeeper,
        AttributedTokensKeeper : AttributedTokensKeeper,
        CacheStorage : CacheStorage,
        Initable : Initable,
        Logger : Logger,
        Task : Task,
        TaskGroup : TaskGroup,
        StringTemplate : StringTemplate,
        EventBus : EventBus,
        DataTypes : DataTypes,
        NamedObjectPool : NamedObjectPool,
        ApiBox : ApiBox,
        ObservableTokensKeeper : ObservableTokensKeeper,
        ObservablePrecomputedTokensKeeper : ObservablePrecomputedTokensKeeper,
        DOMElementEventHandler : DOMElementEventHandler,
        SlimShader : SlimShader,
        Disposable : Disposable
    }));

});