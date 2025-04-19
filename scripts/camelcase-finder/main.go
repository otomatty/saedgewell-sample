package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// 特殊な大文字略語のマップ（すべて大文字で定義）
var upperCaseAcronyms = map[string]bool{
	"API":   true,
	"FAQ":   true,
	"UI":    true,
	"ID":    true,
	"URL":   true,
	"SDK":   true,
	"CSS":   true,
	"HTML":  true,
	"HTTP":  true,
	"HTTPS": true,
	"JSON":  true,
	"XML":   true,
	"JWT":   true,
	"SEO":   true,
	"DX":    true,
	"AI":    true,
}

// 検出結果を格納する構造体
type FileResult struct {
	Path     string
	FileName string
	IsDir    bool
}

// メイン関数
func main() {
	// コマンドライン引数の解析
	rootDir := flag.String("dir", ".", "検索を開始するルートディレクトリ")
	outputFile := flag.String("output", "", "結果を出力するファイル（指定しない場合は標準出力）")
	verbose := flag.Bool("verbose", false, "詳細なログを出力するかどうか")
	targetApps := flag.Bool("apps-only", false, "apps/パッケージディレクトリのみを検索する")
	flag.Parse()

	// プロジェクトルートの検出
	projectRoot, err := findProjectRoot()
	if err != nil {
		fmt.Printf("警告: プロジェクトルートの検出に失敗しました: %v\n", err)
		projectRoot = *rootDir
	}

	fmt.Printf("プロジェクトルート: %s\n", projectRoot)
	fmt.Printf("検索対象ディレクトリ: %s\n", *rootDir)

	// 検索対象ディレクトリの完全パスを取得
	searchDir := filepath.Join(projectRoot, *rootDir)
	fmt.Printf("検索パス: %s\n\n", searchDir)

	// キャメルケースファイルの検出（変換条件を更新）
	results := findCamelCaseFiles(searchDir, *verbose, *targetApps)

	// 結果の出力
	if *outputFile != "" {
		// ファイルに出力
		file, err := os.Create(*outputFile)
		if err != nil {
			fmt.Printf("エラー: 出力ファイルの作成に失敗しました: %v\n", err)
			os.Exit(1)
		}
		defer file.Close()

		fmt.Fprintf(file, "検出されたキャメルケースファイル一覧\n")
		fmt.Fprintf(file, "==============================\n\n")
		
		for _, result := range results {
			if result.IsDir {
				fmt.Fprintf(file, "[DIR] %s (%s)\n", result.FileName, result.Path)
			} else {
				fmt.Fprintf(file, "[FILE] %s (%s)\n", result.FileName, result.Path)
			}
		}

		fmt.Printf("検出結果を %s に出力しました。合計: %d 件\n", *outputFile, len(results))
	} else {
		// 標準出力に表示
		fmt.Printf("検出されたキャメルケースファイル一覧\n")
		fmt.Printf("==============================\n\n")
		
		for _, result := range results {
			if result.IsDir {
				fmt.Printf("[DIR] %s (%s)\n", result.FileName, result.Path)
			} else {
				fmt.Printf("[FILE] %s (%s)\n", result.FileName, result.Path)
			}
		}

		fmt.Printf("\n合計: %d 件のキャメルケースファイルが見つかりました\n", len(results))
	}
}

// キャメルケースファイルを検出する関数（変換条件を見直し）
func findCamelCaseFiles(rootDir string, verbose bool, appsOnly bool) []FileResult {
	var results []FileResult
	totalFiles := 0

	// ディレクトリの走査
	err := filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Printf("警告: %s の走査中にエラー: %v\n", path, err)
			return nil
		}

		// apps/ディレクトリだけを検索する場合
		if appsOnly && !strings.Contains(path, "/apps/") && !strings.Contains(path, "/packages/") {
			if info.IsDir() && (strings.HasPrefix(info.Name(), "apps") || strings.HasPrefix(info.Name(), "packages")) {
				// apps/またはpackages/ディレクトリ自体は処理するが、それ以外のトップレベルディレクトリはスキップ
				return nil
			} else if info.IsDir() && !strings.Contains(path, "/apps/") && !strings.Contains(path, "/packages/") {
				// トップレベル以外のディレクトリでappsやpackages内にないものはスキップ
				return filepath.SkipDir
			}
		}

		// 除外対象のディレクトリはスキップ
		if info.IsDir() && isExcludedDir(info.Name()) {
			return filepath.SkipDir
		}

		// キャッシュディレクトリをスキップ
		if strings.Contains(path, "/.bun/") || strings.Contains(path, "/.bun-cache/") || 
		   strings.Contains(path, "/node_modules/") || strings.Contains(path, "/.next/") {
			if info.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}

		// .tsx または .jsx ファイルのみを処理（ディレクトリも含む）
		if info.IsDir() || strings.HasSuffix(path, ".tsx") || strings.HasSuffix(path, ".jsx") {
			baseName := info.Name()
			
			// ファイルの場合は拡張子を除去
			if !info.IsDir() {
				totalFiles++
				baseName = strings.TrimSuffix(baseName, filepath.Ext(baseName))
			}

			// index.tsx や index.jsx は処理しない
			if !info.IsDir() && (baseName == "index") {
				return nil
			}

			// キャメルケースの判定
			if isCamelCase(baseName) {
				if verbose {
					fmt.Printf("キャメルケースファイル検出: %s (%s)\n", baseName, path)
				}
				// 全てのキャメルケースファイルを結果に追加
				results = append(results, FileResult{
					Path:     path,
					FileName: baseName,
					IsDir:    info.IsDir(),
				})
			}
		}

		return nil
	})

	if err != nil {
		fmt.Printf("エラー: ディレクトリの走査中にエラーが発生しました: %v\n", err)
	}

	if verbose {
		fmt.Printf("合計ファイル数: %d, キャメルケースファイル数: %d\n", totalFiles, len(results))
	}

	return results
}

// 文字列がキャメルケースかどうかを確認（より厳密に）
func isCamelCase(s string) bool {
	if s == "" {
		return false
	}

	// 大文字で始まるかをチェック
	firstChar := s[0]
	if firstChar < 'A' || firstChar > 'Z' {
		return false
	}

	// ハイフンがあればキャメルケースではない
	if strings.Contains(s, "-") {
		return false
	}

	// アンダースコアがあればキャメルケースではない
	if strings.Contains(s, "_") {
		return false
	}

	// 少なくとも1つの小文字を含むかチェック（全て大文字の場合は略語の可能性）
	hasLowerCase := false
	for _, char := range s {
		if char >= 'a' && char <= 'z' {
			hasLowerCase = true
			break
		}
	}

	// 全て大文字の場合も許容する（API, UI など）
	if !hasLowerCase {
		return true
	}

	// 少なくとも一つの小文字と一つの大文字があれば、キャメルケースと判断
	return true
}

// 文字列がケバブケースかどうかを確認
func isKebabCase(s string) bool {
	if s == "" {
		return false
	}

	// ケバブケースの正規表現パターン：小文字とハイフンのみで構成され、ハイフンが連続しない
	pattern := "^[a-z0-9]+(-[a-z0-9]+)*$"
	match, _ := regexp.MatchString(pattern, s)
	return match
}

// 除外対象のディレクトリかどうかをチェック
func isExcludedDir(name string) bool {
	excludedDirs := []string{
		"node_modules",
		"dist",
		"build",
		".git",
		".next",
		"coverage",
		".turbo",
		".bun",
		".bun-cache",
	}
	
	for _, excluded := range excludedDirs {
		if name == excluded {
			return true
		}
	}
	
	return false
}

// プロジェクトルートディレクトリを検出する関数
func findProjectRoot() (string, error) {
	// カレントディレクトリから開始して上に向かって検索
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}
	
	// package.json または go.mod ファイルがあるディレクトリをプロジェクトルートとみなす
	for {
		// package.json の確認
		packageJsonPath := filepath.Join(dir, "package.json")
		if _, err := os.Stat(packageJsonPath); err == nil {
			return dir, nil
		}
		
		// go.mod の確認
		goModPath := filepath.Join(dir, "go.mod")
		if _, err := os.Stat(goModPath); err == nil {
			return dir, nil
		}
		
		// 親ディレクトリを取得
		parentDir := filepath.Dir(dir)
		
		// ルートディレクトリに到達した場合は終了
		if parentDir == dir {
			break
		}
		
		dir = parentDir
	}
	
	// プロジェクトルートが見つからなかった場合はカレントディレクトリを返す
	currentDir, err := os.Getwd()
	if err != nil {
		return "", err
	}
	
	return currentDir, nil
} 