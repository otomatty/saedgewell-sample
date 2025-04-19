package main

import (
	"path/filepath"
	"regexp"
	"strings"
)

// 特殊な大文字略語のマップ（すべて大文字で定義）
var upperCaseAcronyms = map[string]bool{
	"API": true,
	"FAQ": true,
	"UI":  true,
	"ID":  true,
	"URL": true,
	"SDK": true,
	"CSS": true,
	"HTML": true,
	"HTTP": true,
	"HTTPS": true,
	"JSON": true,
	"XML": true,
	"JWT": true,
	"SEO": true,
	"DX": true,
	"AI": true,
	"CTA": true,
}

// ケバブケースへの変換時に略語を小文字にするかどうか
var lowerCaseAcronymsInKebab = true

// キャメルケースからケバブケースへの変換
func camelToKebab(s string) string {
	if s == "" {
		return s
	}
	
	// "Index" の特殊処理 - 単純に "index" に変換
	if s == "Index" {
		return "index"
	}
	
	// 「先頭だけが大文字で残りが小文字」のパターンを処理
	// 例えば "Header" -> "header", "Footer" -> "footer"
	if len(s) > 1 && s[0] >= 'A' && s[0] <= 'Z' {
		allLowerCase := true
		for i := 1; i < len(s); i++ {
			if s[i] < 'a' || s[i] > 'z' {
				allLowerCase = false
				break
			}
		}
		if allLowerCase {
			return strings.ToLower(s)
		}
	}

	var result strings.Builder
	i := 0
	
	// 連続する大文字を検出する関数
	findAcronym := func(start int) (string, int) {
		end := start
		for end < len(s) && s[end] >= 'A' && s[end] <= 'Z' {
			end++
		}
		
		// 最後の文字が次の単語の一部（小文字が続く場合）であれば調整
		if end > start+1 && end < len(s) && s[end] >= 'a' && s[end] <= 'z' {
			end--
		}
		
		return s[start:end], end
	}
	
	// 先頭の略語または単語を処理
	if s[0] >= 'A' && s[0] <= 'Z' {
		acronym, nextPos := findAcronym(0)
		
		// 大文字の略語かどうかをチェック
		if len(acronym) > 1 && upperCaseAcronyms[acronym] {
			// 全体が略語の場合
			result.WriteString(strings.ToLower(acronym))
		} else {
			// 通常の単語の場合は先頭を小文字に
			result.WriteRune(rune(s[0] - 'A' + 'a'))
			if len(acronym) > 1 {
				result.WriteString(acronym[1:])
			}
		}
		i = nextPos
	} else {
		// 小文字で始まる場合はそのまま
		result.WriteRune(rune(s[0]))
		i = 1
	}
	
	// 残りの文字列を処理
	for i < len(s) {
		if s[i] >= 'A' && s[i] <= 'Z' {
			// 大文字が出現したら新しい単語または略語の開始
			acronym, nextPos := findAcronym(i)
			
			// 略語かどうかをチェック
			if len(acronym) > 1 && upperCaseAcronyms[acronym] {
				result.WriteRune('-')
				result.WriteString(strings.ToLower(acronym))
			} else {
				// 通常の単語の場合
				result.WriteRune('-')
				result.WriteRune(rune(s[i] - 'A' + 'a'))
				if len(acronym) > 1 {
					result.WriteString(acronym[1:])
				}
			}
			i = nextPos
		} else {
			// 小文字はそのまま追加
			result.WriteRune(rune(s[i]))
			i++
		}
	}
	
	return result.String()
}

// ケバブケースからキャメルケースへの変換
func kebabToCamel(s string) string {
	if s == "" {
		return s
	}

	// 分割して各部分を処理
	parts := strings.Split(s, "-")
	for i, part := range parts {
		// 略語かどうかをチェック
		upperPart := strings.ToUpper(part)
		if upperCaseAcronyms[upperPart] {
			// 先頭以外の略語、または 2文字以上の先頭略語は大文字に
			if i > 0 || len(part) > 1 {
				parts[i] = upperPart
			} else {
				// 先頭の1文字略語は先頭だけ大文字に
				parts[i] = strings.Title(part)
			}
		} else if i > 0 {
			// 略語でない単語は先頭だけ大文字に
			parts[i] = strings.Title(part)
		} else {
			// 先頭単語は先頭だけ大文字に
			parts[i] = strings.Title(part)
		}
	}

	return strings.Join(parts, "")
}

// 文字列がキャメルケースかどうかを確認
func isCamelCase(s string) bool {
	if s == "" {
		return false
	}

	// "Index" を特別に処理
	if s == "Index" {
		return true
	}
	
	// 「先頭だけが大文字で残りが小文字」のパターンをチェック
	// 例えば "Header", "Footer" なども変換対象にする
	if len(s) > 1 && s[0] >= 'A' && s[0] <= 'Z' {
		// 残りの文字が全て小文字かどうかを確認
		allLowerCase := true
		for i := 1; i < len(s); i++ {
			if s[i] < 'a' || s[i] > 'z' {
				allLowerCase = false
				break
			}
		}
		if allLowerCase {
			return true
		}
	}

	// 大文字+小文字で始まるか、またはすべて大文字の略語で始まるかをチェック
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

// 指定されたパターンに一致するディレクトリが除外対象かどうかを確認
func isExcludedDirectory(dir string, excludePatterns []string) bool {
	for _, pattern := range excludePatterns {
		matched, err := filepath.Match(pattern, filepath.Base(dir))
		if err == nil && matched {
			return true
		}
		
		// パターンがパス全体にマッチするかをチェック
		matched, err = filepath.Match(pattern, dir)
		if err == nil && matched {
			return true
		}
	}
	return false
}

// 一般的な除外ディレクトリパターンを取得
func getDefaultExcludePatterns() []string {
	return []string{
		"node_modules",
		".git",
		"dist",
		"build",
		"coverage",
		"public",
		"*.test.*",
		"*.spec.*",
		"__tests__",
		"__mocks__",
		"__snapshots__",
	}
}

// スライスに要素が含まれているかチェック
func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

// 除外対象のディレクトリかどうかをチェック
func isExcludedDir(name string) bool {
	// 基本的な除外ディレクトリのみをハードコード
	// 特定のプロジェクトの除外設定はConfig構造体から取得する
	baseExcludedDirs := []string{
		"node_modules",
		"dist",
		"build",
		".git",
		".next",
	}
	
	for _, excluded := range baseExcludedDirs {
		if name == excluded {
			return true
		}
	}
	
	// 先頭がドットのディレクトリも除外
	if strings.HasPrefix(name, ".") && name != "." {
		return true
	}
	
	return false
} 