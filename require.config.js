(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(true);
    } else {
        var Clavis = factory();
        var clavis = new Clavis();
        window.clavis = clavis;
    }
}(this, function(){
    return {
        name : "main",
        baseUrl : "src",
        paths : {
            "postal"        : "../node_modules/postal/postal",
            "unicycle"      : "../node_modules/unicycle/unicycle",
            "tweener"       : "../node_modules/tweener/tweener",
            "todo"          : "../node_modules/todojs/todo",
            "three"         : "../node_modules/threejs_r79_custom/build/three",
            "file"          : "../node_modules/requirejs-text/text",
            "base"          : "../node_modules/base/base",
            "dollaclass"    : "../node_modules/dollaclass/dollaclass",
            "centrifuge"    : "../node_modules/centrifuge/centrifuge",
            "sender"        : "../node_modules/sender/sender",
            "superagent"    : "../node_modules/superagent",
            "earcut"        : "../node_modules/earcut/dist/earcut.min",
            "harmony"       : "../node_modules/harmony/harmony",
            "txt"          : "../node_modules/requirejs-text/text"
        },
        urlArgs : "bust=" + (+new Date()),
        waitSeconds : 720,
        preserveLicenseComments : false,
        out : "src/main.min.js",
        findNestedDependencies : true,
        catchError : { define : true },
        optimizeAllPluginResources : true,
        useStrict : true,
        optimize : "uglify2",
        uglify2 : {
            output: {
                beautify: false,
                preamble : "Binarium"
            },
            compress : {
                drop_console : false,
                keep_infinity : true,
                passes : 4,
                sequences : true,
                unsafe_math : true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true,
            },
        }
    };
}));