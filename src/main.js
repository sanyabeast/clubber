var isNode = typeof global != "undefined";

requirejs([isNode ? "../require.config.js" : "require.config.js"], function(requireConfig){
    requirejs.config(requireConfig);

    requirejs(["Clubber/Clubber", "tweener", "three"], function(Clubber, tweener, THREE){
        window.app = new Clubber();

    });


});


