// 基準となる単価設定
export const IMPLEMENTATION_COST_FACTORS = {
	// デザイン関連
	design: {
		base: 300000, // デザイン基本料金
		formatFactors: {
			// デザインツールごとの係数
			figma: 0.8, // Figma提供の場合は20%割引
			xd: 0.8, // XD提供の場合は20%割引
			photoshop: 1.2, // PSD提供の場合は20%割増（変換作業）
			sketch: 1.1, // Sketch提供の場合は10%割増
			other: 1.3, // その他形式は30%割増
			none: 1.0, // デザイン提供なしの場合
		},
		brandGuide: 150000, // ブランドガイドライン作成
	},

	// アセット関連
	assets: {
		logo: {
			base: 200000, // ロゴ制作基本料金
			simple: 100000, // シンプルなロゴ
			complex: 300000, // 複雑なロゴ
		},
		icons: {
			base: 5000, // 1アイコンあたりの制作費用
			set: 50000, // アイコンセット（10個程度）
		},
		images: {
			processing: 3000, // 1枚あたりの画像処理費用
		},
		fonts: {
			license: 50000, // フォントライセンス費用（年間）
		},
	},

	// コンテンツ関連
	content: {
		writing: {
			base: 10000, // 1ページあたりの文章制作費用
			technical: 20000, // 技術文書1ページあたり
		},
	},
};

// 開発期間への影響（日数）
export const IMPLEMENTATION_DURATION_FACTORS = {
	design: {
		creation: {
			base: 10, // デザイン作成基本日数
			perPage: 2, // 1ページあたりの追加日数
		},
		conversion: 2, // デザインデータ変換
		brandGuide: 5, // ブランドガイドライン作成
	},
	assets: {
		logo: {
			simple: 3, // シンプルなロゴ
			complex: 7, // 複雑なロゴ
		},
		icons: {
			perIcon: 0.5, // 1アイコンあたり
			set: 3, // アイコンセット（10個程度）
		},
		images: {
			perImage: 0.2, // 1枚あたりの画像処理
		},
	},
	content: {
		writing: {
			perPage: 1, // 1ページあたりの文章制作
			technical: 2, // 技術文書1ページあたり
		},
	},
};
