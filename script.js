"use strict";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

console.clear();

(function () {
  const worldRadius = 5;
  const confettiSize = 0.07;
  const confettiNum = 3000;
  const rotateRange_x = Math.PI / 30;
  const rotateRange_y = Math.PI / 50;
  const speed_y = 0.01;
  const speed_x = 0.003;
  const speed_z = 0.005;

  let camera, scene, renderer, controls;
  let confettiMesh;
  const dummy = new THREE.Object3D();
  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();

  init();

  function init() {
    camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      1,
      worldRadius * 3
    );
    camera.position.z = worldRadius * Math.sqrt(2);

    scene = new THREE.Scene();

    function getRandomColor() {
      let saturation = 100;
      let lightness = 50;
      const colors = [
        "hsl(0, " + saturation + "%, " + lightness + "%)",
        "hsl(30, " + saturation + "%, " + lightness + "%)",
        "hsl(60, " + saturation + "%, " + lightness + "%)",
        "hsl(90, " + saturation + "%, " + lightness + "%)",
        "hsl(120, " + saturation + "%, " + lightness + "%)",
        "hsl(150, " + saturation + "%, " + lightness + "%)",
        "hsl(180, " + saturation + "%, " + lightness + "%)",
        "hsl(210, " + saturation + "%, " + lightness + "%)",
        "hsl(240, " + saturation + "%, " + lightness + "%)",
        "hsl(270, " + saturation + "%, " + lightness + "%)",
        "hsl(300, " + saturation + "%, " + lightness + "%)",
        "hsl(330, " + saturation + "%, " + lightness + "%)"
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    const confettiGeometry = new THREE.PlaneGeometry(
      confettiSize / 2,
      confettiSize
    );
    const confettiMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    confettiMesh = new THREE.InstancedMesh(
      confettiGeometry,
      confettiMaterial,
      confettiNum
    );

    for (let i = 0; i < confettiNum; i++) {
      matrix.makeRotationFromEuler(
        new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        )
      );
      matrix.setPosition(
        THREE.MathUtils.randFloat(-worldRadius, worldRadius),
        THREE.MathUtils.randFloat(-worldRadius, worldRadius),
        THREE.MathUtils.randFloat(-worldRadius, worldRadius)
      );
      confettiMesh.setMatrixAt(i, matrix);
      confettiMesh.setColorAt(i, color.set(getRandomColor()));
    }
    scene.add(confettiMesh);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = false;
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.y = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1;
    controls.maxDistance = worldRadius * Math.sqrt(2);
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();

    animate();

    window.addEventListener("resize", onWindowResize);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (confettiMesh) {
      for (let i = 0; i < confettiNum; i++) {
        confettiMesh.getMatrixAt(i, matrix);
        matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

        dummy.position.y -= speed_y * ((i % 4) + 1);

        if (dummy.position.y < -worldRadius) {
          dummy.position.y = worldRadius;
          dummy.position.x = THREE.MathUtils.randFloat(
            -worldRadius,
            worldRadius
          );
          dummy.position.z = THREE.MathUtils.randFloat(
            -worldRadius,
            worldRadius
          );
        } else {
          if (i % 4 == 1) {
            dummy.position.x += speed_x;
            dummy.position.z += speed_z;
          } else if (i % 4 == 2) {
            dummy.position.x += speed_x;
            dummy.position.z -= speed_z;
          } else if (i % 4 == 3) {
            dummy.position.x -= speed_x;
            dummy.position.z += speed_z;
          } else {
            dummy.position.x -= speed_x;
            dummy.position.z -= speed_z;
          }
        }

        dummy.rotation.x += THREE.MathUtils.randFloat(0, rotateRange_x);
        dummy.rotation.z += THREE.MathUtils.randFloat(0, rotateRange_y);

        dummy.updateMatrix();
        confettiMesh.setMatrixAt(i, dummy.matrix);
      }
      confettiMesh.instanceMatrix.needsUpdate = true;
    }
    renderer.render(scene, camera);
  }

  // Funcionalidad del botón y audio
  const playAudioButton = document.getElementById("playAudioButton");
  const birthdayAudio = document.getElementById("birthdayAudio");

  function playBirthdayAudio() {
    birthdayAudio.play();
  }

  playAudioButton.addEventListener("click", playBirthdayAudio);

  // Controlar el modal de la carta
  const openLetterButton = document.getElementById("openLetterButton");
  const letterModal = document.getElementById("letterModal");
  const closeModal = document.getElementById("closeModal");

  // Mostrar la carta
  openLetterButton.addEventListener("click", () => {
    letterModal.style.display = "block";
  });

  // Cerrar la carta
  closeModal.addEventListener("click", () => {
    letterModal.style.display = "none";
  });

  // Cerrar el modal si se hace clic fuera del contenido
  window.addEventListener("click", (event) => {
    if (event.target === letterModal) {
      letterModal.style.display = "none";
    }
  });

  document.querySelectorAll('.hello-kitty-header').forEach(img => {
    img.addEventListener('mouseover', () => {
      img.style.transform = 'scale(1.2)';
    });
    img.addEventListener('mouseout', () => {
      img.style.transform = 'scale(1)';
    });
  });
  

})();
