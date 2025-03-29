import puppeteer from "puppeteer";
import type { EstimateFormData } from "../../_types/estimate";
import type { ImplementationRequirements } from "../../_types/estimate";

export async function generatePDF(html: string): Promise<Buffer> {
	const browser = await puppeteer.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	try {
		const page = await browser.newPage();

		// ページサイズをA4に設定
		await page.setViewport({
			width: 794, // A4サイズの幅（ピクセル）
			height: 1123, // A4サイズの高さ（ピクセル）
			deviceScaleFactor: 2,
		});

		// HTMLコンテンツを設定
		await page.setContent(html, {
			waitUntil: "networkidle0",
		});

		// PDFを生成
		const pdf = await page.pdf({
			format: "A4",
			printBackground: true,
			margin: {
				top: "20mm",
				right: "20mm",
				bottom: "20mm",
				left: "20mm",
			},
		});

		return Buffer.from(pdf);
	} finally {
		await browser.close();
	}
}

// 実装要件をテキストに変換する関数を追加
function getImplementationRequirementTexts(
	req?: ImplementationRequirements,
): string[] {
	if (!req) return [];
	return [
		req.hasDesign ? `デザイン提供形式: ${req.designFormat || "未定"}` : null,
		req.hasBrandGuidelines ? "ブランドガイドラインあり" : null,
		req.hasLogo ? "ロゴ素材あり" : null,
		req.hasImages ? "画像素材あり" : null,
		req.hasIcons ? "アイコン素材あり" : null,
		req.hasCustomFonts ? "カスタムフォントあり" : null,
		req.hasContent ? "コンテンツ提供あり" : null,
	].filter((text): text is string => text !== null);
}

export async function renderPDFTemplate(
	data: EstimateFormData,
): Promise<string> {
	const requirementTexts = getImplementationRequirementTexts(
		data.implementationRequirements,
	);

	// Next.jsのサーバーコンポーネントをHTMLに変換するためのテンプレート
	return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
          
          body {
            font-family: 'Noto Sans JP', sans-serif;
            margin: 0;
            padding: 0;
          }
          
          .container {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            box-sizing: border-box;
          }
          
          h1 {
            font-size: 24px;
            text-align: center;
            margin-bottom: 2rem;
          }
          
          h2 {
            font-size: 18px;
            margin-bottom: 1rem;
          }
          
          .date {
            text-align: right;
            margin-bottom: 2rem;
          }
          
          .section {
            margin-bottom: 2rem;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          td {
            padding: 0.5rem;
            border-bottom: 1px solid #ddd;
          }
          
          .amount {
            text-align: right;
          }
          
          .notes {
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>お見積書</h1>
          
          <div class="date">
            発行日: ${new Date().toLocaleDateString("ja-JP")}
          </div>
          
          <div class="section">
            <h2>プロジェクト概要</h2>
            <p>${data.description}</p>
          </div>
          
          <div class="section">
            <h2>実装要件</h2>
            <ul>
              ${requirementTexts.map((text) => `<li>${text}</li>`).join("")}
            </ul>
          </div>
          
          <div class="section">
            <h2>機能一覧</h2>
            <ul>
              ${data.features?.map((feature) => `<li>${feature}</li>`).join("")}
            </ul>
          </div>
          
          <div class="section">
            <h2>見積金額</h2>
            <table>
              <tr>
                <td>基本料金</td>
                <td class="amount">¥${data.baseCost.toLocaleString()}</td>
              </tr>
              ${
								data.rushFee > 0
									? `
              <tr>
                <td>特急料金</td>
                <td class="amount">¥${data.rushFee.toLocaleString()}</td>
              </tr>
              `
									: ""
							}
              <tr>
                <td><strong>合計金額（税抜）</strong></td>
                <td class="amount"><strong>¥${data.totalCost.toLocaleString()}</strong></td>
              </tr>
              <tr>
                <td><strong>合計金額（税込）</strong></td>
                <td class="amount"><strong>¥${Math.floor(
									data.totalCost * 1.1,
								).toLocaleString()}</strong></td>
              </tr>
            </table>
          </div>
          
          <div class="notes">
            <p>※ 本見積もりの有効期限は発行日より30日間です。</p>
            <p>※ 実際の開発内容により金額が変動する可能性があります。</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
