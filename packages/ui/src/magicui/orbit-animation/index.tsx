'use client';

import { motion, useAnimationFrame } from 'motion/react';
import { cn } from '../../lib/utils';
import { useState, useCallback, useEffect } from 'react';

interface OrbitAnimationProps {
  className?: string;
  radius?: number; // 円の半径（ピクセル）
  speed?: number; // 回転速度（ラジアン/フレーム）
}

/**
 * 円周上を点が回転するアニメーションコンポーネント
 * 三角関数を使用して点の位置を計算
 * 点のサイズを考慮して円の半径を調整し、常にコンテナ内に収まるようにする
 * @param className - 追加のスタイルクラス
 * @param radius - 円の半径（ピクセル）
 * @param speed - 回転速度（ラジアン/フレーム）
 */
export const OrbitAnimation = ({
  className,
  radius = 100,
  speed = 0.005,
}: OrbitAnimationProps) => {
  const [angle, setAngle] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [actualRadius, setActualRadius] = useState(0);

  // 点の数と角度の間隔を定義
  const POINT_COUNT = 6;
  const ANGLE_STEP = (2 * Math.PI) / POINT_COUNT;
  const POINT_SIZE = 12; // w-3 h-3 は12pxに相当

  // コンテナのサイズを監視
  useEffect(() => {
    const updateSize = () => {
      const container = document.querySelector('.orbit-container');
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        setContainerSize({ width, height });
        // 点のサイズの半分を考慮して実際の円の半径を計算
        setActualRadius(Math.min(width, height) / 2 - POINT_SIZE / 2);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 点の位置を計算する関数
  const calculatePosition = useCallback(
    (startAngle: number) => {
      // 実際の円の半径を使用して位置を計算
      const x = Math.cos(startAngle) * actualRadius;
      const y = Math.sin(startAngle) * actualRadius;
      return { x, y };
    },
    [actualRadius]
  );

  // アニメーションフレームごとに角度を更新
  useAnimationFrame(() => {
    setAngle((prev) => (prev + speed) % (2 * Math.PI));
  });

  // 全ての点の位置を計算
  const points = Array.from({ length: POINT_COUNT }, (_, index) => {
    const pointAngle = angle + index * ANGLE_STEP;
    return calculatePosition(pointAngle);
  });

  return (
    <div
      className={cn('relative w-full h-full orbit-container p-2', className)}
    >
      {/* デバッグ用の中心点 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute left-1/2 top-1/2 w-1 h-1 bg-red-500 z-50" />
      )}

      {/* 点を配置 */}
      {points.map((pos, index) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: 固定長の配列でインデックスキーは安全
          key={index}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px)`,
          }}
        >
          <motion.div
            className="w-3 h-3 rounded-full border-2"
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              transition: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: (index * 2) / POINT_COUNT,
              },
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};
