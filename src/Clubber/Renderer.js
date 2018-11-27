"use strict";
define([
        "dollaclass",
        "Clubber/Config",
        "Clubber/Renderer/PassMaster",
        "Clubber/Common/Common",
        "Clubber/ClubberMath",
        "Clubber/Helpers",
        "three",
        "unicycle",
        "tweener",
    ], function($Class, Config, PassMaster, Common, ClubberMath, Helpers, THREE, Unicycle, tweener){

    window.THREE = THREE;

    var Renderer = new $Class({ 
        name : "Renderer", 
        namespace : "Plot3",
        extends : [
            Common.EventTarget,
            Common.Initable
        ]
    }, {
        $constructor : function(plot3, shared){
            this.plot3 = plot3;
            this.shared = shared;

            this.state = new Common.StateKeeper({
                size : new THREE.Vector2(1, 1),
                scale : new THREE.Vector2(1, 1), 
                viewportInfo : new THREE.Vector4(0, 0, 0, 0),
                worldCoords : new THREE.Vector2(0, 0),
                realCoords : new THREE.Vector2(0, 0),
                pointerPageCoords : new THREE.Vector2(0, 0),
                initTime : Helpers.initTime,
                coordScale : Helpers.coordScale,
                orthoCameraFrustumXPlane : new THREE.Vector2(0, 0),
                orthoCameraFrustumYPlane : new THREE.Vector2(0, 0),
            });
            

            this.modules = new Common.ModulesKeeper({
                engine : new THREE.WebGLRenderer({
                    precision : "highp",
                    antialias : !this.shared.get("isMobile")
                    // antialias : true
                }),
                scene : new THREE.Scene(),
                camera : new THREE.OrthographicCamera(-500, 500, -500, 500, 0, 100),
                unicycle : new Unicycle(),
                frustum : new THREE.Frustum(),
            });

            this.modules.set("composer", new THREE.EffectComposer( this.modules.engine ));
            this.modules.set("passMaster", new PassMaster(this.shared, this.modules.composer, Config.renderer.postprocessing))


            this.shared.set("cameraPosition", this.modules.camera.position);
            this.shared.set("renderScale", this.state.scale);
            this.shared.set("orthoCameraFrustumXPlane", this.state.orthoCameraFrustumXPlane);
            this.shared.set("orthoCameraFrustumYPlane", this.state.orthoCameraFrustumYPlane);

            this.modules.engine.setClearColor(this.shared.getValueBySharedStorageKey("@colors.backgroundColor").value);
            this.modules.camera.lookAt(this.modules.scene);
            this.render = this.render.bind(this);

            // this.$setupPostprocessing();

        },
        convertX : Helpers.convertX.bind(Helpers),  
        getWorldCoords : function(x, y){
            y = this.state.size.y - y;
            var worldCoords = this.state.worldCoords;

            worldCoords.x = Helpers.convertX((x * this.scale.x) + this.position.x, true);
            worldCoords.y = (y * this.scale.y) - this.position.y;
            worldCoords.y = (this.position.y + (this.scale.y * y));

            return worldCoords;
        },
        getRealCoords : function(x, y){
            var realCoords = this.state.realCoords;

            x = (x - this.position.x) / this.scale.x;
            y = this.state.size.y - (y - this.position.y) / this.scale.y;

            realCoords.y = y;
            realCoords.x = x;

            return realCoords;
        },
        getPointerPageCoords : function(x, y){
            var pointerPageCoords = this.state.pointerPageCoords;
            var rendererBoundingRect = this.dom.getBoundingClientRect();

            pointerPageCoords.set(x + rendererBoundingRect.x, y + rendererBoundingRect.y);
            return pointerPageCoords;
        },
        setCameraPositionX : function(value){
            var navScale = Helpers.convertScale(this.state.scale.x, true);
            value = Math.floor(value / navScale) * navScale;

            value = this.convertX(value);
            this.modules.camera.position.x = value;
            this.$updateCamera();
        },
        setCameraPositionY : function(value){
            value = Math.floor(value / this.state.scale.y) * this.state.scale.y;
            
            this.modules.camera.position.y = value;
            this.$updateCamera();
        },
        setScaleX : function(value){
            if (this.state.scale.x == value){
                return;
            }

            value = Helpers.convertScale(value);
            this.state.scale.x = value;
            this.$updateCamera();
            this.modules.camera.updateProjectionMatrix();
        },
        setScaleY : function(value){
            if (this.state.scale.y == value){
                return;
            }


            this.state.scale.y = value;
            this.$updateCamera();
            this.modules.camera.updateProjectionMatrix();
        },
        cameraPosition : {
            get : function(){ return this.modules.camera.position; }
        },
        scale : {
            get : function(){ return this.state.scale; }
        },
        size : {
            get : function(){ return this.state.size }
        },
        position : {
            get : function(){ return this.modules.camera.position }
        },
        scene : {
            get : function(){ return this.modules.scene }
        },
        size : {
            get : function(){ return this.state.size }
        },
        $updateCamera : function(){
            var camera = this.modules.camera;
            var frustum = this.modules.frustum;

            this.modules.camera.left = 0;
            this.modules.camera.top = this.state.size.y * this.state.scale.y;
            this.modules.camera.right = this.state.size.x * this.state.scale.x;
            this.modules.camera.bottom = 0;

            this.state.orthoCameraFrustumXPlane.set(this.modules.camera.left, this.modules.camera.right);
            this.state.orthoCameraFrustumYPlane.set(this.modules.camera.top, this.modules.camera.bottom);

            // this.modules.camera.updateProjectionMatrix();
            this.dispatchEvent("camera.position.changed", this.modules.camera.position);
        },
        startRendering : function(){
            if (this.__stopRendering){
                this.__stopRendering();
            }
            
            this.__stopRendering = this.modules.unicycle.addTask(this.render);
        },
        stopRendering : function(){
            if (typeof this.__stopRendering == "function"){
                this.__stopRendering();
            }
        },
        render : function(){
            // this.modules.engine.render(this.modules.scene, this.modules.camera);
            this.modules.composer.render();
        },
        dom : {
            get : function(){ return this.modules.engine.domElement }
        },
        setSize : function(width, height){
            width = Math.ceil(width);
            height = Math.ceil(height);

            this.state.size.set(width, height);
            this.modules.engine.setSize(width, height);
            this.modules.engine.domElement.style.width = "";
            this.modules.engine.domElement.style.height = "";
            this.modules.passMaster.update(this.state.size.x, this.state.size.y);
            this.$updateCamera();
            this.modules.camera.updateProjectionMatrix();

            this.dispatchEvent("resize", {
                width : width,
                height : height
            });

        },
        setSizeAsParent : function(){
            var parentNode = this.modules.engine.domElement.parentNode;
            if (parentNode){
                var rect = parentNode.getBoundingClientRect();
                this.setSize(rect.width * window.devicePixelRatio, rect.height * window.devicePixelRatio);
            }
        },
        getViewportInfo : function(){
            this.state.viewportInfo.fromArray([0, 0, 0, 0]);

            this.modules.scene.traverse(function(child){

            });
        },
        /*девелоперские методы*/
        _lookAt : function(x, y, gap){
            this.modules.camera.position.x = x;
            this.modules.camera.position.y = y;
            this.modules.camera.left = -gap;
            this.modules.camera.right = gap;
            this.modules.camera.top = -gap;
            this.modules.camera.bottom = gap;
            this.modules.camera.updateProjectionMatrix();

            this.state.orthoCameraFrustumXPlane.set(this.modules.camera.left, this.modules.camera.right);
            this.state.orthoCameraFrustumYPlane.set(this.modules.camera.top, this.modules.camera.bottom);

        },
        $setupPostprocessing : function(){
            var scene = this.modules.scene;
            var camera = this.modules.camera;

            var renderPass = new THREE.RenderPass( this.modules.scene, this.modules.camera );

            var outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
            
            var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
                effectFXAA.uniforms[ 'resolution' ].value.set( 
                    new Common.DataTypes.DataTypeComputed(1, function(){ return 1 / this.state.size.x }.bind(this)), 
                    new Common.DataTypes.DataTypeComputed(1, function(){ return 1 / this.state.size.y }.bind(this)), 
                );


            var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
            bloomPass.renderToScreen = true;
            bloomPass.threshold = 0.29;
            bloomPass.strength = 0.25;
            bloomPass.radius = 0.5;


            this.modules.composer.addPass( renderPass );
            // this.modules.composer.addPass( outlinePass );
            // this.modules.composer.addPass( bloomPass );
            // this.modules.composer.addPass( effectFXAA );

            this.shared.set("outlinePass", outlinePass);

            this.modules.passMaster.update(this.state.size.x, this.state.size.y);
        },
    });

    return Renderer;

});