import * as THREE from 'three';
import { AudioLoader } from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up audio listener attached to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// Create a sphere geometry and a material
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x0077ff });
const sphere = new THREE.Mesh(geometry, material);

// Add the sphere to the scene
scene.add(sphere);

// Set the initial position of the sphere
sphere.position.set(5, 0, 0); // 5 units away on the x-axis

// Create an AudioLoader to load sound
const audioLoader = new AudioLoader();

// Create positional audio for the sphere
const sound = new THREE.PositionalAudio(listener);

// Load a sound and attach it to the sphere
audioLoader.load('/music/fly.mp3', (buffer) => {
    sound.setBuffer(buffer);
    sound.setRefDistance(1); // Distance at which the sound starts fading
    sound.setLoop(true); // Loop the sound
    sound.setVolume(1); // Set volume (0 to 1)
    sound.play();
});

// Attach the positional audio to the sphere
sphere.add(sound);

// Set up basic camera controls (move the camera for demonstration)
camera.position.z = 10;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the sphere for some simple animation
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

// Update the renderer size on window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});