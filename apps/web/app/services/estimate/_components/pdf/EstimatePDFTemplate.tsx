import type React from "react";
import type { EstimateFormData } from "../../_types/estimate";
import type { ImplementationRequirements } from "../../_types/estimate";

interface EstimatePDFTemplateProps {
	data: EstimateFormData;
}

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

export const EstimatePDFTemplate: React.FC<EstimatePDFTemplateProps> = ({
	data,
}) => {
	const requirementTexts = getImplementationRequirementTexts(
		data.implementationRequirements,
	);

	return (
		<div className="w-[210mm] min-h-[297mm] bg-white p-8">
			<div className="text-center mb-8">
				<h1 className="text-2xl font-bold">お見積書</h1>
			</div>

			<div className="mb-8">
				<p className="text-right">
					発行日: {new Date().toLocaleDateString("ja-JP")}
				</p>
			</div>

			<div className="mb-8">
				<h2 className="text-xl font-bold mb-4">プロジェクト概要</h2>
				<p>{data.description}</p>
			</div>

			<div className="mb-8">
				<h2 className="text-xl font-bold mb-4">実装要件</h2>
				<ul className="list-disc pl-6">
					{requirementTexts.map((text) => (
						<li key={text}>{text}</li>
					))}
				</ul>
			</div>

			<div className="mb-8">
				<h2 className="text-xl font-bold mb-4">機能一覧</h2>
				<ul className="list-disc pl-6">
					{data.features.map((feature) => (
						<li key={feature}>{feature}</li>
					))}
				</ul>
			</div>

			<div className="mb-8">
				<h2 className="text-xl font-bold mb-4">見積金額</h2>
				<table className="w-full border-collapse">
					<tbody>
						<tr className="border-b">
							<td className="py-2">基本料金</td>
							<td className="text-right py-2">
								¥{data.baseCost.toLocaleString()}
							</td>
						</tr>
						{data.rushFee > 0 && (
							<tr className="border-b">
								<td className="py-2">特急料金</td>
								<td className="text-right py-2">
									¥{data.rushFee.toLocaleString()}
								</td>
							</tr>
						)}
						<tr className="border-b font-bold">
							<td className="py-2">合計金額（税抜）</td>
							<td className="text-right py-2">
								¥{data.totalCost.toLocaleString()}
							</td>
						</tr>
						<tr className="font-bold">
							<td className="py-2">合計金額（税込）</td>
							<td className="text-right py-2">
								¥{Math.floor(data.totalCost * 1.1).toLocaleString()}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div className="text-sm text-gray-600">
				<p>※ 本見積もりの有効期限は発行日より30日間です。</p>
				<p>※ 実際の開発内容により金額が変動する可能性があります。</p>
			</div>
		</div>
	);
};
