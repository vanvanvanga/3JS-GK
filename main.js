// 0. Import libraries ---------------------------------------------------------------------------
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// 1. Create Scene, Camera, Renderer -------------------------------------------------------------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, // độ xa của camera
  window.innerWidth / window.innerHeight, // tỉ lệ khung hình
  0.1, // khoảng cách gần nhất thấy được
  9000 // khoảng cách xa nhất thấy được
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// 2. Background set up ---------------------------------------------------------
scene.background = new THREE.Color(0xffffff); // Background màu trắng

const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Màu vàng
scene.add(ambientLight);

// 3. Objects (+ positioning, lighting) ---------------------------------------------------------
const loader = new GLTFLoader();

// Căn phòng:
loader.load(
  "/model/GK-room.glb",
  function (model) {
    scene.add(model.scene);
    model.scene.scale.set(2, 1, 2);
    model.scene.position.x = 150;
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Sofa:
loader.load(
  "/model/GK-sofa.glb",
  function (model) {
    scene.add(model.scene);
    model.scene.scale.set(200, 200, 200);
    model.scene.position.set(-80, 65, -260);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Bàn ăn:
loader.load(
  "/model/GK-table.glb",
  function (model) {
    scene.add(model.scene);
    model.scene.scale.set(210, 90, 150);
    model.scene.position.set(-80, 0, -60);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Đĩa thức ăn:
loader.load(
  "/model/GK-pasta.glb",
  function (model) {
    scene.add(model.scene);
    model.scene.scale.set(5, 5, 5);
    model.scene.position.set(-150, 58, -75);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Đèn huỳnh quang:
// -- Đèn:
const loadLightTexture = new THREE.TextureLoader().load(
  "/textures/lightTexture.jpg"
);
const txtDen = new THREE.MeshPhongMaterial({ map: loadLightTexture });
const hinhTru = new THREE.CylinderGeometry(0.2, 0.2, 10, 100);
const den = new THREE.Mesh(hinhTru, txtDen);
scene.add(den);

// -- Đế:
const loadPanelTexture = new THREE.TextureLoader().load("/textures/panel.jpg");
const txtDe = new THREE.MeshPhongMaterial({ map: loadPanelTexture });
const hinhHop = new THREE.BoxGeometry(0.45, 10.5, 0.3);
const de = new THREE.Mesh(hinhHop, txtDe);
scene.add(de);
de.position.set(0, 1.2, 0);

// ---- Resize lại đèn HQ:
den.scale.set(20, 20, 20);
de.scale.set(20, 20, 20);

// ---- Đặt vị trí đèn HQ:
den.position.y += 235;
de.position.y += 235;
den.position.x -= 80;
de.position.x -= 80;

// ---- Xoay ngang đèn HQ:
den.rotation.x += 3.14 / 2;
de.rotation.x += 3.14 / 2;
den.rotation.z += 3.14 / 2;
de.rotation.z += 3.14 / 2;

// -- Đèn 2
const den2 = den.clone();
scene.add(den2);
den2.position.z -= 10;

// -- Đế 2:
const de2 = de.clone();
scene.add(de2);
de2.position.z -= 10;

// Kệ TV:
const Boxtexture = new THREE.TextureLoader().load("/textures/go.jpg");
const boxmaterial = new THREE.MeshStandardMaterial({ map: Boxtexture });
const boxgeometry = new THREE.BoxGeometry(5, 1, 1);
const cube = new THREE.Mesh(boxgeometry, boxmaterial);
scene.add(cube);
cube.position.set(-80, 0, 200);
cube.scale.set(50, 100, 100);

// TV:
loader.load(
  "/model/GK-tv.glb",
  function (model) {
    scene.add(model.scene);
    model.scene.rotation.set(0, -3.14, 0);
    model.scene.scale.set(260, 220, 260);
    model.scene.position.set(-80, 50, 200);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Ánh sáng
const pLight1 = new THREE.PointLight( 0xFFFFFF, 10000, 1000 );
pLight1.position.set( -80, 225, 0 );
scene.add( pLight1 );
const pLight2 = new THREE.PointLight( 0xFFFFFF, 10000, 1000 );
pLight2.position.set( -10, 225, 0 );
scene.add( pLight2 );
const pLight3 = new THREE.PointLight( 0xFFFFFF, 10000, 1000 );
pLight3.position.set( -150, 225, 0 );
scene.add( pLight3 );

// 4. Camera position setup ----------------------------------------------------------------------
camera.position.set(50, 1, -55);

// 5. Animate ---------------------------------------------------------------------------
function animate() {
  console.log(camera.position); // in vị trí của camera trong console
  controls.update();
  renderer.render(scene, camera);
}

// 6. Other stuff ---------------------------------------------------------------------------
const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);
// Màu đỏ -> x; Màu xanh nước biển -> z; Màu xanh lá -> y
