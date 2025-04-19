/**
 * アンカーリンクのスクロール機能を提供するカスタムフック
 */
export function useScrollToAnchor() {
  /**
   * 指定されたIDの要素までスクロールする関数
   * @param id - スクロール先の要素ID
   */
  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // URLのハッシュを更新
      window.history.pushState(null, '', `#${id}`);

      // ヘッダーの高さを考慮してスクロール
      const headerHeight = 80; // ヘッダーの高さ（px）
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: 'smooth',
      });
    }
  };

  return { scrollToElement };
}
