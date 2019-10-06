import * as THREE from './three.module.js';

import { EffectComposer } from '../postprocessing/EffectComposer.js';
import { RenderPass } from '../postprocessing/RenderPass.js';
import { ShaderPass } from '../postprocessing/ShaderPass.js';
import { GlitchPass } from '../postprocessing/GlitchPass.js';

import { RGBShiftShader } from '../shaders/RGBShiftShader.js';
import { DotScreenShader } from '../shaders/DotScreenShader.js';


var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000)
var renderer = new THREE.WebGLRenderer()
camera.position.x = Math.sin(0) * 80
camera.position.y = 50

camera.position.z = 150
renderer.setClearColor(0xdddddd)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMapSoft = true

// CUBE
var geometry = new THREE.BoxGeometry(40, 40, 40);
var material = new THREE.MeshPhongMaterial({ color: 0x32CCFF });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube)

//LIGHTS
var light, composer;
light = new THREE.DirectionalLight(0xff);
light.position.set(100, 100, 100);
light.lookAt(cube.position)
scene.add(light);
camera.lookAt(cube.position)
document.body.appendChild(renderer.domElement)

// POSTPRECESSING
composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

var effectGlitch = new GlitchPass(64)
composer.addPass(effectGlitch)
// var effect = new ShaderPass(DotScreenShader);
// effect.uniforms['scale'].value = 4;
// composer.addPass(effect);

var effect = new ShaderPass(RGBShiftShader);
effect.uniforms['amount'].value = 0;
composer.addPass(effect);

var increment = 0;
var glitchOn = false;
var render = function () {
  increment += 0.01
  requestAnimationFrame(render);
  cube.position.y += Math.sin(increment) * 0.05
  cube.rotation.y += 0.01
  cube.rotation.x += 0.03
  effect.uniforms['amount'].value = Math.sin(5 * increment) * 0.1;
  composer.render(scene, camera);
  glitchOn = Math.sin(increment * 3) > 0 ? false : true
  effectGlitch.goWild = glitchOn;
  
};

window.addEventListener('resize', onWindowResize, false);

render();


function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);

}