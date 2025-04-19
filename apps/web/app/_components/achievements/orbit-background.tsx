import { useRef, useEffect, useState } from 'react';
import { OrbitAnimation } from '@kit/ui/orbit-animation';

/**
 * 実績セクションの背景に表示する軌道アニメーションコンポーネント
 *
 * このコンポーネントは以下の機能を提供します：
 * 1. 装飾的なアニメーション
 *    - 左右の円形軌道
 *    - 連続的な回転効果
 *    - 半透明のボーダー
 *
 * 2. レスポンシブ対応
 *    - ウィンドウサイズに応じた円の大きさ調整
 *    - アスペクト比の維持
 *    - 適切な位置調整
 *
 * 3. パフォーマンス最適化
 *    - リサイズイベントの適切な管理
 *    - メモリリークの防止
 *    - 効率的なアニメーション処理
 *
 * 4. 視覚効果
 *    - 半透明のボーダー
 *    - スムーズな回転
 *    - 装飾的な要素としての調和
 */
export const OrbitBackground = () => {
  // 円の要素への参照
  const circleRef = useRef<HTMLDivElement>(null);
  // 円の半径を状態として管理
  const [radius, setRadius] = useState(0);

  /**
   * ウィンドウサイズの変更を監視し、円の半径を再計算
   * コンポーネントのマウント時とリサイズ時に実行
   */
  useEffect(() => {
    const calculateRadius = () => {
      if (circleRef.current) {
        // 円の要素の幅の半分を取得（実際の円の半径）
        const width = circleRef.current.offsetWidth;
        setRadius(width / 2);
      }
    };

    calculateRadius();
    window.addEventListener('resize', calculateRadius);
    // クリーンアップ関数でイベントリスナーを削除
    return () => window.removeEventListener('resize', calculateRadius);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* 左側の円 - 画面左端からはみ出す形で配置 */}
      <div className="absolute -left-1/3 top-1/2 -translate-y-1/2 w-2/3 aspect-square">
        <div ref={circleRef} className="relative w-full h-full">
          <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
          <OrbitAnimation className="w-full h-full" speed={0.002} />
        </div>
      </div>
      {/* 右側の円 - 画面右端からはみ出す形で配置 */}
      <div className="absolute -right-1/3 top-1/2 -translate-y-1/2 w-2/3 aspect-square">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
          <OrbitAnimation className="w-full h-full" speed={0.002} />
        </div>
      </div>
    </div>
  );
};
