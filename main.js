import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  // 1. Khởi tạo Scene, Camera, Renderer---------------------------------------------------------------------------
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


  // 2. Camera---------------------------------------------------------------------------
  camera.position.set(5, 5, 5);



  // 3. Background setup---------------------------------------------------------------------------
  scene.background = new THREE.Color(0xffffff); // Background màu trắng
  const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Màu vàng
  scene.add(ambientLight);

 


  // 4. Objects (+ positioning, lighting) ---------------------------------------------------------
  const loader = new GLTFLoader();

  // 4.1. Căn phòng:---------------------------------------------------------------------------
  loader.load(
    "/model/room.glb",
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
    "/model/_sofa.glb",
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
    "/model/table.glb",
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
    "/model/pasta.glb",
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

  // 5. TV + Opption 1:---------------------------------------------------------------------------
  new GLTFLoader().load('model/tv.glb',
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


  // 5.1. Video và Texture---------------------------------------------------------------------------
  const video = document.getElementById('tv-video');
video.muted = false;
video.volume = 1.0;
video.pause();
video.currentTime = 0; // Đặt lại thời gian phát về đầu
const videoTexture = new THREE.VideoTexture(video);
const blackTexture = new THREE.TextureLoader().load('textures/black.png');
let tvScreenMesh = null;
let isTvOn = false;

  // 5.2. Đổi kênh---------------------------------------------------------------------------
  const channels = [
      './videos/channel1.mp4',
      './videos/channel2.mp4',
      './videos/channel3.mp4'
  ];
  let currentChannel = 0;
  function changeChannel() {
      if (isTvOn) {
          currentChannel = (currentChannel + 1) % channels.length;
          video.src = channels[currentChannel];
          video.play();
      }
  }


  // 5.3. Bật/Tắt màn hình TV và ánh sáng---------------------------------------------------------------------------
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

      console.log("TV is now", isTvOn ? "ON" : "OFF");
      console.log("SpotLight is now", isTvOn ? "ON" : "OFF");
  }
}


  // 5.4. Đảm bảo phát âm thanh sau tương tác---------------------------------------------------------------------------
  function enableAudioPlayback() {
  video.play().then(() => {
      console.log('Video playback started with sound');
  }).catch((error) => {
      console.error('Error enabling audio playback:', error);
  });
  // 5.5. Đảm bảo video không phát khi gắn vào texture---------------------------------------------------------------------------
  video.addEventListener('play', () => {
    if (!isTvOn) {
        video.pause(); // Dừng phát nếu TV chưa bật
    }
  });

  // 5.6. Xóa sự kiện sau khi kích hoạt âm thanh---------------------------------------------------------------------------
  window.removeEventListener('click', enableAudioPlayback);
  window.removeEventListener('keydown', enableAudioPlayback);
  }

  // 5.7. Gắn sự kiện phát âm thanh---------------------------------------------------------------------------
  window.addEventListener('click', enableAudioPlayback);
  window.addEventListener('keydown', enableAudioPlayback);

  // 5.8. Gắn sự kiện vào nút HTML---------------------------------------------------------------------------
  const button = document.getElementById('toggle-tv-and-spotlight');
  button.addEventListener('click', toggleTvAndSpotLight);



  // 5.9. Space để đổi kênh---------------------------------------------------------------------------
  window.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
          changeChannel();
      }
   });


  //6. Ánh sáng---------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Màu vàng
  scene.add(ambientLight);
  const pointLight1 = new THREE.PointLight( 0xFFFFFF, 10000, 1000 ); // Màu trắng
  pointLight1.position.set( -80, 225, 0 );
  scene.add( pointLight1 );
  const pointLight2 = new THREE.PointLight( 0xFFFFFF, 10000, 1000 ); // Màu trắng
  pointLight2.position.set( -10, 225, 0 );
  scene.add( pointLight2 );
  const pointLight3 = new THREE.PointLight( 0xFFFFFF, 10000, 1000 ); // Màu trắng
  pointLight3.position.set( -150, 225, 0 );
  scene.add( pointLight3 );
  const directionalLight = new THREE.DirectionalLight( 0xFFFF99, 1 ); // Màu vàng
  directionalLight.castShadow = true;
  directionalLight.position.set (10000, 10000, 10000);
  scene.add( directionalLight );
  const spotLight = new THREE.SpotLight( 0x99FFFF, 50000); // Màu xanh dương
  spotLight.position.set(-80, 125, 210);
  spotLight.angle = Math.PI / 6.25; // Góc rộng của ánh sáng
  spotLight.distance = 500;
  scene.add( spotLight );
  spotLight.intensity = 0;
  const targetObject = new THREE.Object3D(); // Hướng ánh sáng tới
  scene.add(targetObject);
  targetObject.position.set (-100, 50, -500);
  spotLight.target = targetObject;
  spotLight.target.updateMatrixWorld();

  // 7. Vòng lặp Animate------------------------------------------------------------------------
  function animate() {
    controls.update();
    renderer.render(scene, camera);
}


  // 8. Other stuff ---------------------------------------------------------------------------
  const axesHelper = new THREE.AxesHelper(500);
  scene.add(axesHelper);
