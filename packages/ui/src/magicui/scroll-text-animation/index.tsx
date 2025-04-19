'use client';

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'motion/react';
import { useRef, useState, useEffect } from 'react';

interface ScrollTextAnimationProps {
  text: string;
  className?: string;
  initialFontSize?: number; // 初期フォントサイズ（px）
  onAnimationComplete?: () => void;
}

/**
 * イージング関数：前半は緩やかに、後半は急激に値が変化する
 * @param x - 0から1の間の進行度
 */
const easeInExpo = (x: number): number => {
  return x === 0 ? 0 : 2 ** (10 * x - 10);
};

// フリップアニメーションのバリアント
const flipVariants = {
  hidden: { rotateX: 90, opacity: 0 },
  visible: { rotateX: 0, opacity: 1 },
  exit: { rotateX: -90, opacity: 0 },
};

/**
 * 文字が日本語かどうかを判定
 */
const isJapanese = (char: string): boolean => {
  return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(
    char
  );
};

/**
 * スクロールに応じてテキストが拡大し、3D効果で奥に吸い込まれていくようなアニメーションを実現するコンポーネント
 * SVGテキストを使用することで、拡大時もクリアな表示を維持
 * @param text - アニメーションするテキスト
 * @param className - 追加のスタイルクラス
 * @param initialFontSize - 初期フォントサイズ（px）
 * @param onAnimationComplete - アニメーション完了時のコールバック
 */
export const ScrollTextAnimation = ({
  text,
  className,
  initialFontSize = 48, // デフォルト値を48pxに設定
  onAnimationComplete,
}: ScrollTextAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  // スクロール方向の検知
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Intersection Observerの設定
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !shouldAnimate) {
          setShouldAnimate(true);
        }
        setIsInView(entry?.isIntersecting || false);
      },
      {
        threshold: [0, 0.1, 0.9, 1], // より細かい検知のために閾値を追加
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [shouldAnimate]);

  // スクロール進捗を取得（セクション全体の高さに対する進捗を計測）
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // アニメーションフェーズを制御するための変換関数
  const phase = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.3, 0.95], // スクロール進捗の閾値
    [0, 1, 1, 2, 3] // 各フェーズの値（0: 初期状態, 1: フェードイン完了, 2: 待機状態, 3: 拡大アニメーション）
  );

  // イージング関数を適用したスケール値を計算
  const scale = useTransform(
    scrollYProgress,
    [0.3, 0.7, 0.9], // スクロール進捗の閾値を調整
    [1, 1.2, 1.2], // 通常サイズ → 1.5倍 → 2倍 → 0.5倍に縮小
    {
      ease: easeInExpo,
    }
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.6, 0.8, 0.9],
    [0, 0.5, 1, 1, 0.5, 0], // フェードインしてから、縮小と共にフェードアウト
    {
      ease: easeInExpo,
    }
  );

  // const y = useTransform(
  // 	scrollYProgress,
  // 	[0.3, 0.5, 0.7, 0.9],
  // 	[0, -30, -50, -100], // 上方向への移動を調整
  // 	{
  // 		ease: easeInExpo,
  // 	},
  // );

  // フェーズに基づいてスケールを適用
  const finalScale = useTransform(phase, (currentPhase) => {
    return currentPhase >= 2 ? scale.get() : 1;
  });

  // アニメーション完了の監視
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest >= 1 && onAnimationComplete) {
        onAnimationComplete();
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, onAnimationComplete]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
    >
      {isInView && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-full max-w-4xl px-4"
            style={{
              scale: finalScale,
              opacity,
              // y,
            }}
          >
            <svg
              className={`w-full h-auto ${className ?? ''}`}
              viewBox="-50 -20 600 140"
              preserveAspectRatio="xMidYMid meet"
              aria-label={`Animated text: ${text}`}
              role="img"
            >
              <defs>
                <style type="text/css">
                  {`
										@font-face {
											font-family: 'SVGFont';
											src: local('Inter');
										}
									`}
                </style>
              </defs>
              <AnimatePresence mode="wait">
                <motion.text
                  key={`text-${shouldAnimate}`}
                  x="250"
                  y="50"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="currentColor"
                  style={{
                    fontFamily: 'SVGFont, Inter, sans-serif',
                    fontSize: `${initialFontSize}px`,
                    fontWeight: 'bold',
                  }}
                >
                  {text.split('').map((char, i) => (
                    <motion.tspan
                      key={`${char}-${i}-${shouldAnimate}`}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={flipVariants}
                      transition={{
                        duration: 0.5,
                        delay: shouldAnimate ? i * 0.08 : 0,
                      }}
                      dx={i === 0 ? 0 : isJapanese(char) ? '-0.05em' : '0em'}
                      style={{
                        transformOrigin: 'center center',
                      }}
                    >
                      {char}
                    </motion.tspan>
                  ))}
                </motion.text>
              </AnimatePresence>
            </svg>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ScrollTextAnimation;
