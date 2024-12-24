// 0. Import libraries ---------------------------------------------------------------------------
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from 'gsap';

// 1. Create Scene, Camera, Renderer -------------------------------------------------------------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60, // độ mở của camera
  window.innerWidth / window.innerHeight, // tỉ lệ khung hình
  0.1, // khoảng cách gần nhất thấy được
  1500 // khoảng cách xa nhất thấy được
);
camera.position.set(-150, 200, -220);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(-80, 0, 200); // TV
controls.minPolarAngle = 60 * (Math.PI / 180);
controls.maxPolarAngle = 88 * (Math.PI / 180);
controls.minAzimuthAngle = -170 * (Math.PI / 180);
controls.maxAzimuthAngle = -90 * (Math.PI / 180);
// controls.maxDistance = 540;

// 3. Background setup---------------------------------------------------------------------------
scene.background = new THREE.Color(0xffffff); // Background màu trắng

// 4. Objects (+ positioning, lighting) ---------------------------------------------------------
const loader = new GLTFLoader();

// 4.1. Căn phòng:---------------------------------------------------------------------------
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

// 4.2. Sofa:---------------------------------------------------------------------------
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

// 4.3. Bàn ăn:---------------------------------------------------------------------------
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

// 4.4. Đĩa thức ăn:---------------------------------------------------------------------------
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

// 4.5. Đèn huỳnh quang:---------------------------------------------------------------------------
// 4.5.1 Đèn:---------------------------------------------------------------------------
const loadLightTexture = new THREE.TextureLoader().load(
  "/textures/lightTexture.jpg"
);
const txtDen = new THREE.MeshPhongMaterial({ map: loadLightTexture });
const hinhTru = new THREE.CylinderGeometry(0.2, 0.2, 10, 100);
const den = new THREE.Mesh(hinhTru, txtDen);
scene.add(den);

// 4.6. Đế:---------------------------------------------------------------------------
const loadPanelTexture = new THREE.TextureLoader().load("panel.jpg");
const txtDe = new THREE.MeshPhongMaterial({ map: loadPanelTexture });
const hinhHop = new THREE.BoxGeometry(0.45, 10.5, 0.3);
const de = new THREE.Mesh(hinhHop, txtDe);
scene.add(de);
de.position.set(0, 1.2, 0);

// 4.7. Resize lại đèn HQ:---------------------------------------------------------------------------
den.scale.set(20, 20, 20);
de.scale.set(20, 20, 20);

// 4.7.1 Đặt vị trí đèn HQ:---------------------------------------------------------------------------
den.position.y += 235;
de.position.y += 235;
den.position.x -= 80;
de.position.x -= 80;

// 4.7.2 Xoay ngang đèn HQ:---------------------------------------------------------------------------
den.rotation.x += 3.14 / 2;
de.rotation.x += 3.14 / 2;
den.rotation.z += 3.14 / 2;
de.rotation.z += 3.14 / 2;

// 4.7. Đèn 2---------------------------------------------------------------------------
const den2 = den.clone();
scene.add(den2);
den2.position.z -= 10;

// 4.8. Đế 2:---------------------------------------------------------------------------
const de2 = de.clone();
scene.add(de2);
de2.position.z -= 10;

// 4.9. Kệ TV:---------------------------------------------------------------------------
const Boxtexture = new THREE.TextureLoader().load("/textures/go.jpg");
const boxmaterial = new THREE.MeshStandardMaterial({ map: Boxtexture });
const boxgeometry = new THREE.BoxGeometry(5, 1, 1);
const cube = new THREE.Mesh(boxgeometry, boxmaterial);
scene.add(cube);
cube.position.set(-80, 0, 200);
cube.scale.set(50, 100, 100);

// 5. Rèm cửa + Op2
// 5.1. Rèm cửa
const curtainTexture = new THREE.TextureLoader().load('curtain.png');
const txtRem = new THREE.MeshStandardMaterial({ map: curtainTexture });
const curtainGeometry = new THREE.BoxGeometry(0.01, 20, 12);
const curtainLeft = new THREE.Mesh(curtainGeometry, txtRem); 
const curtainRight = curtainLeft.clone(); 
scene.add ( curtainRight );
scene.add ( curtainLeft );
 
// 5.2. Thanh treo rèm
const geometry = new THREE.CylinderGeometry( 0.5, 0.5, 30, 100 ); 
const material = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 
const cylinder = new THREE.Mesh( geometry, material ); 
cylinder.rotation.x = Math.PI / 2;
scene.add( cylinder );

// 5.3 Resize lại rèm cửa
curtainLeft.scale.set (15, 15, 16);
curtainRight.scale.set (15, 15, 16);
cylinder.scale.set (13, 13, 13);

// 5.4. Đặt vị trí rèm cửa
cylinder.position.set (310, 230, -30);
curtainLeft.position.set (310, 75, -125);
curtainRight.position.set (310, 75, 65);

// 5.5. Đóng mở rèm cửa
let isCurtainOpen = true; 
function toggleCurtain() {
    if (isCurtainOpen) {
        gsap.to(curtainLeft.scale, { z: 5, duration: 1 });
        gsap.to(curtainLeft.position, { z: -190, duration: 1 }); 
        gsap.to(curtainRight.scale, { z: 5, duration: 1 });
        gsap.to(curtainRight.position, { z: 130, duration: 1 }); 
    } else {
        gsap.to(curtainLeft.scale, { z: 16, duration: 1 });
        gsap.to(curtainLeft.position, { z: -125, duration: 1 }); 
        gsap.to(curtainRight.scale, { z: 16, duration: 1 });
        gsap.to(curtainRight.position, { z: 65, duration: 1 }); 
    }
    isCurtainOpen = !isCurtainOpen;
}
document.getElementById('toggle-curtain').addEventListener('click', toggleCurtain);

// 6. TV + Opption 1:---------------------------------------------------------------------------
new GLTFLoader().load('GK-tv.glb',
    function (tv) {
        scene.add(tv.scene);
        tv.scene.position.set(-80, 50, 200);
        tv.scene.rotation.set(0, -3.14, 0);
        tv.scene.scale.set(260, 220, 260);

        tv.scene.traverse(function (child) {
            if (child.isMesh && child.name === 'TV1_Screen_0') {
                tvScreenMesh = child;
                tvScreenMesh.material = new THREE.MeshBasicMaterial({ map: blackTexture });
            }
        });
    }
);


// 6.1. Video và Texture---------------------------------------------------------------------------
const video = document.getElementById('tv-video');
video.muted = false;
video.volume = 1.0;
video.pause();
video.currentTime = 0; // Đặt lại thời gian phát về đầu
const videoTexture = new THREE.VideoTexture(video);
const blackTexture = new THREE.TextureLoader().load('black.png');
let tvScreenMesh = null;
let isTvOn = false;

// 6.2. Đổi kênh---------------------------------------------------------------------------
const channels = [
    './video/channel1.mp4',
    './video/channel2.mp4',
    './video/channel3.mp4'
];
let currentChannel = 0;
function changeChannel() {
    if (isTvOn) {
        currentChannel = (currentChannel + 1) % channels.length;
        video.src = channels[currentChannel];
        video.play();
    }
}


// 6.3. Bật/Tắt màn hình TV và ánh sáng---------------------------------------------------------------------------
function toggleTvAndSpotLight() {
if (tvScreenMesh) {
    // Đảo trạng thái của TV
    isTvOn = !isTvOn;

    if (isTvOn) {
        // Khi bật TV
        tvScreenMesh.material.map = videoTexture; // Hiển thị video
        video.play(); // Phát video
        spotLight.intensity = 75000; // Bật ánh sáng
    } else {
        // Khi tắt TV
        tvScreenMesh.material.map = blackTexture; // Hiển thị màn hình đen
        video.pause(); // Tạm dừng video
        spotLight.intensity = 0; // Tắt ánh sáng
    }
}
}


// 6.4. Đảm bảo phát âm thanh sau tương tác---------------------------------------------------------------------------
function enableAudioPlayback() {
video.play().then(() => {
    console.log('Video playback started with sound');
}).catch((error) => {
    console.error('Error enabling audio playback:', error);
});
// 6.5. Đảm bảo video không phát khi gắn vào texture---------------------------------------------------------------------------
video.addEventListener('play', () => {
  if (!isTvOn) {
      video.pause(); // Dừng phát nếu TV chưa bật
  }
});

// 6.6. Xóa sự kiện sau khi kích hoạt âm thanh---------------------------------------------------------------------------
window.removeEventListener('click', enableAudioPlayback);
window.removeEventListener('keydown', enableAudioPlayback);
}

// 6.7. Gắn sự kiện phát âm thanh---------------------------------------------------------------------------
window.addEventListener('click', enableAudioPlayback);
window.addEventListener('keydown', enableAudioPlayback);

// 6.8. Gắn sự kiện vào nút HTML---------------------------------------------------------------------------
const button = document.getElementById('toggle-tv-and-spotlight');
button.addEventListener('click', toggleTvAndSpotLight);



// 6.9. Space để đổi kênh---------------------------------------------------------------------------
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        changeChannel();
    }
 });

//7. Ánh sáng---------------------------------------------------------------------------
// 7.1. Ánh sáng môi trường
const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

// 7.2. Ánh sáng đèn HQ
const pLight1 = new THREE.PointLight(0xffffff, 10000, 1000);
pLight1.position.set(-80, 225, 0);
scene.add(pLight1);

const pLight2 = pLight1.clone();
pLight2.position.set(-10, 225, 0);
scene.add(pLight2);

const pLight3 = pLight1.clone();
pLight3.position.set(-150, 225, 0);
scene.add(pLight3);

// 7.3. Ánh sáng TV
const spotLight = new THREE.SpotLight(0x99ffff, 50000);
spotLight.position.set(-80, 125, 210);
spotLight.angle = Math.PI / 6.25;
spotLight.distance = 500;
scene.add(spotLight);
spotLight.intensity = 0;
const targetObject = new THREE.Object3D(); // Tạo đối tượng làm target
scene.add(targetObject); // Thêm target vào scene
targetObject.position.set(-100, 50, -500); // Di chuyển target sang phải 1 đơn vị
spotLight.target = targetObject; // Gán target cho ánh sáng
spotLight.target.updateMatrixWorld(); // Cập nhật lại vị trí target
// const spotLightHelper = new THREE.SpotLightHelper( spotLight );
// scene.add( spotLightHelper );

//7.4. Ánh sáng mặt trời
const directionalLight = new THREE.DirectionalLight( 0xFFFF99, 1 ); // Màu vàng
  directionalLight.castShadow = true;
  directionalLight.position.set (10000, 10000, 10000);
  scene.add( directionalLight );
  
// 8. Vòng lặp Animate------------------------------------------------------------------------
function animate() {
  // console.log(camera.position); // in vị trí của camera trong console
  // console.log("Góc quay chiều ngang: " + controls.getAzimuthalAngle() * (180 / Math.PI));
  console.log("Góc quay chiều dọc: " + controls.getPolarAngle() * (180 / Math.PI));
  console.log("Khoảng cách từ camera đến target: " + controls.getDistance());
  controls.update();
  renderer.render(scene, camera);
}

// 9. Other stuff ---------------------------------------------------------------------------
const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);
// Màu đỏ -> x; Màu xanh nước biển -> z; Màu xanh lá -> y
