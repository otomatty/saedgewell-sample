'use client';

import { useEffect, useState } from 'react';

/**
 * キーワードリンクのデバッグ用コンポーネント
 * ページ内のキーワードリンクの状態を表示します
 */
export function KeywordLinkDebug() {
  const [linkElements, setLinkElements] = useState<HTMLElement[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [mdxElements, setMdxElements] = useState<HTMLElement[]>([]);
  const [keywordLinkComponents, setKeywordLinkComponents] = useState<Element[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // ページ内のキーワードリンク要素を取得
      const elements = Array.from(
        document.querySelectorAll('.keyword-link')
      ) as HTMLElement[];
      setLinkElements(elements);

      // デバッグ情報をコンソールに出力
      console.log(
        '🔍 KeywordLinkDebug - ページ内のキーワードリンク要素:',
        elements
      );

      // MDXコンテンツ要素を取得
      const mdxContentElements = Array.from(
        document.querySelectorAll('.mdx-content')
      ) as HTMLElement[];
      setMdxElements(mdxContentElements);

      console.log('🔍 KeywordLinkDebug - MDXコンテンツ要素:', {
        count: mdxContentElements.length,
        elements: mdxContentElements,
      });

      try {
        // MDXコンテンツ内の[[キーワード]]パターンを検索
        const textNodes = getTextNodesIn(document.body);
        const keywordPattern = /\[\[(.*?)(?:\|(.*?))?\]\]/;
        const matchingNodes = textNodes.filter((node) =>
          keywordPattern.test(node.textContent || '')
        );

        console.log(
          '🔍 KeywordLinkDebug - [[キーワード]]パターンを含むテキストノード:',
          {
            count: matchingNodes.length,
            nodes: matchingNodes.map((node) => ({
              text: node.textContent,
              parentElement: node.parentElement?.tagName,
              parentClassName: node.parentElement?.className,
            })),
          }
        );
      } catch (textNodeError) {
        console.error('テキストノードの検索中にエラーが発生:', textNodeError);
        setError(
          `テキストノードの検索中にエラーが発生: ${textNodeError instanceof Error ? textNodeError.message : '不明なエラー'}`
        );
      }

      try {
        // KeywordLinkコンポーネントを探す
        // 注: これは完全ではありませんが、React DevToolsなしで可能な限りの検出を試みます
        const possibleComponents = Array.from(
          document.querySelectorAll('[data-keyword]')
        );
        setKeywordLinkComponents(possibleComponents);

        console.log(
          '🔍 KeywordLinkDebug - 可能性のあるKeywordLinkコンポーネント:',
          {
            count: possibleComponents.length,
            elements: possibleComponents,
          }
        );
      } catch (componentError) {
        console.error('コンポーネントの検索中にエラーが発生:', componentError);
        setError(
          `コンポーネントの検索中にエラーが発生: ${componentError instanceof Error ? componentError.message : '不明なエラー'}`
        );
      }

      try {
        // ページ内のすべての要素を調査
        const allElements = Array.from(document.querySelectorAll('*'));
        const keywordPattern = /\[\[(.*?)(?:\|(.*?))?\]\]/;
        const suspiciousElements = allElements.filter((el) => {
          try {
            const attributes = Array.from(el.attributes).map(
              (attr) => attr.name
            );
            return (
              attributes.includes('keyword') ||
              attributes.includes('data-keyword') ||
              el.className.includes('keyword') ||
              (el.textContent && keywordPattern.test(el.textContent))
            );
          } catch (elementError) {
            console.warn('要素の検査中にエラーが発生:', elementError);
            return false;
          }
        });

        console.log('🔍 KeywordLinkDebug - キーワード関連の可能性がある要素:', {
          count: suspiciousElements.length,
          elements: suspiciousElements.map((el) => {
            try {
              return {
                tagName: el.tagName,
                className: el.className,
                attributes: Array.from(el.attributes).map(
                  (attr) => `${attr.name}="${attr.value}"`
                ),
                textContent: el.textContent?.substring(0, 50),
              };
            } catch (elementError) {
              console.warn('要素情報の取得中にエラーが発生:', elementError);
              return { tagName: el.tagName, error: 'データ取得エラー' };
            }
          }),
        });
      } catch (elementsError) {
        console.error('要素の検索中にエラーが発生:', elementsError);
        setError(
          `要素の検索中にエラーが発生: ${elementsError instanceof Error ? elementsError.message : '不明なエラー'}`
        );
      }
    } catch (globalError) {
      console.error(
        'KeywordLinkDebugコンポーネントでエラーが発生:',
        globalError
      );
      setError(
        `デバッグ処理中にエラーが発生: ${globalError instanceof Error ? globalError.message : '不明なエラー'}`
      );
    }
  }, []);

  // ページ内のすべてのテキストノードを取得する関数
  function getTextNodesIn(node: Node): Text[] {
    const textNodes: Text[] = [];

    function getTextNodes(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node as Text);
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          const childNode = node.childNodes[i];
          if (childNode) {
            getTextNodes(childNode);
          }
        }
      }
    }

    getTextNodes(node);
    return textNodes;
  }

  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded shadow-md"
      >
        デバッグ表示
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 bg-white border border-gray-300 shadow-lg p-4 m-4 rounded max-w-md max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">キーワードリンクデバッグ</h3>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="text-sm">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">エラーが発生しました</p>
            <p>{error}</p>
          </div>
        )}

        <p>検出されたキーワードリンク: {linkElements.length}件</p>
        <p>MDXコンテンツ要素: {mdxElements.length}件</p>
        <p>
          可能性のあるKeywordLinkコンポーネント: {keywordLinkComponents.length}
          件
        </p>

        {linkElements.length > 0 ? (
          <div className="mt-2">
            <h4 className="font-semibold mb-1">リンク一覧:</h4>
            <ul className="space-y-2">
              {linkElements.map((el, index) => (
                <li
                  key={`link-${index}-${el.textContent?.slice(0, 10) || index}`}
                  className="border-t pt-2"
                >
                  <div className="font-mono text-xs bg-gray-100 p-1 rounded mb-1">
                    {el.outerHTML}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <span className="text-gray-600">テキスト:</span>
                    <span>{el.textContent || '(空)'}</span>

                    <span className="text-gray-600">クラス:</span>
                    <span className="break-all">{el.className}</span>

                    <span className="text-gray-600">表示状態:</span>
                    <span>
                      {window.getComputedStyle(el).display !== 'none'
                        ? '表示'
                        : '非表示'}
                    </span>

                    <span className="text-gray-600">可視性:</span>
                    <span>
                      {window.getComputedStyle(el).visibility !== 'hidden'
                        ? '可視'
                        : '不可視'}
                    </span>

                    <span className="text-gray-600">透明度:</span>
                    <span>{window.getComputedStyle(el).opacity}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-red-500 mt-2">
            キーワードリンクが見つかりませんでした
          </p>
        )}
      </div>
    </div>
  );
}
