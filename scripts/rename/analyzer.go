package main

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/manifoldco/promptui"
)

// findProjectRootFunc はプロジェクトルートを見つける関数の型定義
type findProjectRootFunc func() (string, error)

// プロジェクトルートディレクトリを探す関数
var findProjectRoot findProjectRootFunc = func() (string, error) {
	// 現在のディレクトリから始めて上位ディレクトリを調べる
	currentDir, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("現在のディレクトリの取得に失敗しました: %v", err)
	}

	// カレントディレクトリが既にプロジェクトルートである可能性も考慮
	if hasProjectRootMarkers(currentDir) {
		return currentDir, nil
	}

	// 親ディレクトリをチェック
	for {
		parentDir := filepath.Dir(currentDir)
		if parentDir == currentDir {
			// これ以上上位ディレクトリがない
			return "", fmt.Errorf("プロジェクトルートが見つかりませんでした")
		}

		currentDir = parentDir
		if hasProjectRootMarkers(currentDir) {
			return currentDir, nil
		}
	}
}

// プロジェクトルートかどうかを判断するヘルパー関数
func hasProjectRootMarkers(dir string) bool {
	// プロジェクトルートを判断するマーカー
	markers := []string{
		filepath.Join(dir, "apps"),
		filepath.Join(dir, "packages"),
		filepath.Join(dir, "package.json"),
	}

	for _, marker := range markers {
		if _, err := os.Stat(marker); err == nil {
			return true
		}
	}
	return false
}

// プロジェクト構造を分析
func analyzeProjectStructure(projectRoot string) (*ProjectStructure, error) {
	if projectRoot == "" {
		var err error
		projectRoot, err = findProjectRoot()
		if err != nil {
			return nil, fmt.Errorf("プロジェクトルートの検出に失敗しました: %w", err)
		}
	}
	fmt.Printf("プロジェクトルートを検出しました: %s\n", projectRoot)

	// 元のディレクトリを保存し、プロジェクトルートに移動
	originalDir, err := os.Getwd()
	if err != nil {
		return nil, fmt.Errorf("現在のディレクトリの取得に失敗しました: %w", err)
	}
	defer func() {
		if err := os.Chdir(originalDir); err != nil {
			fmt.Printf("元のディレクトリへの復帰に失敗しました: %v\n", err)
		}
	}()
	if err := os.Chdir(projectRoot); err != nil {
		return nil, fmt.Errorf("プロジェクトルートへの移動に失敗しました: %w", err)
	}

	// ルートタイプに基づいてディレクトリをスキャン (findProjectRootの結果を直接使用)
	rootType, err := determineRootType(projectRoot) // findProjectRoot内部で決定されたタイプを取得するヘルパー関数が必要になるかも
	if err != nil {
		return nil, fmt.Errorf("ルートタイプの特定に失敗しました: %w", err)
	}

	dirs, err := scanDirectories(rootType)
	if err != nil {
		return nil, fmt.Errorf("ディレクトリのスキャンに失敗しました: %w", err)
	}
	if len(dirs) == 0 {
		fmt.Println("変換対象のディレクトリが見つかりませんでした。")
		// エラーではなく、空の構造体を返すことも検討
		return &ProjectStructure{RootType: rootType, Directories: []string{}, FileStats: map[string]FileStatistics{}}, nil
	}

	fileStats := make(map[string]FileStatistics)
	for _, dir := range dirs {
		stats := analyzeFiles(dir) // analyzeFilesはエラーを返さないので、エラーチェックは不要
		fileStats[dir] = stats
	}

	return &ProjectStructure{
		RootType:    rootType,
		Directories: dirs,
		FileStats:   fileStats,
	}, nil
}

// ルートタイプの選択プロンプト
func promptRootType() (string, error) {
	prompt := promptui.Select{
		Label: "検索対象を選択してください",
		Items: []string{"apps", "packages", "both"},
	}

	_, result, err := prompt.Run()
	if err != nil {
		return "", err
	}

	return result, nil
}

// ディレクトリをスキャン
func scanDirectories(rootType string) ([]string, error) {
	var dirs []string
	uniqueDirsMap := make(map[string]bool)
	projectRoot, err := os.Getwd() // analyzeProjectStructureで既に移動済みのはず
	if err != nil {
		return nil, fmt.Errorf("現在のディレクトリの取得に失敗しました: %w", err)
	}
	fmt.Printf("検索開始: rootType = %s, projectRoot = %s\n", rootType, projectRoot)

	searchPrefixes := []string{}
	if rootType == "apps" || rootType == "apps/packages" {
		searchPrefixes = append(searchPrefixes, "apps")
	}
	if rootType == "packages" || rootType == "apps/packages" {
		searchPrefixes = append(searchPrefixes, "packages")
	}

	for _, prefix := range searchPrefixes {
		searchPath := filepath.Join(projectRoot, prefix)
		fmt.Printf("Walking path: %s\n", searchPath)
		err := filepath.Walk(searchPath, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				// ディレクトリが存在しない等のエラーは無視して探索を続ける
				if os.IsNotExist(err) {
					return nil
				}
				fmt.Printf("filepath.Walk でエラーが発生しました (%s): %v\n", path, err)
				return err // その他のエラーは処理を中断
			}

			if info.IsDir() {
				// 除外対象ディレクトリはスキップ
				if isExcludedDir(info.Name()) {
					return filepath.SkipDir
				}
				
				// 相対パスを取得
				relPath, err := filepath.Rel(projectRoot, path)
				if err != nil {
					fmt.Printf("相対パスの取得に失敗しました (%s): %v\n", path, err)
					return err
				}

				// パターンマッチングを行う
				isTargetDir := false
				
				// 従来の components ディレクトリチェック
				if info.Name() == "components" || strings.HasSuffix(path, "/components") {
					isTargetDir = true
				}
				
				// apps/*/app パターンチェック
				if strings.HasPrefix(relPath, "apps/") && strings.HasSuffix(relPath, "/app") {
					parts := strings.Split(relPath, "/")
					if len(parts) == 3 && parts[2] == "app" {
						isTargetDir = true
					}
				}
				
				// packages/ui/src パターンチェック
				if relPath == "packages/ui/src" {
					isTargetDir = true
				}
				
				// Next.js の特殊ディレクトリチェック (除外リストに含まれない限り対象にする)
				// app/*, pages/* など
				if strings.HasSuffix(relPath, "/app") || 
				   strings.HasSuffix(relPath, "/pages") || 
				   strings.Contains(relPath, "/app/") || 
				   strings.Contains(relPath, "/pages/") {
					isExcluded := false
					for _, pattern := range getDefaultExcludePatterns() {
						if strings.Contains(relPath, pattern) {
							isExcluded = true
							break
						}
					}
					if !isExcluded {
						isTargetDir = true
					}
				}
				
				// components、features、libs などの一般的なディレクトリも対象に
				if strings.Contains(relPath, "/components/") || 
				   strings.Contains(relPath, "/features/") || 
				   strings.Contains(relPath, "/libs/") || 
				   strings.Contains(relPath, "/utils/") || 
				   strings.Contains(relPath, "/hooks/") {
					isTargetDir = true
				}

				if isTargetDir {
					// ディレクトリ内に .tsx または .jsx ファイルがあるか確認
					files, _ := os.ReadDir(path)
					containsTsxJsx := false
					for _, f := range files {
						if !f.IsDir() && (strings.HasSuffix(f.Name(), ".tsx") || strings.HasSuffix(f.Name(), ".jsx")) {
							containsTsxJsx = true
							break
						}
					}

					if containsTsxJsx {
						if !uniqueDirsMap[relPath] {
							dirs = append(dirs, relPath)
							uniqueDirsMap[relPath] = true
							fmt.Printf("ディレクトリを追加: %s\n", relPath)
						}
					}
				}
			}
			return nil
		})
		if err != nil {
			fmt.Printf("ディレクトリ %s の探索中にエラー: %v\n", searchPath, err)
			// エラーが発生しても、他のプレフィックスの探索は続ける
			continue
		}
	}

	if len(dirs) == 0 {
		fmt.Println("警告: 対象ディレクトリが見つかりませんでした")
	}

	// パスをソートして返す (テストの安定性のため)
	sort.Strings(dirs)

	// 親子関係のあるディレクトリを除外する
	// 例: apps/web/app が対象なら apps/web/app/components は除外する
	dirs = removeChildDirectories(dirs)

	return dirs, nil
}

// 親ディレクトリが既に含まれる場合に子ディレクトリを除外する関数
func removeChildDirectories(directories []string) []string {
	if len(directories) <= 1 {
		return directories
	}

	// 長さでソートして短いパス（親になる可能性が高い）を先に処理
	sort.Slice(directories, func(i, j int) bool {
		return len(directories[i]) < len(directories[j])
	})

	// 除外されないディレクトリを保持する
	result := []string{}
	
	for i, dir := range directories {
		isChild := false
		
		// 現在のディレクトリが他のディレクトリの子ディレクトリかチェック
		for j, parentCandidate := range directories {
			// 同じディレクトリはスキップ
			if i == j {
				continue
			}
			
			// dirがparentCandidateの子ディレクトリかどうかをチェック
			// 例: dir="apps/web/app/components", parentCandidate="apps/web/app"
			if strings.HasPrefix(dir, parentCandidate+"/") {
				isChild = true
				fmt.Printf("除外: %s は %s の子ディレクトリです\n", dir, parentCandidate)
				break
			}
		}
		
		if !isChild {
			result = append(result, dir)
		}
	}
	
	// 結果をオリジナルの順序に戻すためにソート
	sort.Strings(result)
	
	return result
}

// ファイル統計を収集
func collectFileStatistics(dirs []string) map[string]FileStatistics {
	stats := make(map[string]FileStatistics)
	for _, dir := range dirs {
		stats[dir] = analyzeFiles(dir)
	}
	return stats
}

// ディレクトリ内のファイルを分析
func analyzeFiles(dir string) FileStatistics {
	stats := FileStatistics{
		FilePaths: make([]string, 0),
	}
	
	fmt.Printf("ディレクトリ分析中: %s\n", dir)

	projectRoot, err := findProjectRoot()
	if err != nil {
		fmt.Printf("警告: プロジェクトルートの検出に失敗しました: %v\n", err)
		return stats
	}

	fullPath := filepath.Join(projectRoot, dir)
	
	// indexファイルとそのディレクトリ名を保存するためのマップ
	indexFiles := make(map[string]string)
	
	// 第一段階: 全ファイルを走査してindexファイルを見つける
	err = filepath.Walk(fullPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Printf("警告: %s の走査中にエラー: %v\n", path, err)
			return nil
		}
		
		if info.IsDir() {
			if isExcludedDir(info.Name()) {
				return filepath.SkipDir
			}
			return nil
		}
		
		// index.tsx または index.jsx ファイルを処理
		if info.Name() == "index.tsx" || info.Name() == "index.jsx" {
			// ディレクトリ名を取得
			dirName := filepath.Base(filepath.Dir(path))
			indexFiles[path] = dirName
		}
		
		if strings.HasSuffix(path, ".tsx") || strings.HasSuffix(path, ".jsx") {
			stats.TotalFiles++
			stats.FilePaths = append(stats.FilePaths, path)
			
			// 通常のファイル（index.tsxではない）を処理
			if filepath.Base(path) != "index.tsx" && filepath.Base(path) != "index.jsx" {
				baseName := filepath.Base(path)
				baseName = strings.TrimSuffix(baseName, filepath.Ext(path))
				
				if isKebabCase(baseName) {
					stats.KebabCaseCount++
					fmt.Printf("  ケバブケース検出: %s\n", baseName)
				} else if isCamelCase(baseName) {
					stats.CamelCaseCount++
					fmt.Printf("  キャメルケース検出: %s\n", baseName)
				} else {
					fmt.Printf("  その他の形式: %s\n", baseName)
				}
			}
		}
		
		return nil
	})
	
	// 第二段階: ディレクトリ型コンポーネントの処理
	for path, dirName := range indexFiles {
		fmt.Printf("  ディレクトリ型コンポーネント検出: %s (%s)\n", dirName, path)
		
		if isKebabCase(dirName) {
			stats.KebabCaseCount++
			fmt.Printf("  ケバブケース検出 (ディレクトリ): %s\n", dirName)
		} else if isCamelCase(dirName) {
			stats.CamelCaseCount++
			fmt.Printf("  キャメルケース検出 (ディレクトリ): %s\n", dirName)
		} else {
			fmt.Printf("  その他の形式 (ディレクトリ): %s\n", dirName)
		}
	}
	
	if err != nil {
		fmt.Printf("警告: ディレクトリ %s の分析中にエラー: %v\n", dir, err)
	}
	
	return stats
}

// 統計情報を表示
func displayProjectStatistics(structure *ProjectStructure) {
	fmt.Println("\n検出されたディレクトリ構造:")
	
	var totalCamel, totalKebab int
	
	for dir, stats := range structure.FileStats {
		fmt.Printf("\n%s/\n", dir)
		fmt.Printf("  合計ファイル数: %d\n", stats.TotalFiles)
		fmt.Printf("  - キャメルケース: %d ファイル\n", stats.CamelCaseCount)
		fmt.Printf("  - ケバブケース: %d ファイル\n", stats.KebabCaseCount)
		
		totalCamel += stats.CamelCaseCount
		totalKebab += stats.KebabCaseCount
	}

	fmt.Printf("\n全体の統計:\n")
	fmt.Printf("- キャメルケース: %d ファイル\n", totalCamel)
	fmt.Printf("- ケバブケース: %d ファイル\n", totalKebab)
	fmt.Printf("- 合計: %d ファイル\n", totalCamel+totalKebab)
}

// determineRootType は検出されたルートに基づいてタイプを決定します (analyzeProjectStructureで使用)
func determineRootType(projectRoot string) (string, error) {
	appsExists, _ := dirExists(filepath.Join(projectRoot, "apps"))
	packagesExists, _ := dirExists(filepath.Join(projectRoot, "packages"))

	if appsExists && packagesExists {
		return "apps/packages", nil
	} else if appsExists {
		return "apps", nil
	} else if packagesExists {
		return "packages", nil
	} else {
		// 通常 findProjectRoot で検出されるため、ここには到達しないはず
		return "", fmt.Errorf("apps または packages ディレクトリが見つかりません")
	}
}

// dirExists はディレクトリが存在するか確認します
func dirExists(path string) (bool, error) {
	info, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false, nil
	} else if err != nil {
		return false, err
	}
	return info.IsDir(), nil
} 