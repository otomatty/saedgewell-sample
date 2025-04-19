package main

// 設定
type Config struct {
	// 対象ディレクトリ（複数）
	TargetDirs []string
	// 現在処理中のディレクトリ
	TargetDir string
	// 除外するファイル名パターン
	ExcludePatterns []string
	// 除外するインポートパスパターン
	ExcludeImportPatterns []string
	// 除外するディレクトリ一覧
	ExcludeDirectories []string
	// 変換方向: "camelToKebab" または "kebabToCamel"
	ConversionDirection string
	// ドライラン（true: 実際に変更を行わない、変更予定のファイルだけ表示）
	DryRun bool
	// デバッグモード（true: 詳細情報を表示）
	DebugMode bool
}

// 変換結果
type ConversionResult struct {
	OldPath     string
	NewPath     string
	OldBaseName string
	NewBaseName string
	// 処理ディレクトリ
	TargetDir    string
	// 処理統計
	TotalFiles    int
	ProcessedFiles int
	SkippedFiles  int
	ErrorFiles    int
	// インポートパス更新
	ImportUpdateFiles []string
}

// プロジェクト構造
type ProjectStructure struct {
	RootType    string
	Directories []string
	FileStats   map[string]FileStatistics
}

// ファイル統計
type FileStatistics struct {
	CamelCaseCount int
	KebabCaseCount int
	TotalFiles     int
	FilePaths      []string
} 