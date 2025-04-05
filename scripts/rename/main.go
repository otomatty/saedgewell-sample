package main

import (
	"flag"
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/manifoldco/promptui"
)

// ANSI エスケープシーケンス：文字色
const (
	colorReset  = "\033[0m"
	colorRed    = "\033[31m"
	colorGreen  = "\033[32m"
	colorYellow = "\033[33m"
	colorBlue   = "\033[34m"
	colorPurple = "\033[35m"
	colorCyan   = "\033[36m"
)

// キャメルケース文字列をカラー表示用にフォーマット
func formatCamelCase(s string) string {
	return fmt.Sprintf("\033[1;33m%s\033[0m", s)
}

// ケバブケース文字列をカラー表示用にフォーマット
func formatKebabCase(s string) string {
	return fmt.Sprintf("\033[1;36m%s\033[0m", s)
}

// ディレクトリ情報を文字列に整形
func formatDirectoryInfo(dir string, stats FileStatistics) string {
	return fmt.Sprintf("%-40s [%sキャメル: %d%s, %sケバブ: %d%s, 合計: %d]",
		dir,
		colorBlue, stats.CamelCaseCount, colorReset,
		colorGreen, stats.KebabCaseCount, colorReset,
		stats.TotalFiles,
	)
}

// 変換設定の取得
func promptForConfig(structure *ProjectStructure, excludeConfig *ExcludeConfig) (Config, error) {
	// Ctrl+C のハンドリング
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-sigChan
		fmt.Println("\n処理を中止しました。")
		os.Exit(0)
	}()

	// Next.jsの特殊ファイルを除外パターンとして設定
	excludePatterns := excludeConfig.ExcludeFiles

	// 除外インポートパスを設定
	excludeImportPatterns := excludeConfig.ExcludeImports

	// 除外ディレクトリを設定
	excludeDirectories := excludeConfig.ExcludeDirectories

	var targetDirs []string
	var conversionDirection string

selectionModeStep:
	for {
		// 選択モードの選択
		selectionModePrompt := promptui.Select{
			Label: "ディレクトリの選択方法を選んでください",
			Items: []string{
				fmt.Sprintf("%sの全ディレクトリを変換する", structure.RootType),
				fmt.Sprintf("%sからディレクトリを選択する", structure.RootType),
				"キャンセル",
			},
		}

		_, selectionMode, err := selectionModePrompt.Run()
		if err != nil {
			return Config{}, fmt.Errorf("選択モードの選択中にエラーが発生しました: %v", err)
		}

		if selectionMode == "キャンセル" {
			fmt.Println("処理を中止しました。")
			os.Exit(0)
		}

		if strings.Contains(selectionMode, "全ディレクトリ") {
			// 全ディレクトリを選択
			targetDirs = structure.Directories
		} else {
			// 複数選択モード
			fmt.Println("\n以下のディレクトリから選択してください（スペースキーで選択/解除、Enterで確定）:")
			fmt.Println("----------------------------------------")
			
			selected := make(map[string]bool)
			dirToDisplayMap := make(map[string]string)
			var displayToDir = make(map[string]string)

			// ディレクトリ情報を整形
			for _, dir := range structure.Directories {
				displayStr := formatDirectoryInfo(dir, structure.FileStats[dir])
				dirToDisplayMap[dir] = displayStr
				displayToDir[displayStr] = dir
			}

			for {
				var unselectedDisplays []string
				for _, dir := range structure.Directories {
					if !selected[dir] {
						unselectedDisplays = append(unselectedDisplays, dirToDisplayMap[dir])
					}
				}

				// 選択済みのディレクトリ数と合計ファイル数を計算
				var selectedFiles, selectedCamel, selectedKebab int
				for dir := range selected {
					stats := structure.FileStats[dir]
					selectedFiles += stats.TotalFiles
					selectedCamel += stats.CamelCaseCount
					selectedKebab += stats.KebabCaseCount
				}

				dirPrompt := promptui.Select{
					Label: fmt.Sprintf(
						"変換対象のディレクトリを選択 (選択済み: %d ディレクトリ, ファイル数: キャメル %d, ケバブ %d, 合計 %d)",
						len(selected),
						selectedCamel,
						selectedKebab,
						selectedFiles,
					),
					Items: append(unselectedDisplays, "選択完了", "前のステップに戻る", "キャンセル"),
				}

				_, choice, err := dirPrompt.Run()
				if err != nil {
					return Config{}, fmt.Errorf("ディレクトリの選択中にエラーが発生しました: %v", err)
				}

				if choice == "キャンセル" {
					fmt.Println("処理を中止しました。")
					os.Exit(0)
				}

				if choice == "前のステップに戻る" {
					continue selectionModeStep
				}

				if choice == "選択完了" {
					break
				}

				dir := displayToDir[choice]
				selected[dir] = true
				stats := structure.FileStats[dir]
				fmt.Printf("選択: %s [%sキャメル: %d%s, %sケバブ: %d%s, 合計: %d]\n",
					dir,
					colorBlue, stats.CamelCaseCount, colorReset,
					colorGreen, stats.KebabCaseCount, colorReset,
					stats.TotalFiles,
				)
			}

			// 選択されたディレクトリを配列に変換
			for dir := range selected {
				targetDirs = append(targetDirs, dir)
			}

			if len(targetDirs) == 0 {
				fmt.Println("ディレクトリが選択されていません。再度選択してください。")
				continue selectionModeStep
			}
		}

conversionDirectionStep:
		// 変換方向の選択
		conversionDirection, err = promptForConversionDirection(targetDirs, structure)
		if err != nil {
			if err.Error() == "前のステップに戻る" {
				// ディレクトリ選択に戻る
				targetDirs = nil
				continue selectionModeStep
			}
			return Config{}, fmt.Errorf("変換方向の選択に失敗しました: %v", err)
		}

		// ここで設定確認のプロンプトを追加
		fmt.Println("\n--- 選択された設定 ---")
		fmt.Println("対象ディレクトリ:")
		var totalCamel, totalKebab, totalFiles int
		for _, dir := range targetDirs {
			stats := structure.FileStats[dir]
			fmt.Printf("- %s [%sキャメル: %d%s, %sケバブ: %d%s, 合計: %d]\n",
				dir,
				colorBlue, stats.CamelCaseCount, colorReset,
				colorGreen, stats.KebabCaseCount, colorReset,
				stats.TotalFiles,
			)
			totalCamel += stats.CamelCaseCount
			totalKebab += stats.KebabCaseCount
			totalFiles += stats.TotalFiles
		}
		
		// 変換方向と例の表示
		var directionText string
		var exampleFrom, exampleTo string
		if conversionDirection == "camel-to-kebab" {
			directionText = "キャメルケース → ケバブケース"
			exampleFrom = formatCamelCase("MyComponent")
			exampleTo = formatKebabCase("my-component")
		} else {
			directionText = "ケバブケース → キャメルケース"
			exampleFrom = formatKebabCase("user-profile")
			exampleTo = formatCamelCase("UserProfile")
		}
		
		fmt.Printf("変換方向: %s（例: %s → %s）\n", directionText, exampleFrom, exampleTo)
		
		// モード選択プロンプト
		modePrompt := promptui.Select{
			Label: "実行モードを選択してください",
			Items: []string{
				fmt.Sprintf("%sテストする（ドライラン・変更なし）%s", colorGreen, colorReset),
				fmt.Sprintf("%s変換する（実際に変更を適用）%s", colorRed, colorReset),
				"変換方向を変更する",
				"ディレクトリ選択に戻る",
				"キャンセル",
			},
		}

		_, modeResult, err := modePrompt.Run()
		if err != nil {
			return Config{}, fmt.Errorf("確認の選択中にエラーが発生しました: %v", err)
		}

		switch modeResult {
		case "キャンセル":
			fmt.Println("処理を中止しました。")
			os.Exit(0)
		case "ディレクトリ選択に戻る":
			targetDirs = nil
			continue selectionModeStep
		case "変換方向を変更する":
			// 変換方向選択に戻る
			goto conversionDirectionStep
		case fmt.Sprintf("%sテストする（ドライラン・変更なし）%s", colorGreen, colorReset):
			return Config{
				TargetDirs:          targetDirs,
				ExcludePatterns:     excludePatterns,
				ExcludeImportPatterns: excludeImportPatterns,
				ExcludeDirectories:  excludeDirectories,
				ConversionDirection: conversionDirection,
				DryRun:             true,
				DebugMode:          false,
			}, nil
		case fmt.Sprintf("%s変換する（実際に変更を適用）%s", colorRed, colorReset):
			// テスト実行の確認
			testConfirmPrompt := promptui.Select{
				Label: "テストはしてみましたか？実際に変換を実行すると、ファイル名が変更されます",
				Items: []string{"はい、テスト済みです", "いいえ、テストに戻ります", "キャンセル"},
			}

			_, testConfirmResult, err := testConfirmPrompt.Run()
			if err != nil {
				return Config{}, fmt.Errorf("確認の選択中にエラーが発生しました: %v", err)
			}

			if testConfirmResult == "キャンセル" {
				fmt.Println("処理を中止しました。")
				os.Exit(0)
			}

			if testConfirmResult == "いいえ、テストに戻ります" {
				return Config{
					TargetDirs:          targetDirs,
					ExcludePatterns:     excludePatterns,
					ExcludeImportPatterns: excludeImportPatterns,
					ExcludeDirectories:  excludeDirectories,
					ConversionDirection: conversionDirection,
					DryRun:             true,
					DebugMode:          false,
				}, nil
			}

			return Config{
				TargetDirs:          targetDirs,
				ExcludePatterns:     excludePatterns,
				ExcludeImportPatterns: excludeImportPatterns,
				ExcludeDirectories:  excludeDirectories,
				ConversionDirection: conversionDirection,
				DryRun:             false,
				DebugMode:          false,
			}, nil
		}
	}

	
}

// 変換方向を選択する関数
func promptForConversionDirection(targetDirs []string, structure *ProjectStructure) (string, error) {
	// 選択されたディレクトリの統計を集計
	var totalCamelCase, totalKebabCase int
	for _, dir := range targetDirs {
		if stats, ok := structure.FileStats[dir]; ok {
			totalCamelCase += stats.CamelCaseCount
			totalKebabCase += stats.KebabCaseCount
		}
	}

	// 変換方向の選択肢
	directionOptions := []string{
		fmt.Sprintf("%s → %s（%d ファイルが対象）例: %s → %s", 
			"キャメルケース", "ケバブケース", 
			totalCamelCase,
			formatCamelCase("MyComponent"), 
			formatKebabCase("my-component")),
		fmt.Sprintf("%s → %s（%d ファイルが対象）例: %s → %s", 
			"ケバブケース", "キャメルケース", 
			totalKebabCase,
			formatKebabCase("user-profile"), 
			formatCamelCase("UserProfile")),
		"前のステップに戻る",
		"キャンセル",
	}

	prompt := promptui.Select{
		Label: "変換方向を選択してください",
		Items: directionOptions,
	}

	idx, result, err := prompt.Run()
	if err != nil {
		if err == promptui.ErrInterrupt {
			fmt.Println("処理を中止しました。")
			os.Exit(0)
		}
		return "", fmt.Errorf("変換方向の選択中にエラーが発生しました: %w", err)
	}

	// 「前のステップに戻る」が選択された場合
	if result == "前のステップに戻る" {
		return "", fmt.Errorf("前のステップに戻る")
	}

	// キャンセルが選択された場合
	if result == "キャンセル" {
		fmt.Println("処理を中止しました。")
		os.Exit(0)
	}

	// 選択結果を返す
	if idx == 0 {
		return "camel-to-kebab", nil
	} else if idx == 1 {
		return "kebab-to-camel", nil
	}

	// ここには到達しないはず
	return "", fmt.Errorf("予期しないエラーが発生しました")
}

// テスト実行
func runTests() {
	fmt.Println("\n=== 特殊ケース変換テスト ===")

	testCases := []struct {
		Input       string
		ExpectedOut string
		Direction   string
		Desc        string
	}{
		// キャメルケース → ケバブケース
		{"FormUI", "form-ui", "camel-to-kebab", "複合大文字 (FormUI)"},
		{"UserAPIService", "user-api-service", "camel-to-kebab", "中間の略語 (UserAPIService)"},
		{"FAQPage", "faq-page", "camel-to-kebab", "先頭の略語 (FAQPage)"},
		{"TableUIComponent", "table-ui-component", "camel-to-kebab", "中間の略語 (TableUIComponent)"},
		{"UserIDCard", "user-id-card", "camel-to-kebab", "略語ID (UserIDCard)"},
		
		// ケバブケース → キャメルケース
		{"form-ui", "FormUI", "kebab-to-camel", "UIを含む (form-ui)"},
		{"user-api-service", "UserAPIService", "kebab-to-camel", "APIを含む (user-api-service)"},
		{"faq-page", "FAQPage", "kebab-to-camel", "FAQを含む (faq-page)"},
		{"api-client", "APIClient", "kebab-to-camel", "先頭の略語 (api-client)"},
		{"form-ui-component", "FormUIComponent", "kebab-to-camel", "複数単語 (form-ui-component)"},
	}

	fmt.Println("キャメルケース → ケバブケース:")
	for _, tc := range testCases {
		if tc.Direction == "camel-to-kebab" {
			result := camelToKebab(tc.Input)
			success := result == tc.ExpectedOut
			if success {
				fmt.Printf("✅ %s: %s → %s\n", tc.Desc, formatCamelCase(tc.Input), formatKebabCase(result))
			} else {
				fmt.Printf("❌ %s: %s → %s (期待値: %s)\n", tc.Desc, formatCamelCase(tc.Input), formatKebabCase(result), formatKebabCase(tc.ExpectedOut))
			}
		}
	}

	fmt.Println("\nケバブケース → キャメルケース:")
	for _, tc := range testCases {
		if tc.Direction == "kebab-to-camel" {
			result := kebabToCamel(tc.Input)
			success := result == tc.ExpectedOut
			if success {
				fmt.Printf("✅ %s: %s → %s\n", tc.Desc, formatKebabCase(tc.Input), formatCamelCase(result))
			} else {
				fmt.Printf("❌ %s: %s → %s (期待値: %s)\n", tc.Desc, formatKebabCase(tc.Input), formatCamelCase(result), formatCamelCase(tc.ExpectedOut))
			}
		}
	}
	
	fmt.Println("\nテスト完了")
}

func main() {
	// コマンドラインオプションの処理
	var debugMode bool
	flag.BoolVar(&debugMode, "debug", false, "デバッグモードを有効にする（詳細な情報を表示）")
	flag.BoolVar(&debugMode, "d", false, "デバッグモードを有効にする（短縮オプション）")
	flag.Parse()

	if debugMode {
		fmt.Println("デバッグモードが有効です。詳細な情報が表示されます。")
	}

	// ユーザへのフィードバック
	fmt.Println("\n===================================================")
	fmt.Println("              ファイル名変換ツール")
	fmt.Println("===================================================")
	fmt.Println("このツールは、Reactコンポーネントのファイル名を")
	fmt.Println("キャメルケースとケバブケースの間で変換します。")
	fmt.Println("また、インポートパスも自動的に更新します。")
	fmt.Println("===================================================")

	// 除外設定ファイルの読み込み
	excludeConfigPath := getExcludeConfigPath()
	excludeConfig, err := loadExcludeConfig(excludeConfigPath)
	if err != nil {
		fmt.Printf("警告: 除外設定ファイルの読み込みに失敗しました: %v\n", err)
		fmt.Println("デフォルトの除外設定を使用します。")
		excludeConfig = getDefaultExcludeConfig()
	} else {
		fmt.Printf("除外設定ファイルを読み込みました: %s\n", excludeConfigPath)
		if debugMode {
			fmt.Printf("  除外ファイル: %d 件\n", len(excludeConfig.ExcludeFiles))
			fmt.Printf("  除外インポート: %d 件\n", len(excludeConfig.ExcludeImports))
			fmt.Printf("  除外ディレクトリ: %d 件\n", len(excludeConfig.ExcludeDirectories))
		}
	}

	// テスト実行
	runTests()

	// プロジェクトの解析
	fmt.Println("\n--- プロジェクト解析中 ---")
	projectRoot, err := findProjectRoot()
	if err != nil {
		fmt.Printf("プロジェクトルートの検出に失敗しました: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("プロジェクトルート: %s\n\n", projectRoot)

	// プロジェクト構造の解析
	structure, err := analyzeProjectStructure(projectRoot)
	if err != nil {
		fmt.Printf("プロジェクト構造の解析に失敗しました: %v\n", err)
		os.Exit(1)
	}

	// ディレクトリ情報の表示
	fmt.Printf("検出された%s: %d ディレクトリ\n", structure.RootType, len(structure.Directories))
	
	// 設定の取得
	config, err := promptForConfig(structure, excludeConfig)
	if err != nil {
		fmt.Printf("設定の取得に失敗しました: %v\n", err)
		os.Exit(1)
	}
	
	// デバッグモードを設定
	config.DebugMode = debugMode

	// コマンドライン引数で設定を上書き
	// --debugが指定されている場合、DebugModeをtrueにする
	if !config.DryRun && config.DebugMode {
		// ドライランでなく、かつConfigがドライランモードの場合に確認
		confirmApplyPrompt := promptui.Select{
			Label: "デバッグモードは本番処理では詳細ログを大量に出力します。続行しますか？",
			Items: []string{"はい、続行します", "いいえ、キャンセルします"},
		}

		_, confirm, err := confirmApplyPrompt.Run()
		if err != nil || confirm == "いいえ、キャンセルします" {
			fmt.Println("処理を中止しました。")
			os.Exit(0)
		}
	}

	// 処理実行前の最終確認
	fmt.Println("\n--- 最終確認 ---")
	fmt.Printf("選択されたディレクトリ: %d ディレクトリ\n", len(config.TargetDirs))
	
	// 合計ファイル数の計算
	var totalCamel, totalKebab, totalFiles int
	for _, dir := range config.TargetDirs {
		stats := structure.FileStats[dir]
		totalCamel += stats.CamelCaseCount
		totalKebab += stats.KebabCaseCount
		totalFiles += stats.TotalFiles
	}
	
	// 変換モードに応じて対象ファイル数を表示
	var targetFileCount int
	if config.ConversionDirection == "camel-to-kebab" {
		targetFileCount = totalCamel
		fmt.Printf("変換対象: %sキャメルケース%s → %sケバブケース%s (%d ファイル)\n", 
			colorYellow, colorReset, colorCyan, colorReset, targetFileCount)
	} else {
		targetFileCount = totalKebab
		fmt.Printf("変換対象: %sケバブケース%s → %sキャメルケース%s (%d ファイル)\n",
			colorCyan, colorReset, colorYellow, colorReset, targetFileCount)
	}
	
	// 合計ファイル数の表示（色付き）
	fmt.Printf("対象ディレクトリ: %d ディレクトリ [%sキャメル: %d%s, %sケバブ: %d%s, 合計: %d]\n",
		len(config.TargetDirs),
		colorYellow, totalCamel, colorReset,
		colorCyan, totalKebab, colorReset,
		totalFiles,
	)
	
	// 実行モードの表示
	if config.DryRun {
		fmt.Printf("実行モード: %sドライラン%s（ファイルは変更されません）\n", colorPurple, colorReset)
	} else {
		fmt.Printf("実行モード: %s本番処理%s（ファイルは実際に変更されます）\n", colorRed, colorReset)
	}
	
	// デバッグモードの表示
	if config.DebugMode {
		fmt.Printf("詳細表示: %sオン%s（詳細情報が表示されます）\n", colorGreen, colorReset)
	} else {
		fmt.Printf("詳細表示: %sオフ%s（簡易表示です）\n", colorYellow, colorReset)
	}
	
	// ユーザ確認
	confirmPrompt := promptui.Select{
		Label: "処理を実行しますか？",
		Items: []string{"実行する", "キャンセル"},
	}

	_, confirm, err := confirmPrompt.Run()
	if err != nil || confirm == "キャンセル" {
		fmt.Println("処理を中止しました。")
		os.Exit(0)
	}

	// 各ディレクトリに対してファイル処理を実行
	var totalFilesCount, totalProcessedCount, totalSkippedCount, totalErrorCount int
	var results []ConversionResult
	
	fmt.Println("\n=== ファイル処理を開始します ===")
	
	for _, dir := range config.TargetDirs {
		dirConfig := config
		dirConfig.TargetDir = dir
		result := processFiles(dirConfig)
		results = append(results, result)
		
		totalFilesCount += result.TotalFiles
		totalProcessedCount += result.ProcessedFiles
		totalSkippedCount += result.SkippedFiles
		totalErrorCount += result.ErrorFiles
	}
	
	// 処理の最終結果を表示
	fmt.Println("\n=== 最終処理結果 ===")
	fmt.Printf("処理したディレクトリ数: %d\n", len(config.TargetDirs))
	fmt.Printf("合計ファイル数: %s%d%s\n", colorCyan, totalFilesCount, colorReset)
	fmt.Printf("処理したファイル数: %s%d%s (%.1f%%)\n", 
		colorGreen, 
		totalProcessedCount, 
		colorReset,
		float64(totalProcessedCount) / float64(totalFilesCount) * 100,
	)
	fmt.Printf("スキップしたファイル数: %s%d%s (%.1f%%)\n", 
		colorYellow, 
		totalSkippedCount, 
		colorReset,
		float64(totalSkippedCount) / float64(totalFilesCount) * 100,
	)
	
	if totalErrorCount > 0 {
		fmt.Printf("エラーが発生したファイル数: %s%d%s (%.1f%%)\n", 
			colorRed, 
			totalErrorCount, 
			colorReset,
			float64(totalErrorCount) / float64(totalFilesCount) * 100,
		)
	} else {
		fmt.Printf("エラーが発生したファイル数: %s%d%s (0.0%%)\n", colorReset, totalErrorCount, colorReset)
	}
	
	// インポートパス更新の情報を表示
	var allImportUpdateFiles []string
	for _, result := range results {
		allImportUpdateFiles = append(allImportUpdateFiles, result.ImportUpdateFiles...)
	}
	
	// 重複を除去
	uniqueImportFiles := make(map[string]bool)
	for _, file := range allImportUpdateFiles {
		uniqueImportFiles[file] = true
	}
	
	// 結果をスライスに変換
	var uniqueImportUpdateFiles []string
	for file := range uniqueImportFiles {
		uniqueImportUpdateFiles = append(uniqueImportUpdateFiles, file)
	}
	
	if len(uniqueImportUpdateFiles) > 0 {
		fmt.Printf("インポートパス更新対象ファイル数: %s%d%s\n", 
			colorPurple, 
			len(uniqueImportUpdateFiles), 
			colorReset)
		
		// ドライランモードの場合、すべてのインポートパス更新対象ファイルを表示
		if config.DryRun {
			fmt.Println("\n--- インポートパス更新対象ファイル（すべてのディレクトリ） ---")
			for _, file := range uniqueImportUpdateFiles {
				fmt.Printf("  %s\n", file)
			}
		}
	}
	
	// 変換方向の情報を表示
	var directionInfo string
	if config.ConversionDirection == "camel-to-kebab" {
		directionInfo = fmt.Sprintf("%sキャメルケース%s → %sケバブケース%s", 
			colorBlue, colorReset, colorGreen, colorReset)
	} else {
		directionInfo = fmt.Sprintf("%sケバブケース%s → %sキャメルケース%s", 
			colorGreen, colorReset, colorBlue, colorReset)
	}
	fmt.Printf("変換方向: %s\n", directionInfo)
	
	// 実行モードの表示
	if config.DryRun {
		fmt.Printf("実行モード: %sドライラン%s（実際の変更は行われていません）\n", 
			colorPurple, colorReset)
	} else {
		fmt.Printf("実行モード: %s本番処理%s（変更が適用されました）\n", 
			colorGreen, colorReset)
	}
	
	fmt.Println("\n処理が完了しました！")
} 