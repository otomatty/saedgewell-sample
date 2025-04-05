import { motion } from 'motion/react';
import Image from 'next/image';
import type { WorkWithRelations } from '@kit/types';

interface BackgroundImagesProps {
  works: WorkWithRelations[]; // 表示する実績データの配列
  currentIndex: number; // 現在アクティブな実績のインデックス
  isExpanded: boolean; // 拡大表示されているか
}

/**
 * 実績の背景画像を表示・管理するコンポーネント
 *
 * このコンポーネントは以下の機能を提供します：
 * 1. 背景画像の表示
 *    - 実績ごとの画像切り替え
 *    - 最適な画質とサイズの制御
 *    - プリオリティローディング
 *
 * 2. アニメーション効果
 *    - スムーズな画像切り替え
 *    - ブラーエフェクト
 *    - スケールアニメーション
 *
 * 3. パフォーマンス最適化
 *    - 画像の遅延読み込み
 *    - 適切なサイズ指定
 *    - 画質の動的調整
 *
 * 4. 視覚効果
 *    - オーバーレイフィルター
 *    - ダークモード対応
 *    - 角丸処理
 *
 * @param props - コンポーネントのプロパティ
 * @param props.works - 表示する実績データの配列
 * @param props.currentIndex - 現在アクティブな実績のインデックス
 * @param props.isExpanded - 拡大表示されているか
 */
export const BackgroundImages = ({
  works,
  currentIndex,
  isExpanded,
}: BackgroundImagesProps) => {
  // 共通のトランジション設定
  const transition = {
    duration: 0.5,
    ease: [0.32, 0.72, 0, 1], // カスタムイージング関数
  };

  return (
    <div className="absolute inset-0 w-full h-full rounded-lg">
      {works.map((work, index) => (
        <motion.div
          key={work.id}
          className="absolute inset-0 w-full h-full rounded-lg"
          animate={currentIndex === index ? 'active' : 'inactive'}
          variants={{
            active: {
              opacity: 1,
              scale: 1,
              filter: isExpanded ? 'blur(4px)' : 'blur(0px)',
              transition: {
                ...transition,
                filter: {
                  duration: 0.8,
                },
              },
            },
            inactive: {
              opacity: 0,
              scale: 0.95,
              filter: 'blur(0px)',
              transition,
            },
          }}
        >
          {/* 画像コンテナ - 背景画像とオーバーレイを含む */}
          <div className="relative w-full h-full">
            <Image
              src={work.thumbnail_url || ''}
              alt={work.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority={index === 0}
              className="object-cover rounded-lg"
              quality={90}
            />
            {/* フィルターオーバーレイ - 暗さと雰囲気の調整 */}
            <motion.div
              className="absolute inset-0 bg-black/70 dark:bg-black/80 rounded-lg z-10"
              animate={{
                opacity: isExpanded ? 0.8 : 0.5,
              }}
              transition={{
                duration: 0.8,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
