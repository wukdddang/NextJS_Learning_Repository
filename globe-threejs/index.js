import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

let earthMesh, lightsMesh, cloudsMesh, glowMesh, stars; // 전역 스코프 변수 선언

function loadTexture(loader, url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

function init() {
  const rotationSpeed = 0.002; // 회전 속도 조절

  const w = window.innerWidth;
  const h = window.innerHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(20, w / h, 0.1, 1000);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  document.body.appendChild(renderer.domElement);

  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
  earthGroup.position.x += 2;
  scene.add(earthGroup);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.rotateSpeed = 0.3;

  const detail = 12;
  const loader = new THREE.TextureLoader();

  Promise.all([
    loadTexture(loader, "/textures/8081_earthmap10k.jpg"),
    loadTexture(loader, "/textures/8081_earthspec10k.jpg"),
    loadTexture(loader, "/textures/8081_earthbump10k.jpg"),
    loadTexture(loader, "/textures/8081_earthlights10k.jpg"),
    loadTexture(loader, "/textures/04_earthcloudmap.jpg"),
    loadTexture(loader, "/textures/05_earthcloudmaptrans.jpg"),
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
      cloudsMesh.scale.setScalar(1.003);
      earthGroup.add(cloudsMesh);

      const fresnelMat = getFresnelMat();

      glowMesh = new THREE.Mesh(geometry, fresnelMat);
      glowMesh.scale.setScalar(1.0);
      earthGroup.add(glowMesh);

      stars = getStarfield({ numStars: 2000 });
      scene.add(stars);

      const sunLight = new THREE.DirectionalLight(0xffffff);
      sunLight.position.set(-100, 100, -130);
      scene.add(sunLight);

      // 모든 것이 로드된 후 animate 호출
      animate();
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

    // 지구 회전 조절
    // earthMesh.rotation.y += rotationSpeed;
    // lightsMesh.rotation.y += rotationSpeed;
    // cloudsMesh.rotation.y += rotationSpeed;
    // glowMesh.rotation.y += rotationSpeed;

    // 기타 애니메이션 코드
    // stars.rotation.y -= 0.0002;
    renderer.render(scene, camera);
  }

  function onEverythingLoaded() {
    const event = new Event("everythingLoaded");
    window.dispatchEvent(event);
    console.log("everything loaded");
    const canvas = document.getElementsByTagName("canvas")[0];
    if (canvas) {
      canvas.style.opacity = 1;
    }
  }
}

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

init();
