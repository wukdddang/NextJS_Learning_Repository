import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

const body = document.querySelector("body");
body.style.margin = "0";
body.style.background = "#000000";

let renderer,
  earthMesh,
  lightsMesh,
  cloudsMesh,
  glowMesh,
  stars,
  camera,
  // satellite,
  satellite_2,
  isSatelliteLoaded = false,
  loader = new GLTFLoader(),
  scene;

function loadTexture(loader, url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

function loadSatelliteModel() {
  // console.log("loadSatelliteModel");
  // const loader = new GLTFLoader();
  loader.load(
    // "/International_Space_Station-OFFICIAL_NASA_MODEL.glb",
    "/Lumir-X Test-A.gltf",
    function (gltf) {
      satellite_2 = gltf.scene;
      // satellite_2.scale.setLength(0.1);

      // 현재 데이터는 0.02로 하면 지구랑 비슷한 크기
      // 뒤의 숫자는 지구 대비 크기 비율
      // const scale_st = 0.03 * 0.05;
      const scale_st = 0.03 * 1;
      satellite_2.scale.set(scale_st, scale_st, scale_st);
      satellite_2.position.set(10, 0, 0);

      const orbitRadius = 10; // 궤도의 반지름
      const initialAngleRadians = 20 * (Math.PI / 180); // 라디안으로 변환된 초기 각도
      satellite_2.position.x = orbitRadius * Math.cos(initialAngleRadians);
      satellite_2.position.z = orbitRadius * Math.sin(initialAngleRadians);

      satellite_2.traverse(function (object) {
        if (object.isMesh) {
          object.material.emissive = new THREE.Color(0x333333); // emissive 색상 설정
          object.material.emissiveIntensity = 0.8; // emissive 강도 조절
        }
      });

      scene.add(satellite_2);
      isSatelliteLoaded = true;
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

function updateSatellitePosition(sat) {
  // 인공위성의 위치를 갱신
  const orbitRadius = (6371 + 3000) / 6371; // 궤도의 반지름
  const orbitSpeed = 0.0; // 궤도의 속도. 원래값임.
  // const orbitSpeed = 0.001; // 궤도의 속도. 테스트용
  const angleRadians = orbitSpeed * Date.now(); // 라디안으로 변환된 초기 각도

  // 위성이 남북으로 이동하도록 Y와 Z 좌표 사용 (남북 궤도 시뮬레이션을 위해)
  sat.position.x = 1.0; // 남북 궤도에서 X 위치는 고정
  sat.position.y = orbitRadius * Math.sin(angleRadians) + 0.3; // 수직 이동을 위해 sin 사용
  sat.position.z = orbitRadius * Math.cos(angleRadians) + 0.1; // 궤도를 위해 cos 사용

  //sat.rotation.y += 0.01;
  sat.rotation.x = angleRadians;
  // console.log(sat.position);
  // 위성의 회전
  sat.rotation.x = -1.7; // X축을 중심으로 회전
  sat.rotation.y = 3; // Y축을 중심으로 회전
  sat.rotation.z = 0; // Z축을 중심으로 회전
}

function init() {
  const rotationSpeed = 0.0005; // 회전 속도 조절

  const w = window.innerWidth;
  const h = window.innerHeight;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.x = 2.763913389840482;
  camera.position.y = 0.5605380308886303;
  camera.position.z = 1.0230248723213076;

  scene.add(camera);

  // camera.position.z = 3;
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  document.body.appendChild(renderer.domElement);

  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
  earthGroup.position.x += 1;
  scene.add(earthGroup);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.rotateSpeed = 0.3;

  const detail = 12;
  const loader = new THREE.TextureLoader();

  Promise.all([
    loadTexture(loader, "/textures/00_earthmap1k.jpg"),
    loadTexture(loader, "/textures/02_earthspec1k.jpg"),
    loadTexture(loader, "/textures/01_earthbump1k.jpg"),
    loadTexture(loader, "/textures/03_earthlights1k.jpg"),
    // loadTexture(loader, "/textures/8081_earthmap10k.jpg"),
    // loadTexture(loader, "/textures/8081_earthspec10k.jpg"),
    // loadTexture(loader, "/textures/8081_earthbump10k.jpg"),
    // loadTexture(loader, "/textures/8081_earthlights10k.jpg"),
    loadTexture(loader, "/textures/04_earthcloudmap.jpg"),
    loadTexture(loader, "/textures/05_earthcloudmaptrans_new.jpg"),
    // 다른 텍스처 로드 프로미스 추가...
  ]).then(
    ([earthMap, earthSpec, earthBump, earthLights, cloudMap, cloudTrans]) => {
      const geometry = new THREE.IcosahedronGeometry(1, detail);

      const material = new THREE.MeshPhongMaterial({
        map: earthMap,
        specularMap: earthSpec,
        bumpMap: earthBump,
        bumpScale: 0.04,
      });
      earthMesh = new THREE.Mesh(geometry, material);
      earthGroup.add(earthMesh);

      const lightsMat = new THREE.MeshBasicMaterial({
        map: earthLights,
        blending: THREE.AdditiveBlending,
      });
      lightsMesh = new THREE.Mesh(geometry, lightsMat);
      earthGroup.add(lightsMesh);

      const cloudsMat = new THREE.MeshStandardMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        alphaMap: cloudTrans,
      });
      cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
      cloudsMesh.scale.setScalar(1);
      cloudsMesh.opacity = 0.8;
      earthGroup.add(cloudsMesh);

      const fresnelMat = getFresnelMat();

      glowMesh = new THREE.Mesh(geometry, fresnelMat);
      glowMesh.scale.setScalar(1.0);
      earthGroup.add(glowMesh);

      stars = getStarfield({ numStars: 20000 });
      scene.add(stars);

      // satellite = createSatellite();
      satellite_2 = loadSatelliteModel();
      // scene.add(satellite);

      const sunLight = new THREE.DirectionalLight(0xffffff);
      sunLight.position.set(-100, 100, 100);
      scene.add(sunLight);

      // // ! 곡선 추가
      // var ellipse = new THREE.EllipseCurve(
      //   0,
      //   0, // ax, aY
      //   1.2,
      //   1.2, // xRadius, yRadius
      //   0,
      //   2 * Math.PI, // aStartAngle, aEndAngle
      //   false, // aClockwise
      //   0,
      //   70
      //   // aRotation
      // );

      // var points = ellipse.getPoints(100); // 100개의 점으로 구성된 궤도

      // var matrix = new THREE.Matrix4();
      // var angle = Math.PI / 2; // 45도 기울임
      // matrix.makeRotationX(angle);

      // var rotatedPoints = points.map((p) => {
      //   var vec3 = new THREE.Vector3(p.x, p.y, 0);
      //   return vec3.applyMatrix4(matrix);
      // });

      // var curveGeometry = new THREE.BufferGeometry().setFromPoints(
      //   rotatedPoints
      // );
      // var curveMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
      // var ellipseCurve = new THREE.Line(curveGeometry, curveMaterial);
      // scene.add(ellipseCurve);

      // 모든 것이 로드된 후 animate 호출

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = true;
      controls.enablePan = true;
      controls.enableDamping = true;
      controls.rotateSpeed = 0.3;

      // Add this event listener
      // controls.addEventListener("change", () => {
      //   console.log("Camera Position:", camera.position);
      //   console.log("Camera Rotation:", camera.rotation);
      // });

      animate();
      const canvas = document.getElementsByTagName("canvas")[0];
      if (canvas) {
        canvas.style.transition = "opacity 1s";
        canvas.style.opacity = "0";
        canvas.style.display = "none";
      }
      onEverythingLoaded();
    }
  );

  function animate() {
    requestAnimationFrame(animate);

    if (earthMesh) {
      earthMesh.rotation.y += rotationSpeed;
    }

    if (lightsMesh) {
      lightsMesh.rotation.y += rotationSpeed;
    }

    if (cloudsMesh) {
      cloudsMesh.rotation.y += rotationSpeed;
    }

    if (glowMesh) {
      glowMesh.rotation.y += rotationSpeed;
    }

    if (stars) {
      stars.rotation.y -= 0.0002;
    }

    if (isSatelliteLoaded) {
      updateSatellitePosition(satellite_2);
    }
    // console.log("animate");

    renderer.render(scene, camera);
  }

  function onEverythingLoaded() {
    const event = new Event("everythingLoaded");
    window.dispatchEvent(event);

    console.log("everything loaded");
    // const canvas = document.getElementsByTagName("canvas")[0];
    // if (canvas) {
    //   canvas.style.transition = "opacity 1s";
    //   canvas.style.display = "none";
    //   // canvas.style.opacity = 0;
    //   // canvas.style.opacity = 1;
    // }
  }
}

// window.addEventListener("everythingLoaded", () => {
//   const canvas = document.getElementsByTagName("canvas")[0];
//   if (canvas) {
//     canvas.style.opacity = 1;
//   }
// });

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

init();
