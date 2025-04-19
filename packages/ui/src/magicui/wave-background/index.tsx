'use client';

import React, { useRef } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'motion/react';

interface WaveBackgroundProps {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

/**
 * グラデーションウェーブの背景コンポーネント
 * - インタラクティブな波のアニメーション
 * - カスタマイズ可能なグラデーションカラー
 * - マウスインタラクション対応
 */
export function WaveBackground({
  className,
  primaryColor = 'rgba(56, 189, 248, 0.2)', // sky-400 with opacity
  secondaryColor = 'rgba(186, 230, 253, 0.1)', // sky-200 with opacity
}: WaveBackgroundProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const yOffset = 50;
  const amplitude = 15; // 振幅を小さく
  const frequency = 0.02; // 周波数を小さく

  // モーションの値
  const basePhase1 = useMotionValue(0);
  const basePhase2 = useMotionValue(2); // 位相をずらす
  const basePhase3 = useMotionValue(4); // 位相をずらす
  const mouseX = useMotionValue(0);

  // スムーズなアニメーション
  const smoothBasePhase1 = useSpring(basePhase1, {
    damping: 10,
    stiffness: 50,
  });
  const smoothBasePhase2 = useSpring(basePhase2, {
    damping: 10,
    stiffness: 50,
  });
  const smoothBasePhase3 = useSpring(basePhase3, {
    damping: 10,
    stiffness: 50,
  });
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 100 });

  // マウス位置の影響
  const mouseInfluence = useTransform(
    smoothMouseX,
    [0, 1],
    [-Math.PI / 4, Math.PI / 4] // マウスの影響を小さく
  );

  // 時間経過によるアニメーション
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      basePhase1.set(basePhase1.get() + 0.02); // 速度を遅く
      basePhase2.set(basePhase2.get() + 0.015); // 各層で速度を変える
      basePhase3.set(basePhase3.get() + 0.01);
    }, 20);
    return () => clearInterval(intervalId);
  }, [basePhase1, basePhase2, basePhase3]);

  // パスの生成
  const path = (
    phase: number,
    mouseInfluenceValue: number,
    yOffsetModifier = 0,
    amplitudeModifier = 1
  ) => {
    let str = `M 0 ${yOffset + yOffsetModifier} `;
    for (let i = 0; i <= 100; i++) {
      const x = i * 4;
      const mouseEffect =
        Math.max(0, 1 - Math.abs(x - mouseX.get() * 400) / 100) *
        mouseInfluenceValue;
      const y =
        yOffset +
        yOffsetModifier +
        amplitude *
          amplitudeModifier *
          Math.sin(i * frequency + phase + mouseEffect);
      str += `L ${x} ${y} `;
    }
    str += 'L 400 100 L 0 100 Z';
    return str;
  };

  // マウスの移動ハンドラー
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const bounds = svgRef.current.getBoundingClientRect();
    mouseX.set((event.clientX - bounds.left) / bounds.width);
  };

  return (
    <div className={className}>
      <svg
        aria-label="波のアニメーション背景"
        aria-hidden="true"
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
      >
        <defs>
          <linearGradient id="wave-gradient-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
          <linearGradient id="wave-gradient-3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>
        <motion.path
          d={useTransform(
            [smoothBasePhase1, mouseInfluence],
            (latest: number[]) => path(latest[0] ?? 0, latest[1] ?? 0, 0, 1)
          )}
          fill="url(#wave-gradient-1)"
          stroke="none"
        />
        <motion.path
          d={useTransform(
            [smoothBasePhase2, mouseInfluence],
            (latest: number[]) => path(latest[0] ?? 0, latest[1] ?? 0, 10, 0.8)
          )}
          fill="url(#wave-gradient-2)"
          stroke="none"
        />
        <motion.path
          d={useTransform(
            [smoothBasePhase3, mouseInfluence],
            (latest: number[]) => path(latest[0] ?? 0, latest[1] ?? 0, 20, 0.6)
          )}
          fill="url(#wave-gradient-3)"
          stroke="none"
        />
      </svg>
    </div>
  );
}
