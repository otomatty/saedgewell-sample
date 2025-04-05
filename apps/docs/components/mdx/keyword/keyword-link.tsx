import type { KeywordLinkProps, ResolvedKeyword } from '~/types/mdx/keyword';
import { KeywordLinkClient } from '~/components/mdx/keyword/keyword-link-client';
import type { ReactNode } from 'react';

/**
 *
 * キーワードリンクコンポーネント
 * MDX内で[[キーワード]]または[[キーワード|docType]]の形式で記述されたリンクを処理
 *
 * @param keyword リンクするキーワード
 * @param docType ドキュメントタイプ（任意）
 * @param initialData 解決済みキーワードデータ（任意）
 * @param className スタイリング用のクラス名（任意）
 * @param children 子要素（リンクテキスト）
 */
export default function KeywordLink({
  keyword,
  docType,
  initialData,
  className,
  children,
}: KeywordLinkProps & { children?: ReactNode }) {
  try {
    let parsedData: ResolvedKeyword | undefined;

    // 文字列形式のinitialDataをパース
    if (typeof initialData === 'string') {
      try {
        parsedData = JSON.parse(initialData) as ResolvedKeyword;
      } catch (error) {
        console.error('KeywordLinkのinitialDataのパースに失敗しました:', error);
        parsedData = {
          keyword,
          docType,
          isAmbiguous: false,
          error: 'データのパースに失敗しました',
        };
      }
    } else if (initialData && typeof initialData === 'object') {
      // オブジェクト形式のinitialData
      parsedData = initialData as ResolvedKeyword;
    } else {
      // initialDataがない場合
      parsedData = undefined;
    }

    // 初期データがない場合のフォールバック
    if (!parsedData) {
      console.warn(
        'KeywordLink: initialDataがありません、フォールバックを使用します'
      );
      parsedData = {
        keyword: keyword || '不明なキーワード',
        docType,
        isAmbiguous: false,
        error: initialData ? undefined : 'データが提供されていません',
      };
    }

    // キーワードが提供されていない場合のフォールバック
    if (!keyword && parsedData) {
      parsedData.keyword = parsedData.keyword || '不明なキーワード';
      console.warn(
        'KeywordLink: keywordが提供されていません、フォールバックを使用します'
      );
    }

    // childrenがない場合は、keywordをテキストとして使用
    const displayText =
      children || keyword || parsedData.keyword || '不明なキーワード';

    return (
      <KeywordLinkClient
        initialData={parsedData}
        keyword={keyword || parsedData.keyword || '不明なキーワード'}
        docType={docType || parsedData.docType}
        className={className}
        displayText={displayText}
      />
    );
  } catch (error) {
    // 予期しないエラーが発生した場合のフォールバック
    console.error('KeywordLink: 予期しないエラーが発生しました', error);

    // エラー表示用のフォールバックコンポーネント
    return (
      <span
        className="keyword-link inline-block text-red-500 border-b border-dashed border-red-300"
        title={`エラー: ${error instanceof Error ? error.message : '不明なエラー'}`}
        data-keyword={keyword || '不明なキーワード'}
        data-error="true"
      >
        {children || keyword || '不明なキーワード'}
        <span className="ml-1 text-xs">⚠</span>
      </span>
    );
  }
}
