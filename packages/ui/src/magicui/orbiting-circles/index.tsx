import { cn } from '../../lib/utils';
import React from 'react';

/**
 * 要素を円軌道上に配置し、回転アニメーションを適用するコンポーネント。
 * 子要素を等間隔で円軌道上に配置し、アニメーションさせることができます。
 *
 * @example
 * ```tsx
 * <OrbitingCircles radius={200} speed={1.5}>
 *   <div>要素1</div>
 *   <div>要素2</div>
 *   <div>要素3</div>
 * </OrbitingCircles>
 * ```
 */
export interface OrbitingCirclesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * カスタムスタイルを適用するためのCSSクラス名
   * @optional
   */
  className?: string;

  /**
   * 軌道上に配置する子要素
   * 各子要素は等間隔で円軌道上に配置されます
   * @optional
   */
  children?: React.ReactNode;

  /**
   * アニメーションの方向を反転させるかどうか
   * - true: 反時計回り
   * - false: 時計回り
   * @optional
   */
  reverse?: boolean;

  /**
   * アニメーションの基本継続時間（秒）
   * 実際の継続時間は speed パラメータによって調整されます
   * @default 20
   */
  duration?: number;

  /**
   * 円軌道の半径（ピクセル）
   * @default 160
   */
  radius?: number;

  /**
   * 軌道のパスを表示するかどうか
   * - true: 軌道を表示
   * - false: 軌道を非表示
   * @default true
   */
  path?: boolean;

  /**
   * 軌道上の各アイコン（子要素）のサイズ（ピクセル）
   * @default 30
   */
  iconSize?: number;

  /**
   * アニメーションの速度倍率
   * 値が大きいほど速く、小さいほど遅くなります
   * @default 1
   */
  speed?: number;
}

/**
 * 円軌道上でアニメーションする要素を生成するコンポーネント
 * @param props - OrbitingCirclesPropsインターフェースに定義されたプロパティ
 * @returns 円軌道アニメーションを適用した要素群
 */
export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
  ...props
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;

  return (
    <>
      {path && (
        <svg
          aria-label="Orbiting Circles"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-black/10 dark:stroke-white/10"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      {React.Children.map(children, (child, index) => {
        const angle = (360 / React.Children.count(children)) * index;

        return (
          <div
            style={
              {
                '--duration': calculatedDuration,
                '--radius': radius,
                '--angle': angle,
                '--icon-size': `${iconSize}px`,
              } as React.CSSProperties
            }
            className={cn(
              'absolute flex size-[var(--icon-size)] transform-gpu animate-orbit items-center justify-center rounded-full',
              { '[animation-direction:reverse]': reverse },
              className
            )}
            {...props}
          >
            {child}
          </div>
        );
      })}
    </>
  );
}
