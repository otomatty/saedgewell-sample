'use client';

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'motion/react';
import { useRef, useState, useEffect } from 'react';

interface ScrollFadeTextProps {
  text: string;
  className?: string;
  fontSize?: number; // フォントサイズ（px）
  onAnimationComplete?: () => void;
}

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
 * スクロールに応じてテキストがフェードイン/アウトするアニメーションを実現するコンポーネント
 * SVGテキストを使用することで、高品質な表示を維持
 * @param text - アニメーションするテキスト（\nで改行可能）
 * @param className - 追加のスタイルクラス
 * @param fontSize - フォントサイズ（px）
 * @param onAnimationComplete - アニメーション完了時のコールバック
 */
export const ScrollFadeText = ({
  text,
  className,
  fontSize = 32,
  onAnimationComplete,
}: ScrollFadeTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // テキストを行ごとに分割
  const lines = text.split('\n');
  // 行数に応じてビューボックスの高さを調整
  const viewBoxHeight = 140 + (lines.length - 1) * fontSize;

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
    offset: ['start start', 'end end'], // セクション全体の開始から終了までを計測
  });

  // 不透明度のアニメーション
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.4, 0.6, 0.9, 1],
    [0, 1, 1, 1, 1, 0],
    {
      ease: (t) => t, // リニアなイージング
    }
  );

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
            className="w-full px-4"
            style={{
              opacity,
            }}
          >
            <svg
              className={`w-full h-auto ${className ?? ''}`}
              viewBox={`-50 -20 600 ${viewBoxHeight}`}
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
                {lines.map((line, lineIndex) => (
                  <motion.text
                    key={`text-${lineIndex}-${shouldAnimate}`}
                    x="250"
                    y={50 + lineIndex * fontSize * 1.2} // 行間を1.2倍に設定
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="currentColor"
                    style={{
                      fontFamily: 'SVGFont, Inter, sans-serif',
                      fontSize: `${fontSize}px`,
                      fontWeight: 'bold',
                    }}
                  >
                    {line.split('').map((char, i) => (
                      <motion.tspan
                        key={`${char}-${lineIndex}-${i}-${shouldAnimate}`}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={flipVariants}
                        transition={{
                          duration: 0.5,
                          delay: shouldAnimate
                            ? (lineIndex * line.length + i) * 0.08
                            : 0,
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
                ))}
              </AnimatePresence>
            </svg>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ScrollFadeText;
