/**
 * マウスの動きに応じてグラデーションエフェクトを表示するカードコンポーネント
 *
 * @example
 * ```tsx
 * // 基本的な使用方法
 * <MagicCard>
 *   <div className="p-6">
 *     <h3>カードのタイトル</h3>
 *     <p>カードの内容</p>
 *   </div>
 * </MagicCard>
 *
 * // カスタマイズ例
 * <MagicCard
 *   gradientSize={300}
 *   gradientColor="#333"
 *   gradientOpacity={0.7}
 *   gradientFrom="#FF0000"
 *   gradientTo="#00FF00"
 *   className="w-full h-64"
 * >
 *   <div className="p-6">
 *     <h3>カスタマイズされたカード</h3>
 *     <p>グラデーションの色やサイズをカスタマイズ</p>
 *   </div>
 * </MagicCard>
 * ```
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {React.ReactNode} props.children - カード内に表示するコンテンツ
 * @param {string} [props.className] - 追加のスタイリングクラス
 * @param {number} [props.gradientSize=200] - グラデーションの円の大きさ（ピクセル）
 * @param {string} [props.gradientColor="#262626"] - グラデーションのベースカラー
 * @param {number} [props.gradientOpacity=0.8] - グラデーションの不透明度（0-1）
 * @param {string} [props.gradientFrom="#D0A900"] - グラデーションの開始色
 * @param {string} [props.gradientTo="#FFF9E6"] - グラデーションの終了色
 *
 * @returns {JSX.Element} マウスインタラクションに反応するカードコンポーネント
 */

'use client';

import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { cn } from '../../lib/utils';

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = '#262626',
  gradientOpacity = 0.8,
  gradientFrom = '#D0A900',
  gradientTo = '#FFF9E6',
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (cardRef.current) {
        const { left, top } = cardRef.current.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
      }
    },
    [mouseX, mouseY]
  );

  const handleMouseOut = useCallback(
    (e: MouseEvent) => {
      if (!e.relatedTarget) {
        document.removeEventListener('mousemove', handleMouseMove);
        mouseX.set(-gradientSize);
        mouseY.set(-gradientSize);
      }
    },
    [handleMouseMove, mouseX, gradientSize, mouseY]
  );

  const handleMouseEnter = useCallback(() => {
    document.addEventListener('mousemove', handleMouseMove);
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [handleMouseMove, mouseX, gradientSize, mouseY]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [handleMouseEnter, handleMouseMove, handleMouseOut]);

  useEffect(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [gradientSize, mouseX, mouseY]);

  return (
    <div
      ref={cardRef}
      className={cn('group relative size-full flex  rounded-xl', className)}
    >
      <div className="absolute inset-px z-10 rounded-xl bg-background" />
      <div className="h-full flex flex-col justify-end z-30">{children}</div>
      <motion.div
        className="pointer-events-none absolute inset-px z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)
          `,
          opacity: gradientOpacity,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl bg-border duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientFrom}, 
              ${gradientTo}, 
              hsl(var(--border)) 100%
            )
          `,
        }}
      />
    </div>
  );
}
