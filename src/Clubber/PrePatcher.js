"use strict";
define([
		"dollaclass",
		"three", 
		"Clubber/Common/Common",
		"Clubber/Helpers"
	], function($Class, THREE, Common, Helpers){

	var state = new Common.StateKeeper({
		object3DprotoPatched : false,
		domPatched : false
	});

	var PrePatcher = new $Class({
		name : "PrePatcher",
		namespace : "Clubber.PrePatcher"
	}, {
		
		$constructor : function(plot3UUID){
			this.data = {
				instancedGeometries : {},
				domPatched : false,
				plot3UUID : plot3UUID
			};

			this.$patchObject3DPrototype();
			this.$patchPrecision();
			this.$patchDOMNodePrototype();
		},
		$patchObject3DPrototype : function(){
			var $prePatcher = this;

			if (state.object3DprotoPatched){
				return;
			}

			state.object3DprotoPatched = true;

			var add = THREE.Object3D.prototype.add;
			var remove = THREE.Object3D.prototype.remove;


			Object.defineProperty(THREE.Object3D.prototype, "interactive", {
				get : function(){
					if (typeof this.$isInteractive == "undefined"){
						this.$isInteractive = false;
					}

					return this.$isInteractive;
				},
				set : function(v){
					this.$isInteractive = v;
					var rootNode = this;

					while (rootNode.parent){
						rootNode = rootNode.parent;
					} 

					if (rootNode && rootNode instanceof THREE.Scene && v){
						rootNode.interactiveChildren = rootNode.interactiveChildren || {};
						rootNode.interactiveChildren[this.uuid] = this;
					} else if (rootNode && rootNode instanceof THREE.Scene && !v){
						rootNode.interactiveChildren = rootNode.interactiveChildren || {};
						delete rootNode.interactiveChildren[this.uuid];
					}

				}
			});


			Object.defineProperty(THREE.Object3D.prototype, "updateInteractionState", {
				value : function(){
					this.interactive = this.interactive;

					if (this.children){
						Helpers.forEach(this.children, function(child, index){
							child.updateInteractionState();
						});
					}
				}
			});

			Object.defineProperty(THREE.Object3D.prototype, "setInteractionCallback", {
				value : function(eventName, callback){
					this.interactionCallbacks = this.interactionCallbacks || {};
					this.interactionCallbacks[eventName] = callback;
				}
			});

			Object.defineProperty(THREE.Object3D.prototype, "dom", {
				get : function(){
					this.$dom = this.$dom || document.createElement(this.type || "Object3D");
					this.$dom.object3D = this;
					return this.$dom;
				}
			});	

			THREE.Object3D.prototype.add = function(object){
				// this.dom.appendChild(object.dom);
				add.apply(this, arguments);
				this.updateInteractionState();
			};

			THREE.Object3D.prototype.remove = function(object){
				remove.apply(this, arguments);
				object.interactive = false;
				if (object.interactiveBox){
					object.interactiveBox.dispose();
				}
				// if (this.dom.isSameNode(object.dom.parentNode)){
				// 	this.dom.removeChild(object.dom);
				// }
			};

			THREE.Object3D.prototype.select = function(selector, callback){
				var nodes =  this.$dom.querySelectorAll(selector);
				nodes = Helpers.arrReplace(nodes, function(dom){ return dom.object3D });
				if (callback){
					Helpers.forEach(nodes, callback);
				}

				return nodes;
			};


			/*scene*/
			var THREE_Scene_add = THREE.Scene.prototype.add;

			Object.defineProperty(THREE.Scene.prototype, "add", {
				value : function(object){
					THREE_Scene_add.apply(this, arguments);
					this.updateInteractionState();
				}
			});	

			// THREE.WebGLUniforms.prototype.setValue3fv = function( gl, v ) {

			// 	if ( v.x !== undefined )
			// 		gl.uniform3f( this.addr, v.x, v.y, v.z );
			// 	else if ( v.r !== undefined )
			// 		gl.uniform3f( this.addr, v.r, v.g, v.b );
			// 	else
			// 		gl.uniform3fv( this.addr, v.valueOf() );

			// };


			THREE.Object3D.prototype.clone = function(){
				return new THREE.Mesh(this.geometry, this.material);
			}
		},
		$patchPrecision : function(){
			/*Mat4*/


			var Matrix4Prototype = THREE.Matrix4.prototype;
			THREE.Matrix4_64 = function(){
				// this.$elements32 = new Float32Array(16);
				this.elements = new Float64Array( [
					1, 0, 0, 0,
					0, 1, 0, 0,
					0, 0, 1, 0,
					0, 0, 0, 1
				] );

				if ( arguments.length > 0 ) {
					console.error( 'THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.' );
				}
			};

			THREE.Matrix4_64.prototype = Matrix4Prototype;

			// THREE.WebGLUniforms.prototype.setValue4fm = function(gl, v){
			// 	this.$elements32.set(v.elements || v);
			// 	gl.uniformMatrix4fv( this.addr, false, this.$elements32 );
			// }

			/*Mat3*/
			var Matrix3Prototype = THREE.Matrix3.prototype;
			THREE.Matrix3_64 = function () {
				// this.$elements32 = new Float32Array(9);
				this.elements = new Float64Array( [
					1, 0, 0,
					0, 1, 0,
					0, 0, 1
				] );

				if ( arguments.length > 0 ) {
					console.error( 'THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.' );
				}
			};

			THREE.Matrix3.prototype = Matrix3Prototype;

			/*Camera*/
			var CameraPrototype = THREE.Camera.prototype;

			THREE.Camera = function () {
				THREE.Object3D.call( this );

				this.type = 'Camera';

				this.matrixWorldInverse = new THREE.Matrix4_64();
				this.projectionMatrix = new THREE.Matrix4_64();

			};

			THREE.Camera.prototype = CameraPrototype;

			/*Object3D*/
			var Object3DPrototype = THREE.Object3D.prototype;
			THREE.Object3D = THREE.Object3D = function () {

				Object.defineProperty( this, 'id', { value: THREE.Object3DIdCount ++ } );

				this.uuid = THREE.Math.generateUUID();

				this.name = '';
				this.type = 'Object3D';

				this.parent = null;
				this.children = [];

				this.up = THREE.Object3D.DefaultUp.clone();

				var position = new THREE.Vector3();
				var rotation = new THREE.Euler();
				var quaternion = new THREE.Quaternion();
				var scale = new THREE.Vector3( 1, 1, 1 );

				function onRotationChange() {

					quaternion.setFromEuler( rotation, false );

				}

				function onQuaternionChange() {

					rotation.setFromQuaternion( quaternion, undefined, false );

				}

				rotation.onChange( onRotationChange );
				quaternion.onChange( onQuaternionChange );

				Object.defineProperties( this, {
					position: {
						enumerable: true,
						value: position
					},
					rotation: {
						enumerable: true,
						value: rotation
					},
					quaternion: {
						enumerable: true,
						value: quaternion
					},
					scale: {
						enumerable: true,
						value: scale
					},
					modelViewMatrix: {
						value: new THREE.Matrix4()
					},
					normalMatrix: {
						value: new THREE.Matrix3()
					}
				} );

				this.matrix = new THREE.Matrix4_64();
				this.matrixWorld = new THREE.Matrix4_64();

				this.matrixAutoUpdate = THREE.Object3D.DefaultMatrixAutoUpdate;
				this.matrixWorldNeedsUpdate = false;

				this.layers = new THREE.Layers();
				this.visible = true;

				this.castShadow = false;
				this.receiveShadow = false;

				this.frustumCulled = true;
				this.renderOrder = 0;

				this.userData = {};

			};

			THREE.Object3D.prototype = Object3DPrototype;
			THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 1, 0 );
			THREE.Object3D.DefaultMatrixAutoUpdate = true;
		},
		$patchDOMNodePrototype : function(){

			if (state.domPatched){
				return;
			}

			state.domPatched = true;

			Object.defineProperty(window.Node.prototype, "textNodeContent", {
				get : function(){
					this.textNode = this.textNode || this.querySelector("p");
					if (this.textNode){
						return this.textNode.textContent;
					}
				},
				set : function(v){
					this.textNode = this.textNode || this.querySelector("p");
					if (this.textNode){
						this.textNode.textContent = v;
					}
				}
			});
		}
	});

	return PrePatcher;

});