'use client';

// libraries
import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'motion/react';
// types
import type { WorkWithRelations } from '@kit/types';
// utils
import { getWorkDetail } from '~/utils/work-helpers';
// @saedgewell/components
import { NeonGradientCard } from '@kit/ui/neon-gradient-card';
import { ScrollTextAnimation } from '@kit/ui/scroll-text-animation';
// 固有コンポーネント
import { OrbitBackground } from './orbit-background';
import { AchievementBar } from './achievement-bar';
import { AchievementDetail } from './achievement-detail';
import { BackgroundImages } from './background-images';
import { CloseButton } from './close-button';

interface AchievementsProps {
  works: WorkWithRelations[];
}

/**
 * 実績セクションのメインコンポーネント
 *
 * このコンポーネントは以下の機能を提供します：
 * 1. スクロールベースのアニメーション制御
 *    - スクロール位置に応じた実績バーの表示/非表示
 *    - 背景画像のフェードイン/アウト
 *    - 実績バーのアクティブ状態の制御
 *
 * 2. インタラクティブな実績表示
 *    - クリックによる実績詳細の表示
 *    - スムーズなアニメーションによる状態遷移
 *    - レスポンシブな表示制御
 *
 * 3. 視覚的フィードバック
 *    - 軌道アニメーションによる装飾
 *    - ネオングラデーションカードによる表示枠
 *    - インジケーターによるアクティブ状態の表示
 *
 * @param works - 表示する実績データの配列
 */
export const Achievements = ({ works }: AchievementsProps) => {
  // スクロールアニメーションの設定値
  // これらの値はスクロール位置に応じたアニメーションのタイミングを制御します
  const FADE_IN_START = 0.15; // フェードイン開始位置（スクロール進捗の15%）
  const FADE_IN_COMPLETE = 0.25; // フェードイン完了位置（スクロール進捗の25%）
  const ANIMATION_START_OFFSET = 0.05; // アニメーション開始時のオフセット（スムーズな開始のため）
  const ANIMATION_DURATION = 0.6; // アニメーション期間（スクロール進捗の60%）
  const FADE_OUT_START = 0.85; // フェードアウト開始位置（スクロール進捗の85%）
  const FADE_OUT_COMPLETE = 0.95; // フェードアウト完了位置（スクロール進捗の95%）

  // コンポーネントの状態管理
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // 現在アクティブな実績のインデックス
  const [selectedWork, setSelectedWork] = useState<WorkWithRelations | null>(
    null
  ); // 選択された実績
  const [isExpanded, setIsExpanded] = useState(false); // 実績バーが拡大表示されているか
  const [isDetailVisible, setIsDetailVisible] = useState(false); // 詳細が表示されているか
  const [isTitleVisible, setIsTitleVisible] = useState(false); // タイトルが表示されているか
  const [isFullWidth, setIsFullWidth] = useState(false); // 全幅表示されているか

  // スクロール進捗の監視
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'], // コンテナの開始から終了までを監視
  });

  /**
   * アクティブなインデックスを計算
   * スクロール位置に応じて適切な実績をアクティブにします
   */
  const activeIndex = useTransform(scrollYProgress, (value) => {
    if (value < FADE_IN_COMPLETE) return -1;

    // 実際のスクロール位置を使用
    const scrollPosition = window.scrollY;
    const offsetTop = containerRef.current?.offsetTop ?? 0;
    const fadeInCompletePosition =
      (containerRef.current?.scrollHeight ?? 0) * FADE_IN_COMPLETE;
    const remainingHeight =
      (containerRef.current?.scrollHeight ?? 0) * ANIMATION_DURATION;
    const totalSections = works.length + 2;
    const sectionHeight = remainingHeight / totalSections;

    // オフセット位置を考慮した計算
    const adjustedPosition =
      scrollPosition - offsetTop - fadeInCompletePosition;
    const sectionIndex = Math.round(adjustedPosition / sectionHeight) - 1;

    return Math.min(Math.max(-1, sectionIndex), works.length);
  });

  // アクティブインデックスの変更を監視
  useMotionValueEvent(activeIndex, 'change', (latest) => {
    setCurrentIndex(latest);
  });

  // スクロール制御用の関数
  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
  };

  const enableScroll = () => {
    document.body.style.overflow = '';
    document.body.style.height = '';
  };

  // アニメーションの状態遷移を管理する関数
  const handleAnimationComplete = (definition: string) => {
    switch (definition) {
      case 'squareExpanded':
        setIsTitleVisible(true);
        break;
      case 'expanded':
        setTimeout(() => {
          setIsTitleVisible(true);
        }, 300);
        break;
      case 'titleVisible':
        setTimeout(() => {
          setIsFullWidth(true);
        }, 300);
        break;
      case 'fullWidth':
        setTimeout(() => {
          disableScroll();
          setIsDetailVisible(true);
        }, 200);
        break;
      default:
        break;
    }
  };

  /**
   * バーをクリックした時の処理
   * 1. 現在選択されているバーの場合は詳細表示を開始
   * 2. それ以外の場合は対応するセクションまでスクロール
   */
  const handleBarClick = (index: number) => {
    if (!containerRef.current) return;

    const containerHeight = containerRef.current.scrollHeight;
    const fadeInCompletePosition = containerHeight * FADE_IN_COMPLETE;
    const remainingHeight = containerHeight * ANIMATION_DURATION;
    const totalSections = works.length + 2;
    const sectionHeight = remainingHeight / totalSections;
    const targetScrollPosition =
      containerRef.current.offsetTop +
      fadeInCompletePosition +
      (index + 1) * sectionHeight;

    // 現在選択されているバーがクリックされた場合
    if (currentIndex === index) {
      setSelectedWork(works[index] ?? null);
      setIsExpanded(true);
      setIsTitleVisible(false);
      setIsFullWidth(false);
      setIsDetailVisible(false);
      return;
    }

    // スクロール処理
    window.scrollTo({
      top: targetScrollPosition,
      behavior: 'smooth',
    });
  };

  /**
   * 詳細表示を閉じる処理
   * すべての状態をリセットし、スクロールを再有効化します
   */
  const handleClose = () => {
    enableScroll();
    setIsDetailVisible(false);
    setIsTitleVisible(false);
    setIsFullWidth(false);
    setIsExpanded(false);
    setSelectedWork(null);
  };

  // アニメーション用のモーション値の設定
  const containerScrollProgress = useTransform(
    scrollYProgress,
    [FADE_IN_START, FADE_IN_COMPLETE, FADE_OUT_START, FADE_OUT_COMPLETE],
    [0, 1, 1, 0]
  );

  // 表示/非表示の状態管理
  const isVisible = useTransform(
    scrollYProgress,
    [0, FADE_IN_START, FADE_OUT_COMPLETE, 1],
    [false, true, true, false]
  );

  const [shouldRender, setShouldRender] = useState(false);

  useMotionValueEvent(isVisible, 'change', (latest) => {
    setShouldRender(latest);
  });

  // コンテナのアニメーション値の設定
  const containerScale = useTransform(
    containerScrollProgress,
    [0, 1],
    [0.8, 1]
  );
  const containerOpacity = useTransform(
    containerScrollProgress,
    [0, 1],
    [0, 1]
  );
  const containerZ = useTransform(containerScrollProgress, [0, 1], [-100, 0]);

  return (
    <section ref={containerRef} className="relative h-[1500vh]">
      {/* スクロールテキストアニメーション */}
      <div className="h-[400vh]">
        <ScrollTextAnimation
          text="実績の一部をご紹介します"
          initialFontSize={48}
        />
      </div>

      {/* 固定コンテナ */}
      <motion.div
        className="fixed inset-0 h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldRender ? 1 : 0 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          style={{
            scale: containerScale,
            opacity: containerOpacity,
            z: containerZ,
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
          className="w-full h-full"
        >
          {/* 軌道アニメーション */}
          <OrbitBackground />

          <NeonGradientCard className="relative w-[80%] h-[80%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* 閉じるボタン */}
            {isDetailVisible && <CloseButton onClose={handleClose} />}

            {/* 背景画像 */}
            <BackgroundImages
              works={works}
              currentIndex={currentIndex}
              isExpanded={isExpanded}
            />

            {/* バーコンテナ */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center z-20">
              <div className="flex gap-6">
                {works.map((work, index) => (
                  <AchievementBar
                    key={work.id}
                    work={work}
                    index={index}
                    currentIndex={currentIndex}
                    isExpanded={isExpanded}
                    isFullWidth={isFullWidth}
                    isTitleVisible={isTitleVisible}
                    onBarClick={handleBarClick}
                    onAnimationComplete={handleAnimationComplete}
                  />
                ))}
              </div>
            </div>

            {/* 詳細表示 */}
            {selectedWork && (
              <AchievementDetail
                work={selectedWork}
                isVisible={isDetailVisible}
              />
            )}
          </NeonGradientCard>
          <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs text-primary/50">
            表示されている実績をクリックすると詳細を見ることができます
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};
