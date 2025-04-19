import * as React from 'react';

/**
 * モバイルデバイスの判定に使用するブレイクポイント（ピクセル単位）
 * 画面幅がこの値未満の場合、モバイルデバイスと判定される
 */
const MOBILE_BREAKPOINT = 1024;

/**
 * 現在の画面サイズがモバイルサイズかどうかを判定するカスタムフック
 *
 * @returns {boolean} 画面幅が1024px未満の場合はtrue、それ以上の場合はfalse
 *
 * @example
 * // 基本的な使用方法
 * function MyComponent() {
 *   const isMobile = useIsMobile();
 *
 *   return (
 *     <div>
 *       {isMobile ? (
 *         <MobileView />
 *       ) : (
 *         <DesktopView />
 *       )}
 *     </div>
 *   );
 * }
 *
 * @description
 * このフックはレスポンシブデザインの実装に役立ちます。
 * - SSR時には undefined を返し、クライアントサイドでマウント後に正しい値に更新されます
 * - 画面サイズの変更を自動的に検知し、状態を更新します
 * - window.matchMedia APIを使用して効率的に画面サイズの変更を監視します
 */
export function useIsMobile() {
  // モバイルかどうかの状態を管理
  // 初期値はundefinedで、クライアントサイドでマウント後に更新される
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    // メディアクエリを使用して画面サイズの変更を監視
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // 画面サイズが変更された時の処理
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // メディアクエリのイベントリスナーを設定
    mql.addEventListener('change', onChange);

    // 初期値を設定
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // クリーンアップ関数：コンポーネントのアンマウント時にイベントリスナーを削除
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // !!演算子を使用して、undefinedの場合もfalseに変換して返す
  return !!isMobile;
}
