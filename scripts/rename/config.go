package main

import (
	"fmt"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

// 除外設定ファイルの構造体
type ExcludeConfig struct {
	ExcludeFiles       []string `yaml:"exclude_files"`
	ExcludeImports     []string `yaml:"exclude_imports"`
	ExcludeDirectories []string `yaml:"exclude_directories"`
}

// 設定ファイルを読み込む
func loadExcludeConfig(path string) (*ExcludeConfig, error) {
	// ファイルが存在するか確認
	if _, err := os.Stat(path); os.IsNotExist(err) {
		// ファイルが存在しない場合はデフォルト設定を返す
		return getDefaultExcludeConfig(), nil
	}

	// ファイルを読み込む
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("設定ファイルの読み込みに失敗しました: %w", err)
	}

	// YAMLを解析
	var config ExcludeConfig
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("設定ファイルの解析に失敗しました: %w", err)
	}

	return &config, nil
}

// デフォルトの除外設定を返す
func getDefaultExcludeConfig() *ExcludeConfig {
	return &ExcludeConfig{
		ExcludeFiles: []string{
			"page.tsx",
			"layout.tsx",
			"loading.tsx",
			"error.tsx",
			"not-found.tsx",
			"route.ts",
		},
		ExcludeImports: []string{
			"@kit/ui",
			"@kit/components",
			"@/components/ui",
			"@/ui",
			"*/actions/",
			"@/actions/",
			"../actions/",
			"./actions/",
		},
		ExcludeDirectories: []string{
			"node_modules",
			"dist",
			"build",
			".next",
		},
	}
}

// 設定ファイルのパスを取得
func getExcludeConfigPath() string {
	// 現在のディレクトリを取得
	dir, err := os.Getwd()
	if err != nil {
		return "excludes.yaml" // エラーの場合はカレントディレクトリを使用
	}

	// プロジェクトルートを検出
	rootDir, err := findProjectRoot()
	if err == nil {
		// プロジェクトルートが見つかった場合は、そこからの相対パスを使用
		dir = rootDir
	}

	// 設定ファイルのパスを生成
	return filepath.Join(dir, "scripts", "rename", "excludes.yaml")
} 