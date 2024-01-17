"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import getStarfield from "@/utils/getStarfield";
import { getFresnelMat } from "@/utils/getFresnelMat";

const EarthGlobe = () => {
  const globeRef = useRef(null);

  useEffect(() => {
    // 기본 설정
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    const ambientLight = new THREE.AmbientLight(0x000000); // 더 어두운 색상으로 조정
    scene.add(ambientLight);
    const camera = new THREE.PerspectiveCamera(20, w / h, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);

    globeRef.current?.appendChild(renderer.domElement);

    // EarthGroup 및 컨트롤 설정
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
    earthGroup.position.x += 2;

    scene.add(earthGroup);
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.rotateSpeed = 0.3;

    // // 지구 및 기타 요소 추가
    const rotationSpeed = 0.002;
    const detail = 12;
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.IcosahedronGeometry(1, detail);
    const material = new THREE.MeshPhongMaterial({
      map: loader.load("/textures/earth-wallpaper.jpg"), // 경로는 실제 파일 위치에 맞게 조정
      specularMap: loader.load("/textures/02_earthspec1k.jpg"), // 경로는 실제 파일 위치에 맞게 조정
      bumpMap: loader.load("/textures/01_earthbump1k.jpg"), // 경로는 실제 파일 위치에 맞게 조정
      bumpScale: 0.4,
    });
    // material.specular = new THREE.Color(0x111111); // 더 어두운 색상으로 조정

    const earthMesh = new THREE.Mesh(geometry, material);
    earthMesh.scale.setScalar(1.0);
    earthGroup.add(earthMesh);

    // const lightsMat = new THREE.MeshBasicMaterial({
    //   map: loader.load("/textures/gpt-light.png"),
    //   blending: THREE.AdditiveBlending,
    // });
    // const lightsMesh = new THREE.Mesh(geometry, lightsMat);
    // earthGroup.add(lightsMesh);

    const cloudsMat = new THREE.MeshStandardMaterial({
      map: loader.load("/textures/gpt-cloud.png"),
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      alphaMap: loader.load("/textures/05_earthcloudmaptrans.jpg"),
      // alphaTest: 0.3,
    });
    const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
    cloudsMesh.scale.setScalar(1.0);
    earthGroup.add(cloudsMesh);

    const fresnelMat = getFresnelMat();
    const glowMesh = new THREE.Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(1.0);
    earthGroup.add(glowMesh);
    // 별들 추가
    const stars = getStarfield({ numStars: 2000 });
    scene.add(stars);

    // 태양 조명 추가
    const sunLight = new THREE.DirectionalLight(0xffffff);
    sunLight.position.set(100, 100, 2000);
    // sunLight.intensity = 10; // 예시로 강도를 줄임
    scene.add(sunLight);

    // // 애니메이션 함수
    const animate = () => {
      requestAnimationFrame(animate);

      // 지구 회전 조절 및 기타 애니메이션
      earthMesh.rotation.y += rotationSpeed;
      // lightsMesh.rotation.y += rotationSpeed;
      cloudsMesh.rotation.y += rotationSpeed;
      glowMesh.rotation.y += rotationSpeed;

      stars.rotation.y -= 0.0002;
      renderer.render(scene, camera);
    };

    animate();

    // 창 크기 조정 핸들러
    // const handleWindowResize = () => {
    //   camera.aspect = window.innerWidth / window.innerHeight;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(window.innerWidth, window.innerHeight);
    // };
    // window.addEventListener("resize", handleWindowResize, false);

    // 컴포넌트 정리 작업 (중요)
    return () => {
      // window.removeEventListener("resize", handleWindowResize);
      renderer.dispose();
      globeRef.current?.removeChild(renderer.domElement);
      // 필요한 경우 기타 정리 작업 추가
    };
  }, [globeRef]);

  return <div ref={globeRef} id="globe"></div>;
};

export default EarthGlobe;
