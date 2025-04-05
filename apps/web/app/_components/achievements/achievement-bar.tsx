import { motion } from 'motion/react';
import Image from 'next/image';
import type { WorkWithRelations } from '@kit/types';
import { AnimatedIndicator } from './animated-indicator';
import { useAchievementBarAnimation } from '~/hooks/useAchievementBarAnimation';

interface AchievementBarProps {
  work: WorkWithRelations; // 表示する実績データ
  index: number; // 実績のインデックス
  currentIndex: number; // 現在アクティブな実績のインデックス
  isExpanded: boolean; // 拡大表示されているか
  isFullWidth: boolean; // 全幅表示されているか
  isTitleVisible: boolean; // タイトルが表示されているか
  onBarClick: (index: number) => void; // クリック時のコールバック
  onAnimationComplete: (definition: string) => void; // アニメーション完了時のコールバック
}

/**
 * 実績バーコンポーネント
 *
 * このコンポーネントは以下の機能を提供します：
 * 1. 実績の視覚的表現
 *    - 通常時は縦長のバーとして表示
 *    - アクティブ時は若干上に浮き上がる
 *    - 拡大時は正方形または全幅に展開
 *
 * 2. インタラクティブな状態遷移
 *    - クリックによる状態変更
 *    - スムーズなアニメーション
 *    - 段階的な表示の変化
 *
 * 3. 視覚的フィードバック
 *    - ホバー時の効果
 *    - アクティブ状態のインジケーター
 *    - タイトルの表示制御
 *
 * @param props - コンポーネントのプロパティ
 * @param props.work - 表示する実績データ
 * @param props.index - 実績のインデックス
 * @param props.currentIndex - 現在アクティブな実績のインデックス
 * @param props.isExpanded - 拡大表示されているか
 * @param props.isFullWidth - 全幅表示されているか
 * @param props.isTitleVisible - タイトルが表示されているか
 * @param props.onBarClick - クリック時のコールバック
 * @param props.onAnimationComplete - アニメーション完了時のコールバック
 */
export const AchievementBar = ({
  work,
  index,
  currentIndex,
  isExpanded,
  isFullWidth,
  isTitleVisible,
  onBarClick,
  onAnimationComplete,
}: AchievementBarProps) => {
  // アニメーション設定を取得
  const {
    barVariants, // バーのアニメーションバリアント
    titleVariants, // タイトルのアニメーションバリアント
    filterVariants, // フィルターのアニメーションバリアント
    calculateSquareSize, // 正方形サイズの計算関数
    transition, // 共通のトランジション設定
  } = useAchievementBarAnimation();

  return (
    <motion.div
      className={`relative cursor-pointer group ${
        isExpanded && currentIndex !== index ? 'hidden' : ''
      }`}
      animate={
        isExpanded && currentIndex === index
          ? isFullWidth
            ? 'fullWidth'
            : isTitleVisible
              ? 'fullWidth'
              : 'expanded'
          : currentIndex === index
            ? 'active'
            : 'default'
      }
      variants={barVariants}
      onClick={() => onBarClick(index)}
      onAnimationComplete={onAnimationComplete}
      style={{
        maxWidth: isExpanded ? '100%' : 'auto',
        maxHeight:
          isExpanded && !isFullWidth
            ? `${calculateSquareSize()}px`
            : isFullWidth
              ? '200px'
              : '40vh',
        position: 'relative',
        zIndex: isFullWidth ? 30 : 20,
      }}
    >
      {/* タイトル - 通常時は上部に表示 */}
      <motion.div
        className={`absolute w-60 -left-[100px] text-center text-xs text-primary-foreground dark:text-primary font-medium whitespace-nowrap overflow-hidden text-ellipsis ${
          isExpanded && currentIndex === index ? 'hidden' : '-top-7'
        }`}
        animate={currentIndex === index && !isExpanded ? 'visible' : 'hidden'}
        variants={titleVariants}
        initial="hidden"
      >
        {work.title}
      </motion.div>

      {/* バー本体 - 背景画像とオーバーレイを含む */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        {/* バーの背景画像 */}
        <Image
          src={work.thumbnail_url || ''}
          alt=""
          fill
          sizes={
            isExpanded && currentIndex === index
              ? '(max-width: 768px) 100vw, 80vw'
              : '10vw'
          }
          className={`object-cover transition-all duration-500 ${
            isExpanded && currentIndex === index
              ? 'object-contain'
              : 'object-cover'
          }`}
          quality={isExpanded && currentIndex === index ? 100 : 90}
          priority={index === 0 || (isExpanded && currentIndex === index)}
        />
        {/* フィルターオーバーレイ - 全体効果 */}
        {isExpanded && currentIndex === index && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            variants={filterVariants}
            initial="hidden"
            animate="visible"
          >
            {/* ベースのオーバーレイ */}
            <div className="absolute inset-0 bg-background/20" />

            {/* グラデーション効果 */}
            <div className="absolute inset-0 bg-linear-to-t from-background/40 via-background/20 to-background/20" />
          </motion.div>
        )}
        {/* 拡大時のタイトル - 下部に大きく表示 */}
        {isExpanded && currentIndex === index && (
          <div className="absolute bottom-8 left-4 right-4 z-20">
            <motion.h3
              className="text-3xl font-bold text-primary mb-2"
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              {work.title}
            </motion.h3>
            <motion.p
              className="text-sm text-primary/80"
              variants={{
                ...titleVariants,
                visible: {
                  ...titleVariants.visible,
                  transition: {
                    ...titleVariants.visible.transition,
                    delay: 0.3,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              {work.description}
            </motion.p>
          </div>
        )}
      </div>

      {/* アクティブインジケーター - 通常時のみ表示 */}
      {!isExpanded && <AnimatedIndicator isActive={currentIndex === index} />}
    </motion.div>
  );
};
