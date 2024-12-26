// 0. Import libraries ---------------------------------------------------------------------------
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";

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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// Giới hạn khả năng xoay/di chuyển của camera
controls.target.set(-80, 0, 200); // TV
controls.minPolarAngle = 60 * (Math.PI / 180);
controls.maxPolarAngle = 88 * (Math.PI / 180);
controls.minAzimuthAngle = -170 * (Math.PI / 180);
controls.maxAzimuthAngle = -90 * (Math.PI / 180);
controls.maxDistance = 470;

// 2. Âm thanh ----------------------------------------------------------------------------------
// Thiết lập âm thanh
const listener = new THREE.AudioListener();
camera.add(listener);

// Tiếng ruồi:

			const audioElement = document.getElementById( 'music' );
			audioElement.play();

			const positionalAudio = new THREE.PositionalAudio( listener );
			positionalAudio.setMediaElementSource( audioElement );
			positionalAudio.setRefDistance( 10 );

// Tiếng ve:
const sound = new THREE.Audio(listener);
new THREE.AudioLoader().load('/music/ve.mp3', function(buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});

// Tiếng ruồi gần camera:

const audioElement3 = document.getElementById( 'music3' );
audioElement3.play();

const positionalAudio3 = new THREE.PositionalAudio( listener );
positionalAudio3.setMediaElementSource( audioElement3 );
positionalAudio3.setRefDistance( 100 );

const s3_g = new THREE.BoxGeometry( 1, 1, 1 ); 
const s3_m = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: true, opacity: 0} ); 
const s3 = new THREE.Mesh( s3_g, s3_m ); 
scene.add( s3 );
s3.position.set(-150, 200, -220);
s3.add(positionalAudio3);

			// const helper = new PositionalAudioHelper( positionalAudio, 10 );
			// positionalAudio.add( helper );

      // const helper2 = new PositionalAudioHelper( positionalAudio2, 10 );
			// positionalAudio2.add( helper2 );


// 3. Background setup---------------------------------------------------------------------------
scene.background = new THREE.CubeTextureLoader()
.setPath("/background/")
.load(["posx.jpg", "negx.jpg", "posy.jpg", "negy.jpg", "posz.jpg", "negz.jpg"]);

// 4. Objects (+ positioning, lighting) ---------------------------------------------------------
const loader = new GLTFLoader();

// 4.0. Con ruồi: --------------------------------------------------------------------------
// a. Ruồi 0 - Ruồi ở đĩa thức ăn
let fly0, fly0_sPos;
loader.load(
  "/model/GK-fly.glb",
  function (model) {
    fly0 = model.scene;
    scene.add(fly0);
    fly0.scale.set(0.01, 0.01, 0.01);
    fly0_sPos = { x: -150, y: 70, z: -75 };
    fly0.position.set(fly0_sPos.x, fly0_sPos.y, fly0_sPos.z);
    // fly0.add(sound);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// gia toc goc beta lmao
let r = 20,
  angle = 0,
  beta = 0.1,
  fly0_path = (angle) => {
    return {
      x: fly0_sPos.x + r * Math.cos(angle),
      y: fly0_sPos.y + 5 * Math.sin(angle), // làm sao để ruồi nhấp nhô
      z: fly0_sPos.z + r * Math.sin(angle),
    };
  };
// fly0Animation runs again everytime animate is looped so r and angle must be global
function fly0Animation() {
  if (fly0) {
    let cPos = fly0_path(angle),
      nPos = fly0_path(angle + beta);
    fly0.position.set(cPos.x, cPos.y, cPos.z);
    fly0.lookAt(nPos.x, nPos.y, nPos.z);
    angle += beta;
  }
}

// b. Ruồi 2 - gần đĩa thức ăn - bay hình số 8
let fly1, fly1_sPos;
loader.load(
  "/model/GK-fly.glb",
  function (model) {
    fly1 = model.scene;
    scene.add(fly1);
    fly1.scale.set(0.01, 0.01, 0.01);
    fly1_sPos = { x: fly0_sPos.x, y: fly0_sPos.y, z: fly0_sPos.z };
    fly1.position.set(fly1_sPos.x, fly1_sPos.y, fly1_sPos.z);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

let t = 0,
  delta = 0.1,
  a = 25,
  fly1_path = (t) => {
    return {
      x: fly1_sPos.x + (a * Math.cos(t)) / (1 + Math.sin(t) ** 2),
      y: fly1_sPos.y,
      z: fly1_sPos.z + (a * Math.cos(t) * Math.sin(t)) / (1 + Math.sin(t) ** 2),
    };
  };

function fly1Animation() {
  if (fly1) {
    let cPos = fly1_path(t),
      nPos = fly1_path(t + delta);
    fly1.position.set(cPos.x, cPos.y, cPos.z);
    fly1.lookAt(nPos.x, nPos.y, nPos.z);
    t += delta;
  }
}

// a. Ruồi c - gần camera
let fly2, fly2_sPos;
loader.load(
  "/model/GK-fly.glb",
  function (model) {
    fly2 = model.scene;
    scene.add(fly2);
    fly2.scale.set(0.01, 0.01, 0.01);
    fly2_sPos = {
      x: camera.position.x,
      y: camera.position.y - 10,
      z: camera.position.z + 20,
    };
    fly2.position.set(fly2_sPos.x, fly2_sPos.y, fly2_sPos.z);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

let a2 = 15,
  k2 = 0.75,
  angle2 = 0,
  delta2 = 0.25;
let fly2_path = (angle2) => {
  return {
    x: fly2_sPos.x + a2 * Math.cos(k2 * angle2) * Math.cos(angle2),
    y: fly2_sPos.y,
    z: fly2_sPos.z + a2 * Math.cos(k2 * angle2) * Math.sin(angle2),
  };
};

function fly2Animation() {
  if (fly2) {
    let cPos = fly2_path(angle4),
      nPos = fly2_path(angle2 + delta2);
    fly2.position.set(cPos.x, cPos.y, cPos.z);
    fly2.lookAt(nPos.x, nPos.y, nPos.z);
    angle2 += delta2;
  }
}

// b. Ruồi 3 - gần camera
let fly3, fly3_sPos;
loader.load(
  "/model/GK-fly.glb",
  function (model) {
    fly3 = model.scene;
    scene.add(fly3);
    fly3.scale.set(0.01, 0.01, 0.01);
    fly3_sPos = {
      x: camera.position.x,
      y: camera.position.y - 5,
      z: camera.position.z + 20,
    };
    fly3.position.set(fly3_sPos.x, fly3_sPos.y, fly3_sPos.z);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

let t3 = 0,
  delta3 = 0.1,
  a3 = 25,
  fly3_path = (t3) => {
    return {
      x: fly3_sPos.x + (a3 * Math.cos(t3)) / (1 + Math.sin(t3) ** 2),
      y: fly3_sPos.y,
      z:
        fly3_sPos.z +
        (a3 * Math.cos(t3) * Math.sin(t3)) / (1 + Math.sin(t3) ** 2),
    };
  };

function fly3Animation() {
  if (fly3) {
    let cPos = fly3_path(t3),
      nPos = fly3_path(t3 + delta3);
    fly3.position.set(cPos.x, cPos.y, cPos.z);
    fly3.lookAt(nPos.x, nPos.y, nPos.z);
    t3 += delta;
  }
}

// e. Ruồi 4 - gần camera
let fly4, fly4_sPos;
loader.load(
  "/model/GK-fly.glb",
  function (model) {
    fly4 = model.scene;
    scene.add(fly4);
    fly4.scale.set(0.01, 0.01, 0.01);
    fly4_sPos = {
      x: camera.position.x,
      y: camera.position.y - 20,
      z: camera.position.z + 20,
    };
    fly4.position.set(fly4_sPos.x, fly4_sPos.y, fly4_sPos.z);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

let a4 = 20,
  k4 = 1.5,
  angle4 = 0,
  delta4 = 0.2;
let fly4_path = (angle4) => {
  return {
    x: fly4_sPos.x + a4 * Math.cos(k4 * angle4) * Math.cos(angle4),
    y: fly4_sPos.y,
    z: fly4_sPos.z + a4 * Math.cos(k4 * angle4) * Math.sin(angle4),
  };
};

function fly4Animation() {
  if (fly4) {
    let cPos = fly4_path(angle4),
      nPos = fly4_path(angle4 + delta4);
    fly4.position.set(cPos.x, cPos.y, cPos.z);
    fly4.lookAt(nPos.x, nPos.y, nPos.z);
    angle4 += delta4;
  }
}

// 4.1. Căn phòng:---------------------------------------------------------------------------
loader.load(
  "/model/GK-room.glb",
  function (model) {
    scene.add(model.scene);
    model.scene.scale.set(2, 1, 2);
    model.scene.position.x = 150;
    model.scene.traverse(function (child) {
      if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
      }
  });
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
    model.scene.traverse(function (child) {
      if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
      }
  });
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
    model.scene.traverse(function (child) {
      if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
      }
  });
  directionalLight.target = model.scene;
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
    model.scene.add(positionalAudio);
    model.scene.traverse(function (child) {
      if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
      }
  });
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
const curtainTexture = new THREE.TextureLoader().load("/textures/curtain.png");
const txtRem = new THREE.MeshStandardMaterial({ map: curtainTexture });
const curtainGeometry = new THREE.BoxGeometry(0.01, 20, 12);
const curtainLeft = new THREE.Mesh(curtainGeometry, txtRem);
const curtainRight = curtainLeft.clone();
curtainLeft.receiveShadow = true;
curtainRight.receiveShadow = true;
scene.add(curtainRight);
scene.add(curtainLeft);

// 5.2. Thanh treo rèm
const curtainRodTexture = new THREE.TextureLoader().load(
  "/textures/curtainRod.png"
);
const txtThanhTreo = new THREE.MeshStandardMaterial({ map: curtainRodTexture });
const geometry = new THREE.CylinderGeometry(0.5, 0.5, 30, 100);
const cylinder = new THREE.Mesh(geometry, txtThanhTreo);
cylinder.rotation.x = Math.PI / 2;
cylinder.receiveShadow = true;
scene.add(cylinder);

// 5.3 Resize lại rèm cửa
curtainLeft.scale.set(15, 15, 16);
curtainRight.scale.set(15, 15, 16);
cylinder.scale.set(13, 13, 13);

// 5.4. Đặt vị trí rèm cửa
cylinder.position.set(310, 230, -30);
curtainLeft.position.set(310, 75, -125);
curtainRight.position.set(310, 75, 65);

// 5.5. Đóng mở rèm cửa
let isCurtainOpen = true;
function toggleCurtain() {
  if (isCurtainOpen) {
    gsap.to(curtainLeft.scale, { z: 5, duration: 1 });
    gsap.to(curtainLeft.position, { z: -190, duration: 1 });
    gsap.to(curtainRight.scale, { z: 5, duration: 1 });
    gsap.to(curtainRight.position, { z: 130, duration: 1 });
    gsap.to(directionalLight, { intensity: 10, duration: 1 });
    gsap.to(light, { intensity: 1, duration: 1 });
  } else {
    gsap.to(curtainLeft.scale, { z: 16, duration: 1 });
    gsap.to(curtainLeft.position, { z: -125, duration: 1 });
    gsap.to(curtainRight.scale, { z: 16, duration: 1 });
    gsap.to(curtainRight.position, { z: 65, duration: 1 });
    gsap.to(directionalLight, { intensity: 0, duration: 1 });
    gsap.to(light, { intensity: 0, duration: 1 });
  }
  isCurtainOpen = !isCurtainOpen;
}
document
  .getElementById("toggle-curtain")
  .addEventListener("click", toggleCurtain);

// 6. TV + Option 1:---------------------------------------------------------------------------
new GLTFLoader().load("/model/GK-tv.glb", function (tv) {
  scene.add(tv.scene);
  tv.scene.position.set(-80, 50, 200);
  tv.scene.rotation.set(0, -3.14, 0);
  tv.scene.scale.set(260, 220, 260);

  tv.scene.traverse(function (child) {
    if (child.isMesh && child.name === "TV1_Screen_0") {
      tvScreenMesh = child;
      tvScreenMesh.material = new THREE.MeshBasicMaterial({
        map: blackTexture,
      });
    }
  });
});

// 6.1. Video và Texture---------------------------------------------------------------------------
const video = document.getElementById("tv-video");
video.muted = false;
video.volume = 1.0;
video.pause();
video.currentTime = 0; // Đặt lại thời gian phát về đầu
const videoTexture = new THREE.VideoTexture(video);
const blackTexture = new THREE.TextureLoader().load("black.png"); // placeholder to help with toggling tv on/off
let tvScreenMesh = null;
let isTvOn = false;

// 6.2. Đổi kênh---------------------------------------------------------------------------
const channels = [
  "/videos/channel1.mp4",
  "/videos/channel2.mp4",
  "/videos/channel3.mp4",
  "/videos/channel4.mp4",
  "/videos/channel5.mp4",
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
  video
    .play()
    .then(() => {
      console.log("Video playback started with sound");
    })
    .catch((error) => {
      console.error("Error enabling audio playback:", error);
    });
  // 6.5. Đảm bảo video không phát khi gắn vào texture---------------------------------------------------------------------------
  video.addEventListener("play", () => {
    if (!isTvOn) {
      video.pause(); // Dừng phát nếu TV chưa bật
    }
  });

  // 6.6. Xóa sự kiện sau khi kích hoạt âm thanh---------------------------------------------------------------------------
  window.removeEventListener("click", enableAudioPlayback);
  window.removeEventListener("keydown", enableAudioPlayback);
}

// 6.7. Gắn sự kiện phát âm thanh---------------------------------------------------------------------------
window.addEventListener("click", enableAudioPlayback);
window.addEventListener("keydown", enableAudioPlayback);

// 6.8. Gắn sự kiện vào nút HTML---------------------------------------------------------------------------
const button = document.getElementById("toggle-tv-and-spotlight");
button.addEventListener("click", toggleTvAndSpotLight);

// 6.9. Space để đổi kênh---------------------------------------------------------------------------
window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    changeChannel();
  }
});

//7. Ánh sáng---------------------------------------------------------------------------
// 7.1. Ánh sáng môi trường
const light = new THREE.AmbientLight(0xffffff, 0); // soft white light
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

// 6.4. Ánh sáng mặt trời
const directionalLight = new THREE.DirectionalLight(0xffff99, 0); // Màu vàng
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -550;
directionalLight.shadow.camera.right = 550;
directionalLight.shadow.camera.top = 550;
directionalLight.shadow.camera.bottom = -550;
directionalLight.shadow.mapSize.width = 5000;
directionalLight.shadow.mapSize.height = 5000;
directionalLight.position.set(0, 1000, 0);
scene.add(directionalLight);

// 7. Vòng lặp Animate------------------------------------------------------------------------
let min = new THREE.Vector3(-150, 5, -100); // (1)
let max = new THREE.Vector3(400, 100, 80); // (2)

function animate() {
  controls.target.clamp(min, max); //(3)
  fly0Animation();
  fly1Animation();
  fly2Animation();
  fly3Animation();
  fly4Animation();
  controls.update();
  renderer.render(scene, camera);
}

// (1-3): Giới hạn chuyển động của camera

// 9. Other stuff ---------------------------------------------------------------------------
const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);
// Màu đỏ -> x; Màu xanh nước biển -> z; Màu xanh lá -> y
