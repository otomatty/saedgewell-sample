// プロジェクトの種類
export type ProjectType = "web" | "app" | "other";

// 開発期間
export type Deadline = "asap" | "1month" | "3months" | "6months" | "flexible";

// 開発期間の日数マッピング
export const DEADLINE_TO_DAYS: Record<Deadline, number> = {
	asap: 14, // 2週間以内
	"1month": 30, // 1ヶ月以内
	"3months": 90, // 3ヶ月以内
	"6months": 180, // 6ヶ月以内
	flexible: 0, // 柔軟（追加料金なし）
};

// 特急料金の割増率
export const RUSH_FEE_RATES = {
	critical: 0.5, // 乖離率が-0.5以下 = 50%増
	high: 0.3, // 乖離率が-0.3以下 = 30%増
	medium: 0.2, // 乖離率が-0.2以下 = 20%増
	low: 0.1, // 乖離率が-0.1以下 = 10%増
	none: 0, // それ以外 = 追加なし
} as const;

// 特急料金の計算結果の型
export interface RushFeeCalculation {
	basePrice: number;
	rushFee: number;
	totalPrice: number;
	divergenceRate: number;
	appliedRate: number;
	reason: string;
	isTimelineDangerous?: boolean;
}

// デザイン提供形式
export type DesignFormat =
	| "figma"
	| "xd"
	| "photoshop"
	| "sketch"
	| "other"
	| "none";

// 実装要件の型
export interface ImplementationRequirements {
	// デザイン関連
	hasDesign: boolean;
	designFormat?: DesignFormat;
	hasBrandGuidelines: boolean;

	// アセット関連
	hasLogo: boolean;
	hasImages: boolean;
	hasIcons: boolean;
	hasCustomFonts: boolean;

	// コンテンツ関連
	hasContent: boolean;
}

// 実装要件による追加コストの計算結果
export interface ImplementationCosts {
	// デザイン関連
	designCost: {
		amount: number;
		reason: string;
	};
	// アセット関連
	assetsCost: {
		amount: number;
		reason: string;
	};
	// コンテンツ関連
	contentCost: {
		amount: number;
		reason: string;
	};
	// 合計
	totalAdditionalCost: number;
	// 開発期間への影響（日数）
	additionalDuration: number;
}

// フォームデータの型を拡張
export interface EstimateFormData {
	projectType: ProjectType;
	description: string;
	deadline: Deadline;
	implementationRequirements?: ImplementationRequirements;
	features: string[];
	baseCost: number;
	rushFee: number;
	totalCost: number;
}

// AIが生成する質問の型
export interface AIQuestion {
	id: string;
	question: string;
	type: "text" | "radio";
	options?: string[];
	isAnswered: boolean;
	answer: string;
	description: string; // 質問の意図や補足説明
	skipped: boolean; // 質問をスキップしたかどうか
}

// AIが提案する機能の型
export interface FeatureProposal {
	id: string;
	name: string;
	description: string;
	price: number;
	duration: number;
	isRequired: boolean;
	category: "core" | "user" | "auth" | "content" | "payment" | "other";
	dependencies?: string[];
	reason?: string; // 必須/任意の判断理由
	difficulty?: number; // 実装難易度（1-5）
	dailyRate?: number; // 1日あたりの単価
	difficultyReason?: string; // 難易度の判断理由
}
