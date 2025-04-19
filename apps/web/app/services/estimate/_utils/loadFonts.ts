import type { jsPDF } from "jspdf";

export async function loadFonts(doc: jsPDF) {
	try {
		// フォントファイルを読み込む
		const response = await fetch("/fonts/NotoSansJP-VariableFont_wght.ttf");
		const fontData = await response.arrayBuffer();

		// フォントをPDFに追加
		doc.addFont(
			Buffer.from(fontData).toString("base64"),
			"NotoSansJP",
			"normal",
		);

		// フォントを設定
		doc.setFont("NotoSansJP");
		doc.setFontSize(10);
	} catch (error) {
		console.error("Failed to load font:", error);
		// フォールバック: 組み込みフォントを使用
		doc.setFont("helvetica");
		doc.setFontSize(10);
	}
}
