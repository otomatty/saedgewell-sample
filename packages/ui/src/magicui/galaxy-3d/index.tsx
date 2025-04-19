'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

interface Galaxy3DProps {
  className?: string;
}

export const Galaxy3D: React.FC<Galaxy3DProps> = ({ className }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;

    // シーンのセットアップ
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    // カラーテーマに応じた色の設定
    const colors = {
      light: {
        inside: new THREE.Color('#2a3f65'), // 濃い青
        outside: new THREE.Color('#6b88b5'), // 薄い青
      },
      dark: {
        inside: new THREE.Color('#ff6030'), // オレンジ
        outside: new THREE.Color('#1e90ff'), // 明るい青
      },
    };

    // パラメータ
    const parameters = {
      count: 50000, // 粒子数
      size: 0.1, // パーティクルサイズ
      radius: 5, // 銀河の半径
      branches: 2, // 腕の数(普通2本なので　固定)
      spin: 1, // 全体の回転速度（一定）
      randomness: 0.2, // ランダム性(0~1)
      randomnessPower: 2, // ランダム性の強さ
      insideColor:
        resolvedTheme === 'dark' ? colors.dark.inside : colors.light.inside,
      outsideColor:
        resolvedTheme === 'dark' ? colors.dark.outside : colors.light.outside,
    };

    // レンダラーの設定
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // カメラの位置設定
    camera.position.set(1, 1, 2); // より高い位置から斜めに見下ろす
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    // ジオメトリの生成
    const generateGalaxy = () => {
      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);
      const scales = new Float32Array(parameters.count);
      const randomness = new Float32Array(parameters.count * 3);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // 位置
        const radius = Math.random() * parameters.radius;
        const branchAngle =
          ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        // 30秒後の位置を初期位置として計算
        const initialTime = 30; // 30秒後の状態
        const rotationSpeed = 0.1; // シェーダーのrotationSpeedと同じ値
        const initialRotation =
          (1.0 / (radius + 1.0)) * initialTime * rotationSpeed;

        // 回転角度を半径に依存させて、初期状態で渦を形成
        const spinAngle =
          parameters.spin * (radius / parameters.radius) + initialRotation;

        // XZ平面（水平面）でのランダム性を大きく、Y方向（垂直方向）を抑える
        const horizontalRandomness = parameters.randomness;
        const verticalRandomness = parameters.randomness * 0.6; // 垂直方向の散らばりを60%に抑制

        const randomX =
          Math.random() ** parameters.randomnessPower *
          (Math.random() < 0.5 ? 1 : -1) *
          horizontalRandomness *
          radius;
        const randomY =
          Math.random() ** parameters.randomnessPower *
          (Math.random() < 0.5 ? 1 : -1) *
          verticalRandomness *
          radius;
        const randomZ =
          Math.random() ** parameters.randomnessPower *
          (Math.random() < 0.5 ? 1 : -1) *
          horizontalRandomness *
          radius;

        // 基本位置の計算（XZ平面上での円形の軌道）
        const baseX = Math.cos(branchAngle + spinAngle) * radius;
        const baseZ = Math.sin(branchAngle + spinAngle) * radius;

        // ランダム性を加えた最終位置
        positions[i3] = baseX + randomX;
        positions[i3 + 1] = randomY; // Y方向は直接ランダム値を使用
        positions[i3 + 2] = baseZ + randomZ;

        randomness[i3] = randomX;
        randomness[i3 + 1] = randomY;
        randomness[i3 + 2] = randomZ;

        // 色
        const mixedColor = parameters.insideColor.clone();
        mixedColor.lerp(parameters.outsideColor, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        // スケール（サイズをより大きくするため、乱数の範囲を調整）
        scales[i] = Math.random() * 1.8 + 0.2; // 0.2 ~ 2の範囲に
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
      geometry.setAttribute(
        'aRandomness',
        new THREE.BufferAttribute(randomness, 3)
      );

      // シェーダーマテリアル
      const material = new THREE.ShaderMaterial({
        vertexShader: `
          uniform float uTime;
          uniform float uSize;
          
          attribute float aScale;
          attribute vec3 aRandomness;
          
          varying vec3 vColor;
          
          void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            // 回転アニメーション
            float angle = atan(modelPosition.x, modelPosition.z);
            float distanceToCenter = length(modelPosition.xz);
            float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
            
            angle += angleOffset;
            modelPosition.x = cos(angle) * distanceToCenter;
            modelPosition.z = sin(angle) * distanceToCenter;

            modelPosition.xyz += aRandomness;

            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;

            gl_PointSize = uSize * aScale;
            gl_PointSize *= (1.0 / - viewPosition.z);

            vColor = color;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;

          void main() {
            float strength = distance(gl_PointCoord, vec2(0.5));
            strength = 1.0 - strength;
            strength = pow(strength, 10.0);

            vec3 finalColor = mix(vec3(0.0), vColor, strength);
            gl_FragColor = vec4(finalColor, strength);
          }
        `,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 45 * renderer.getPixelRatio() }, // 基本サイズを大きく
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true,
      });

      return new THREE.Points(geometry, material);
    };

    const galaxy = generateGalaxy();
    scene.add(galaxy);

    // マウス操作の設定
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;

      targetRotationX = y * 0.3;
      targetRotationY = x * 0.3;
    };

    // カメラの曲線パスを計算する関数
    const calculateCameraPath = (progress: number) => {
      const angle = progress * Math.PI; // 0からπまでの角度

      // 開始位置と終了位置
      const startPos = { x: 1, y: 1, z: 2 };
      const endPos = { x: 0, y: 0, z: 0 };

      // 曲線の振幅
      const amplitude = 1.0;

      // サイクロイド風の曲線を計算
      // X軸: 徐々に内側に
      const x =
        startPos.x - ((startPos.x - endPos.x) * (1 - Math.cos(angle))) / 2;

      // Y軸: 下降カーブ（上昇を防ぐため sin の代わりに 1 - cos を使用）
      const y =
        startPos.y -
        ((startPos.y - endPos.y) * (1 - Math.cos(angle))) / 2 -
        amplitude * Math.sin(angle / 2) * (1 - progress);

      // Z軸: 滑らかに接近
      const z =
        startPos.z - ((startPos.z - endPos.z) * (1 - Math.cos(angle))) / 2;

      return { x, y, z };
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollY / maxScroll;

      // より緩やかなイージング関数を使用
      const easeOutCubic = (x: number): number => {
        return 1 - (1 - x) ** 3;
      };

      const easedProgress = easeOutCubic(Math.min(scrollProgress, 1));

      // 新しい曲線パスに基づいてカメラ位置を更新
      const newCameraPos = calculateCameraPath(easedProgress);

      camera.position.x = newCameraPos.x;
      camera.position.y = newCameraPos.y;
      camera.position.z = newCameraPos.z;

      // スクロールの進行に応じてパーティクルの大きさと輝度を調整
      const startSize = 45;
      const endSize = 15; // 終了時のサイズを大きめに

      const material = galaxy.material as THREE.ShaderMaterial;
      if (material.uniforms?.uSize && material.uniforms?.uTime) {
        material.uniforms.uSize.value =
          (startSize - (startSize - endSize) * easedProgress) *
          renderer.getPixelRatio();

        // 銀河の回転速度を調整（より緩やかに）
        material.uniforms.uTime.value *= 1 - easedProgress * 0.3;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // アニメーション
    const clock = new THREE.Clock();
    clock.start();
    clock.elapsedTime = 30; // 初期時間を10秒に設定

    const animate = () => {
      if (!isAnimating) return;

      const elapsedTime = clock.getElapsedTime();

      // カメラの回転アニメーション
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      // マウス操作による位置の更新を一時的にコメントアウト
      // camera.position.y = 2 + currentRotationX;
      // camera.position.x = currentRotationY * 3;

      camera.lookAt(scene.position);

      // 銀河の回転
      const material = galaxy.material as THREE.ShaderMaterial;
      if (material.uniforms?.uTime) {
        material.uniforms.uTime.value = elapsedTime;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    // リサイズ対応
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const material = galaxy.material as THREE.ShaderMaterial;
      if (material.uniforms?.uSize) {
        material.uniforms.uSize.value = 45 * renderer.getPixelRatio();
      }
    };

    window.addEventListener('resize', handleResize);
    animate();

    // クリーンアップ
    return () => {
      setIsAnimating(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }

      galaxy.geometry.dispose();
      galaxy.material.dispose();
      renderer.dispose();
    };
  }, [isAnimating, resolvedTheme]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-screen ${className || ''}`}
      style={{ position: 'relative' }}
    />
  );
};
