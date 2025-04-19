import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

/**
 * HTML要素をPDFに変換するオプション
 */
export interface HtmlToPdfOptions {
  /**
   * 出力するPDFのファイル名
   */
  filename?: string;

  /**
   * PDFのタイトル
   */
  title?: string;

  /**
   * 画像の品質（0.0〜1.0）
   */
  quality?: number;

  /**
   * PDFのマージン（mm単位）
   */
  margin?: number;

  /**
   * PDFのページサイズ
   */
  pageSize?: 'a3' | 'a4' | 'a5' | 'letter' | 'legal';

  /**
   * PDFの向き
   */
  orientation?: 'portrait' | 'landscape';
}

/**
 * HTML要素をPDFに変換する
 * @param element 変換するHTML要素
 * @param options 変換オプション
 * @returns 生成されたPDFのBlobとURL
 */
export async function htmlToPdf(
  element: HTMLElement,
  options: HtmlToPdfOptions = {}
): Promise<{ blob: Blob; url: string }> {
  const {
    filename = 'document.pdf',
    title,
    quality = 0.95,
    margin = 10,
    pageSize = 'a4',
    orientation = 'portrait',
  } = options;

  // HTML要素を画像に変換
  const imgData = await toPng(element, {
    quality,
    pixelRatio: 2,
    skipAutoScale: true,
  });

  // PDFドキュメントを作成
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize,
  });

  // ページサイズを取得
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // コンテンツのサイズを計算
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (element.offsetHeight * imgWidth) / element.offsetWidth;

  // タイトルを追加（存在する場合）
  if (title) {
    doc.setFontSize(16);
    doc.text(title, pageWidth / 2, margin, { align: 'center' });
  }

  // 画像をPDFに追加
  const startY = title ? margin + 10 : margin;

  // ページごとに表示できる高さを計算
  const contentPerPage = pageHeight - (startY + margin);

  // コンテンツが複数ページにわたる場合の処理
  let heightLeft = imgHeight;
  let position = 0;

  // 最初のページに画像を追加
  doc.addImage(imgData, 'PNG', margin, startY, imgWidth, imgHeight);
  heightLeft -= contentPerPage;
  position = heightLeft;

  // コンテンツが複数ページにわたる場合、新しいページを追加
  while (heightLeft > 0) {
    doc.addPage();
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

  // PDF出力
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);

  return { blob, url };
}

/**
 * HTMLをPDFとしてダウンロードする
 * @param element 変換するHTML要素
 * @param options 変換オプション
 */
export async function downloadHtmlAsPdf(
  element: HTMLElement,
  options: HtmlToPdfOptions = {}
): Promise<void> {
  const { filename = 'document.pdf' } = options;

  try {
    const { blob, url } = await htmlToPdf(element, options);

    // ダウンロードリンクを作成
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // リンクをクリックしてダウンロード開始
    document.body.appendChild(link);
    link.click();

    // 後処理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF生成中にエラーが発生しました:', error);
    throw error;
  }
}
