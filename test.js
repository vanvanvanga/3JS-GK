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

scene.background = new THREE.Color(0xfff000);

// Create a sphere geometry and a material
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x0077ff });
const sphere = new THREE.Mesh(geometry, material);
sphere.castShadow = true;
sphere.receiveShadow = true;

// Add the sphere to the scene
scene.add(sphere);

// Set the initial position of the sphere
sphere.position.set(5, 0, 0); // 5 units away on the x-axis

const light = new THREE.DirectionalLight(0xff0000, 100);
light.castShadow = true;
light.position.set(8,0,0);
scene.add(light);

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