import { useState, useCallback, type RefObject } from 'react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { getPdfStyles } from '~/lib/pdf/pdf-styles';

type GeneratePdfOptions = {
  filename?: string;
  title?: string;
  quality?: number;
  margin?: number;
};

/**
 * PDF生成機能を提供するカスタムフック
 * @param contentRef PDF化する要素への参照
 * @returns PDF生成関連の状態と関数
 */
export const usePdfGenerator = (contentRef: RefObject<HTMLElement>) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * HTML要素からPDFを生成する
   * @param options PDF生成オプション
   */
  const generatePdf = useCallback(
    async (options: GeneratePdfOptions = {}) => {
      const {
        filename = 'document.pdf',
        title,
        quality = 0.95,
        margin = 10,
      } = options;

      if (!contentRef.current) {
        setError('コンテンツが見つかりません');
        return;
      }

      try {
        setIsGenerating(true);
        setError(null);

        console.log('PDF生成を開始します...');

        // PDF用のスタイルを適用するために要素のスタイルを一時的に変更
        const pdfStyles = getPdfStyles();
        const originalStyles = new Map<HTMLElement, string>();
        const elementsToStyle = contentRef.current.querySelectorAll(
          'h1, h2, h3, h4, h5, h6, p, ul, ol, li, pre, code, blockquote, table, th, td, img'
        );

        // オリジナルのスタイルを保存して一時的にPDF用スタイルを適用
        for (const el of Array.from(elementsToStyle)) {
          const element = el as HTMLElement;
          originalStyles.set(element, element.style.cssText);

          // 要素タイプに応じたスタイルを適用
          const tagName = element.tagName.toLowerCase();
          // 型安全にアクセス - unknownを経由して型変換
          const styleRules =
            (
              pdfStyles as unknown as Record<
                string,
                Record<string, string | number | boolean>
              >
            )[tagName] || {};

          for (const [prop, value] of Object.entries(styleRules)) {
            // @ts-ignore - CSSプロパティの動的適用
            element.style[prop] = value;
          }
        }

        // HTML要素を画像に変換
        const imgData = await toPng(contentRef.current, {
          quality,
          pixelRatio: 2,
          skipAutoScale: true,
          style: {
            // 印刷用スタイルを追加
            backgroundColor: 'white',
          },
        });

        // スタイルを元に戻す
        for (const el of Array.from(elementsToStyle)) {
          const element = el as HTMLElement;
          const originalStyle = originalStyles.get(element);
          if (originalStyle !== undefined) {
            element.style.cssText = originalStyle;
          }
        }

        // PDFドキュメントを初期化
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        // ページサイズを取得
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // コンテンツの縦横比を計算して適切なサイズで配置
        const imgWidth = pageWidth - margin * 2;
        const imgHeight =
          (contentRef.current.offsetHeight * imgWidth) /
          contentRef.current.offsetWidth;

        // タイトルを追加（存在する場合）
        if (title) {
          doc.setFontSize(16);
          doc.text(title, pageWidth / 2, margin, { align: 'center' });
        }

        // 画像（コンテンツ）をPDFに追加
        const startY = title ? margin + 10 : margin;

        // 一度に表示できる高さを計算
        const contentPerPage = pageHeight - (startY + margin);

        // ページ分割が必要な場合の処理
        let heightLeft = imgHeight;
        let position = 0;
        let pageCount = 1;

        // 最初のページに画像を追加
        doc.addImage(imgData, 'PNG', margin, startY, imgWidth, imgHeight);
        heightLeft -= contentPerPage;
        position = heightLeft;

        // コンテンツが複数ページにわたる場合、新しいページを追加
        while (heightLeft > 0) {
          doc.addPage();
          pageCount++;
          doc.addImage(
            imgData,
            'PNG',
            margin,
            -(position - margin),
            imgWidth,
            imgHeight
          );
          heightLeft -= contentPerPage;
          position += contentPerPage;
        }

        console.log(`PDF生成完了 (${pageCount}ページ)`);

        // PDFをダウンロード
        doc.save(filename);
      } catch (err) {
        console.error('PDF生成中にエラーが発生しました:', err);
        setError('PDF生成中にエラーが発生しました');
      } finally {
        setIsGenerating(false);
      }
    },
    [contentRef]
  );

  return {
    generatePdf,
    isGenerating,
    error,
  };
};
