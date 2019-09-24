var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var geometry = new THREE.BoxGeometry(3, 3, 3);
var material = new THREE.MeshBasicMaterial({ color: 0x32CCFF });
var cube = new THREE.Mesh(geometry, material);
cube.position.x = -3;
cube.position.y = 1;
cube.position.z = 1;
var cubes = [];
cubes.push(cube);

var i = 0;
while (i < 43) {
  var newMaterial = material.clone();
  newMaterial.color.set(0x32CCFF);
  var newCube = new THREE.Mesh(geometry, newMaterial);
  newCube.position.x = 4 * i;
  newCube.position.y = 1;
  newCube.position.z = 1;
  cubes.push(newCube);
  i += 1;
};

cubes.forEach(function (c) {
  scene.add(c);
});


camera.position.x = 170;
camera.position.y = 15;
camera.position.z = 50;
camera.rotation.y = 365;

console.log(camera);


var listener = new THREE.AudioListener();
camera.add(listener);

// create an Audio source
var sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
var audioLoader = new THREE.AudioLoader();
audioLoader.load('assets/mp3/Bonobo_Cirrus.mp3', function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
});

// create an AudioAnalyser, passing in the sound and desired fftSize
var analyser = new THREE.AudioAnalyser(sound, 128);

// get the average frequency of the sound
var data = analyser.getFrequencyData();


console.log(data);

var animate = function () {
  requestAnimationFrame(animate);
  
  cubes.forEach(function (c, i) {
    c.position.y = 0.1 * data[i];
  });

  render();
};

animate();

function render() {
  data = analyser.getFrequencyData();

  renderer.render(scene, camera);
}

var playButton = document.getElementById('playButton');
playButton.addEventListener('click', () => {
  sound.play();

});

var stopButton = document.getElementById('stopButton');
stopButton.addEventListener('click', () => {
  sound.stop();
  console.log(data[9]);
});