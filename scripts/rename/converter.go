package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"
)

// インポート文の正規表現パターン
var importRegex = regexp.MustCompile(`(?m)^import\s+(?:{[^}]*}|[^{;]*)\s+from\s+['"]([^'"]+)['"]`)

// ファイル内のインポート文を解析して、除外対象かどうかを判断する
func shouldExcludeByImports(filePath string, excludeImportPatterns []string) (bool, string, error) {
	// _componentsディレクトリ内のファイルはインポートによる除外を適用しない
	if strings.Contains(filePath, "/_components/") || strings.Contains(filePath, "\\_components\\") {
		if strings.Contains(filePath, ".tsx") || strings.Contains(filePath, ".jsx") {
			return false, "", nil
		}
	}

	// ファイルの内容を読み込む
	content, err := os.ReadFile(filePath)
	if err != nil {
		return false, "", fmt.Errorf("ファイル読み込みエラー: %w", err)
	}

	// インポート文を抽出
	matches := importRegex.FindAllStringSubmatch(string(content), -1)
	
	// 各インポート文について、除外パターンと照合
	for _, match := range matches {
		if len(match) < 2 {
			continue
		}
		
		importPath := match[1]
		
		// 除外パターンと照合
		for _, pattern := range excludeImportPatterns {
			if strings.Contains(importPath, pattern) {
				return true, importPath, nil
			}
		}
	}
	
	return false, "", nil
}

// ファイル内の相対インポートパスを更新
func updateImportPaths(filePath, oldName, newName string, config Config) (bool, error) {
	content, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Printf("ファイル読み込みエラー (%s): %v\n", filePath, err)
		return false, err
	}

	// 変換前のインポートパスのパターンを作成
	// 例: './Component', '../common/Component', '../../Component'
	// 例: './component', '../common/component', '../../component'
	// 拡張子 .tsx や .jsx は含まない
	oldImportPattern := fmt.Sprintf(`(from\s+['\"])([.]{1,2}/)?([^'\"]*/)?%s(['\"])`, regexp.QuoteMeta(oldName))
	re := regexp.MustCompile(oldImportPattern)

	newContent := string(content)
	if re.MatchString(newContent) {
		fmt.Printf("  ファイル %s 内のインポートパスを更新中 (%s -> %s)\n", filepath.Base(filePath), oldName, newName)
		// 置換後のパスを作成 (拡張子は含めない)
		// 最初のキャプチャグループ (from './ など)、2番目 (../ など)、3番目 (ディレクトリパス) はそのまま維持
		newImportPathFragment := fmt.Sprintf("${1}${2}${3}%s${4}", newName)
		newContent = re.ReplaceAllString(newContent, newImportPathFragment)
	}

	// index ファイルからのインポートも考慮 (例: from '../common')
	// 変換前が common/Button.tsx -> 変換後が common/button.tsx の場合
	// from '../common/Button' -> from '../common/button'
	// from '../common' (Button を export している場合) は、この関数では直接扱わない。
	// index ファイルのリネームが必要な場合は別途対応。

	// ディレクトリ名の変更も考慮 (例: features/UserProfile -> features/user-profile)
	// TODO: ディレクトリ名自体の変換が必要な場合のインポートパス更新ロジックを追加

	if newContent != string(content) {
		if !config.DryRun {
			err = os.WriteFile(filePath, []byte(newContent), 0644)
			if err != nil {
				fmt.Printf("ファイル書き込みエラー (%s): %v\n", filePath, err)
				return false, err
			}
		} else {
			fmt.Printf("  - インポートパスの更新予定: %s\n", filePath)
		}
		return true, nil
	}
	return false, nil
}

// ファイル名の変換を処理
func processFileName(filePath string, config Config) (*ConversionResult, error) {
	// ファイル名のみを取得
	dir, fileName := filepath.Split(filePath)
	fileExt := filepath.Ext(fileName)
	baseName := fileName[:len(fileName)-len(fileExt)]

	// 特定のパターンに一致するファイルは除外
	for _, pattern := range config.ExcludePatterns {
		if strings.Contains(fileName, pattern) {
			if config.DebugMode {
				fmt.Printf("スキップ: %s (除外パターンに一致: %s)\n", filePath, pattern)
			} else {
				fmt.Printf("スキップ: %s\n", filePath)
			}
			return nil, fmt.Errorf("除外パターンに一致しました")
		}
	}

	// 変換方向に基づいて処理
	var newBaseName string
	if config.ConversionDirection == "camel-to-kebab" {
		// キャメルケースを確認
		if !isCamelCase(baseName) {
			if config.DebugMode {
				fmt.Printf("スキップ: %s (キャメルケースではない - 先頭は大文字ではないか、特殊文字を含むため)\n", filePath)
				fmt.Printf("  ファイル名: %s, 先頭文字: %c\n", baseName, baseName[0])
				if strings.Contains(baseName, "-") {
					fmt.Printf("  ハイフン(-) を含んでいます\n")
				}
				if strings.Contains(baseName, "_") {
					fmt.Printf("  アンダースコア(_) を含んでいます\n")
				}
			} else {
				fmt.Printf("スキップ: %s\n", filePath)
			}
			return nil, fmt.Errorf("キャメルケースではありません")
		}
		
		// キャメルケースからケバブケースへ変換
		newBaseName = camelToKebab(baseName)
		
		// デバッグモードでの表示
		if config.DebugMode {
			fmt.Printf("処理: %s (キャメルケース → ケバブケース: %s → %s)\n", filePath, baseName, newBaseName)
		} else {
			fmt.Printf("処理: %s\n", filePath)
		}
	} else {
		// ケバブケースを確認
		if !isKebabCase(baseName) {
			if config.DebugMode {
				fmt.Printf("スキップ: %s (ケバブケースではない - 小文字とハイフンのみではないため)\n", filePath)
				nonKebabChars := []rune{}
				for _, c := range baseName {
					if !((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '-') {
						nonKebabChars = append(nonKebabChars, c)
					}
				}
				if len(nonKebabChars) > 0 {
					fmt.Printf("  ケバブケースに適合しない文字: %v\n", string(nonKebabChars))
				}
			} else {
				fmt.Printf("スキップ: %s\n", filePath)
			}
			return nil, fmt.Errorf("ケバブケースではありません")
		}
		
		// ケバブケースからキャメルケースへ変換
		newBaseName = kebabToCamel(baseName)
		
		// デバッグモードでの表示
		if config.DebugMode {
			fmt.Printf("処理: %s (ケバブケース → キャメルケース: %s → %s)\n", filePath, baseName, newBaseName)
		} else {
			fmt.Printf("処理: %s\n", filePath)
		}
	}

	// 新しいファイル名を生成
	newFileName := newBaseName + fileExt
	newFilePath := filepath.Join(dir, newFileName)

	// ファイルが既に存在する場合は処理をスキップ
	if _, err := os.Stat(newFilePath); err == nil && newFilePath != filePath {
		if config.DebugMode {
			fmt.Printf("スキップ: %s (変換後のファイル %s は既に存在します)\n", filePath, newFilePath)
		} else {
			fmt.Printf("スキップ: %s\n", filePath)
		}
		return nil, fmt.Errorf("変換後のファイルは既に存在します")
	}

	// 結果オブジェクトを作成
	result := &ConversionResult{
		OldPath:     filePath,
		NewPath:     newFilePath,
		OldBaseName: baseName,
		NewBaseName: newBaseName,
	}

	return result, nil
}

// 再帰的にディレクトリを走査してTypeScriptReactファイルを取得
func findTsxJsxFiles(rootDir string, config Config) ([]string, error) {
	var files []string

	err := filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			base := filepath.Base(path)
			// 明示的に除外されたディレクトリのみをスキップ（基本的な除外ディレクトリ）
			if isExcludedDir(base) {
				if config.DebugMode {
					fmt.Printf("除外: %s はシステム除外ディレクトリです\n", path)
				}
				return filepath.SkipDir
			}
			
			// config.ExcludeDirectoriesに含まれるディレクトリも除外
			for _, excludeDir := range config.ExcludeDirectories {
				if base == excludeDir {
					if config.DebugMode {
						fmt.Printf("除外: %s は構成ファイルで指定された除外ディレクトリです\n", path)
					}
					return filepath.SkipDir
				}
			}
			
			return nil
		}

		ext := filepath.Ext(path)
		if ext == ".tsx" || ext == ".jsx" {
			files = append(files, path)
		}
		return nil
	})

	return files, err
}

// processDirComponent はディレクトリ型コンポーネント（Button/index.tsx）を処理します
func processDirComponent(dirPath string, config Config) (*ConversionResult, error) {
	// ディレクトリ名を取得
	dir, dirName := filepath.Split(strings.TrimSuffix(dirPath, "/"))
	
	// .tsx か .jsx のどちらかが存在するか確認
	tsxPath := filepath.Join(dirPath, "index.tsx")
	jsxPath := filepath.Join(dirPath, "index.jsx")
	
	if _, err := os.Stat(tsxPath); err == nil {
		// index.tsx が存在する
	} else if _, err := os.Stat(jsxPath); err == nil {
		// index.jsx が存在する
	} else {
		return nil, fmt.Errorf("index.tsx/jsx ファイルが見つかりません")
	}
	
	// 特定のパターンに一致するディレクトリは除外
	for _, pattern := range config.ExcludePatterns {
		if strings.Contains(dirName, pattern) {
			if config.DebugMode {
				fmt.Printf("スキップ: %s (除外パターンに一致)\n", dirPath)
			} else {
				fmt.Printf("スキップ: %s\n", dirPath)
			}
			return nil, fmt.Errorf("除外パターンに一致しました")
		}
	}

	// 変換方向に基づいて処理
	var newDirName string
	if config.ConversionDirection == "camel-to-kebab" {
		// キャメルケースを確認
		if !isCamelCase(dirName) {
			if config.DebugMode {
				fmt.Printf("スキップ: %s (キャメルケースではない)\n", dirPath)
			} else {
				fmt.Printf("スキップ: %s\n", dirPath)
			}
			return nil, fmt.Errorf("キャメルケースではありません")
		}
		
		// キャメルケースからケバブケースへ変換
		newDirName = camelToKebab(dirName)
		
		// デバッグモードでの表示
		if config.DebugMode {
			fmt.Printf("処理: %s (キャメルケース → ケバブケース)\n", dirPath)
		} else {
			fmt.Printf("処理: %s\n", dirPath)
		}
	} else {
		// ケバブケースを確認
		if !isKebabCase(dirName) {
			if config.DebugMode {
				fmt.Printf("スキップ: %s (ケバブケースではない)\n", dirPath)
			} else {
				fmt.Printf("スキップ: %s\n", dirPath)
			}
			return nil, fmt.Errorf("ケバブケースではありません")
		}
		
		// ケバブケースからキャメルケースへ変換
		newDirName = kebabToCamel(dirName)
		
		// デバッグモードでの表示
		if config.DebugMode {
			fmt.Printf("処理: %s (ケバブケース → キャメルケース)\n", dirPath)
		} else {
			fmt.Printf("処理: %s\n", dirPath)
		}
	}

	// 新しいディレクトリパスを生成
	newDirPath := filepath.Join(dir, newDirName)
	
	// ディレクトリが既に存在する場合は処理をスキップ
	if _, err := os.Stat(newDirPath); err == nil && newDirPath != dirPath {
		if config.DebugMode {
			fmt.Printf("スキップ: %s (変換後のディレクトリ %s は既に存在します)\n", dirPath, newDirPath)
		} else {
			fmt.Printf("スキップ: %s\n", dirPath)
		}
		return nil, fmt.Errorf("変換後のディレクトリは既に存在します")
	}

	// 結果オブジェクトを作成
	result := &ConversionResult{
		OldPath:     dirPath,
		NewPath:     newDirPath,
		OldBaseName: dirName,
		NewBaseName: newDirName,
	}

	return result, nil
}

// findDirectoryComponents は指定されたディレクトリ内のディレクトリ型コンポーネントを検索します
func findDirectoryComponents(rootDir string, config Config) ([]string, error) {
	var dirComponents []string

	err := filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() {
			// ファイルがindex.tsxまたはindex.jsxの場合、親ディレクトリをコンポーネントとして扱う
			if filepath.Base(path) == "index.tsx" || filepath.Base(path) == "index.jsx" {
				parentDir := filepath.Dir(path)
				// 既に追加されていなければリストに追加
				if !contains(dirComponents, parentDir) {
					dirComponents = append(dirComponents, parentDir)
				}
			}
			return nil
		}

		// 明示的に除外されたディレクトリのみをスキップ
		base := filepath.Base(path)
		if isExcludedDir(base) {
			if config.DebugMode {
				fmt.Printf("除外: %s はシステム除外ディレクトリです\n", path)
			}
			return filepath.SkipDir
		}
		
		// config.ExcludeDirectoriesに含まれるディレクトリも除外
		for _, excludeDir := range config.ExcludeDirectories {
			if base == excludeDir {
				if config.DebugMode {
					fmt.Printf("除外: %s は構成ファイルで指定された除外ディレクトリです\n", path)
				}
				return filepath.SkipDir
			}
		}
		
		return nil
	})

	return dirComponents, err
}

// ファイル処理の実行
func processFiles(config Config) ConversionResult {
	fmt.Printf("\n=== %s のファイル処理を開始します ===\n", config.TargetDir)

	// プロジェクトルートを検出
	projectRoot, err := findProjectRoot()
	if err != nil {
		fmt.Printf("エラー: プロジェクトルートの検出に失敗しました: %v\n", err)
		return ConversionResult{}
	}

	// 対象ディレクトリの絶対パスを生成
	fullTargetDir := filepath.Join(projectRoot, config.TargetDir)
	fmt.Printf("対象ディレクトリ: %s\n", fullTargetDir)

	// 変換結果
	conversionResult := ConversionResult{
		TargetDir: config.TargetDir,
	}

	// 処理結果の詳細
	var results []ConversionResult
	var errorFiles []string

	// ディレクトリ内の.tsx/.jsxファイルを検索
	files, err := findTsxJsxFiles(fullTargetDir, config)
	if err != nil {
		fmt.Printf("エラー: ファイル検索中にエラーが発生しました: %v\n", err)
		return conversionResult
	}
	
	// ディレクトリ型コンポーネントも検索
	dirComponents, err := findDirectoryComponents(fullTargetDir, config)
	if err != nil {
		fmt.Printf("エラー: ディレクトリ型コンポーネント検索中にエラーが発生しました: %v\n", err)
	} else {
		fmt.Printf("ディレクトリ型コンポーネント: %d 個検出\n", len(dirComponents))
	}

	conversionResult.TotalFiles = len(files) + len(dirComponents)
	if conversionResult.TotalFiles == 0 {
		fmt.Println("変換対象のファイルが見つかりませんでした。")
		return conversionResult
	}

	// 各ファイルを処理
	for _, file := range files {
		baseName := filepath.Base(file)
		
		// index.tsxファイルはスキップ（ディレクトリ型コンポーネントで処理する）
		if baseName == "index.tsx" || baseName == "index.jsx" {
			continue
		}

		// 除外パターンに一致するファイルはスキップ
		shouldExclude := false
		for _, pattern := range config.ExcludePatterns {
			if strings.Contains(baseName, pattern) {
				shouldExclude = true
				break
			}
		}

		if shouldExclude {
			if config.DebugMode {
				fmt.Printf("スキップ: %s (除外パターンに一致)\n", baseName)
			} else {
				fmt.Printf("スキップ: %s\n", baseName)
			}
			conversionResult.SkippedFiles++
			continue
		}

		// インポートパスによる除外
		if len(config.ExcludeImportPatterns) > 0 {
			shouldExcludeImport, importPath, err := shouldExcludeByImports(file, config.ExcludeImportPatterns)
			if err != nil {
				fmt.Printf("警告: インポート解析中にエラーが発生しました: %v\n", err)
			} else if shouldExcludeImport {
				if config.DebugMode {
					fmt.Printf("スキップ: %s (除外インポートパスに一致: %s)\n", baseName, importPath)
				} else {
					fmt.Printf("スキップ: %s\n", baseName)
				}
				conversionResult.SkippedFiles++
				continue
			}
		}

		// ファイル名の変換処理
		result, err := processFileName(file, config)
		if err != nil {
			if config.DebugMode {
				fmt.Printf("スキップ: %s (変換の必要なし): %v\n", baseName, err)
			} else {
				fmt.Printf("スキップ: %s\n", baseName)
			}
			conversionResult.SkippedFiles++
			continue
		}

		// 変換結果を表示
		fmt.Printf("変換: %s -> %s\n", baseName, filepath.Base(result.NewPath))
		
		// ドライランモードでなければ実際にファイルをリネーム
		if !config.DryRun {
			err = os.Rename(result.OldPath, result.NewPath)
			if err != nil {
				fmt.Printf("エラー: ファイル %s の名前変更中にエラーが発生しました: %v\n", baseName, err)
				conversionResult.ErrorFiles++
				errorFiles = append(errorFiles, fmt.Sprintf("%s: リネーム失敗 - %v", baseName, err))
				continue
			}
		}

		results = append(results, *result)
		conversionResult.ProcessedFiles++
	}
	
	// ディレクトリ型コンポーネントを処理
	for _, dirPath := range dirComponents {
		dirName := filepath.Base(dirPath)
		
		// ディレクトリ名の変換処理
		result, err := processDirComponent(dirPath, config)
		if err != nil {
			if config.DebugMode {
				fmt.Printf("スキップ: %s (変換の必要なし): %v\n", dirName, err)
			} else {
				fmt.Printf("スキップ: %s/\n", dirName)
			}
			conversionResult.SkippedFiles++
			continue
		}

		// 変換結果を表示
		fmt.Printf("変換 (ディレクトリ): %s/ -> %s/\n", dirName, result.NewBaseName)
		
		// ドライランモードでなければ実際にディレクトリをリネーム
		if !config.DryRun {
			// ディレクトリのリネームはファイルの移動よりも複雑
			// 一時的なディレクトリ名を使って、二段階で移動することで名前の衝突を回避
			tempDir := filepath.Join(filepath.Dir(dirPath), fmt.Sprintf("_temp_%s_%d", dirName, time.Now().UnixNano()))
			
			// まず一時ディレクトリへ移動
			err = os.Rename(dirPath, tempDir)
			if err != nil {
				fmt.Printf("エラー: ディレクトリ %s/ の名前変更中にエラーが発生しました: %v\n", dirName, err)
				conversionResult.ErrorFiles++
				errorFiles = append(errorFiles, fmt.Sprintf("%s/: リネーム失敗 - %v", dirName, err))
				continue
			}
			
			// 目的のディレクトリ名に移動
			err = os.Rename(tempDir, result.NewPath)
			if err != nil {
				// 失敗したら元に戻す
				os.Rename(tempDir, dirPath)
				fmt.Printf("エラー: ディレクトリ %s/ の名前変更中にエラーが発生しました: %v\n", dirName, err)
				conversionResult.ErrorFiles++
				errorFiles = append(errorFiles, fmt.Sprintf("%s/: リネーム失敗 - %v", dirName, err))
				continue
			}
		}

		results = append(results, *result)
		conversionResult.ProcessedFiles++
	}

	// インポートパスの更新
	if len(results) > 0 {
		fmt.Println("\n--- インポートパスの更新 ---")

		// プロジェクト内の全TSX/JSXファイルを検索（インポートパスの更新用）
		projectDirForImports := filepath.Join(projectRoot, filepath.Dir(config.TargetDir))
		projectFiles, err := findTsxJsxFiles(projectDirForImports, config)
		if err != nil {
			fmt.Printf("インポートパス更新用のファイル検索中にエラーが発生しました: %v\n", err)
		} else {
			uniqueImportUpdateFiles := make(map[string]bool)
			
			// 各ファイルのインポートパスを更新
			for _, file := range projectFiles {
				// ファイル内の各変換対象のインポートパスを更新
				for _, result := range results {
					needsUpdate, _ := updateImportPaths(file, result.OldBaseName, result.NewBaseName, config)
					if needsUpdate {
						uniqueImportUpdateFiles[file] = true
					}
				}
			}
			
			// 重複を除いたインポートパス更新対象ファイルをリストに追加
			for file := range uniqueImportUpdateFiles {
				conversionResult.ImportUpdateFiles = append(conversionResult.ImportUpdateFiles, file)
			}
		}
	}

	// 処理結果の表示
	fmt.Println("\n--- 処理結果 ---")
	fmt.Printf("合計ファイル数: %d\n", conversionResult.TotalFiles)
	fmt.Printf("処理したファイル数: %d\n", conversionResult.ProcessedFiles)
	fmt.Printf("スキップしたファイル数: %d\n", conversionResult.SkippedFiles)
	fmt.Printf("エラーが発生したファイル数: %d\n", conversionResult.ErrorFiles)
	
	// インポートパス更新対象ファイルの表示
	if len(conversionResult.ImportUpdateFiles) > 0 {
		fmt.Printf("インポートパスの更新対象ファイル数: %d\n", len(conversionResult.ImportUpdateFiles))
		
		if config.DryRun && config.DebugMode {
			fmt.Println("\n--- インポートパス更新対象ファイル ---")
			for _, file := range conversionResult.ImportUpdateFiles {
				fmt.Printf("  %s\n", file)
			}
		}
	}

	// エラーファイルがあれば表示
	if len(errorFiles) > 0 {
		fmt.Println("\n--- エラーが発生したファイル ---")
		for _, errFile := range errorFiles {
			fmt.Println(errFile)
		}
	}

	return conversionResult
} 
