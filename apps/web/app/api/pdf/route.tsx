import { NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { EstimatePDFDocument } from '../../services/estimate/_components/pdf/estimate-pdf-document';
import type { EstimateFormData } from '../../../types/estimate';

/**
 * PDF生成APIエンドポイント (POST)
 * リクエストボディから見積もりデータを受け取り、@react-pdf/renderer を使用してPDFを生成して返す
 */
export async function POST(request: Request) {
  console.log(
    '[API /api/pdf] Received POST request (using @react-pdf/renderer)'
  );
  try {
    // リクエストボディからJSONデータを取得
    // フロントエンドから渡されるデータ構造に合わせて調整が必要な場合がある
    const requestData = await request.json();
    console.log('[API /api/pdf] Request data:', requestData);

    // @react-pdf/renderer に渡す Props を準備
    // requestData の構造に合わせて調整してください
    const pdfProps = {
      data: requestData as EstimateFormData, // 型アサーション
      baseCost: requestData.baseCost || 0,
      rushFee: requestData.rushFee || 0,
      totalCost: requestData.totalCost || 0,
      selectedFeatures:
        requestData.features?.map((name: string) => ({ name })) || [], // features は name の配列と仮定
    };

    // PDFをバッファとして生成
    console.log('[API /api/pdf] Generating PDF buffer...');
    // JSX を直接使用する
    const pdfBuffer = await renderToBuffer(
      <EstimatePDFDocument {...pdfProps} />
    );
    console.log('[API /api/pdf] PDF buffer generated successfully.');

    // バッファをレスポンスとして返す
    return new NextResponse(pdfBuffer, {
      // バッファを直接渡す
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="見積書_${new Date().toLocaleDateString('ja-JP')}.pdf"`,
      },
    });
  } catch (error) {
    console.error('[API /api/pdf] Error generating PDF:', error);
    return NextResponse.json(
      { message: 'PDF generation failed', error: (error as Error).message },
      { status: 500 }
    );
  }
}
