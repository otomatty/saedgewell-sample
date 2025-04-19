package main

import (
	"os"
	"path/filepath"
	"testing"
	"github.com/stretchr/testify/suite"
)

type AnalyzerTestSuite struct {
	suite.Suite
	tempDir string
}

func (s *AnalyzerTestSuite) SetupTest() {
	// テスト用の一時ディレクトリを作成
	tempDir, err := os.MkdirTemp("", "analyzer-test-*")
	s.Require().NoError(err)
	s.tempDir = tempDir

	// テスト用のディレクトリ構造を作成
	dirs := []string{
		"apps/web/components",
		"apps/admin/components",
		"packages/ui/components",
		// 新しい対象ディレクトリ
		"apps/web/app",
		"apps/admin/app",
		"packages/ui/src",
		// ディレクトリ型コンポーネント用
		"apps/web/components/Button",
		"packages/ui/components/user-card",
	}

	for _, dir := range dirs {
		err := os.MkdirAll(filepath.Join(s.tempDir, dir), 0755)
		s.Require().NoError(err)
	}

	// テスト用のファイルを作成
	files := map[string][]string{
		"apps/web/components": {
			"MyComponent.tsx",
			"user-profile.tsx",
		},
		"apps/admin/components": {
			"AdminPanel.tsx",
			"data-table.tsx",
		},
		"packages/ui/components": {
			"Button.tsx",
			"text-input.tsx",
		},
		// 新しい対象ディレクトリ用のファイル
		"apps/web/app": {
			"AppLayout.tsx",
			"page-container.tsx",
		},
		"apps/admin/app": {
			"AdminLayout.tsx",
			"side-menu.tsx",
		},
		"packages/ui/src": {
			"UIProvider.tsx",
			"theme-context.tsx",
		},
		// ディレクトリ型コンポーネント用
		"apps/web/components/Button": {
			"index.tsx",
		},
		"packages/ui/components/user-card": {
			"index.tsx",
		},
	}

	for dir, fileNames := range files {
		for _, fileName := range fileNames {
			filePath := filepath.Join(s.tempDir, dir, fileName)
			err := os.WriteFile(filePath, []byte("// Test file"), 0644)
			s.Require().NoError(err)
		}
	}
}

func (s *AnalyzerTestSuite) TearDownTest() {
	// テスト用の一時ディレクトリを削除
	os.RemoveAll(s.tempDir)
}

func (s *AnalyzerTestSuite) TestAnalyzeProjectStructure() {
	// カレントディレクトリを一時的にテストディレクトリに変更
	originalDir, err := os.Getwd()
	s.Require().NoError(err)
	defer os.Chdir(originalDir)
	
	err = os.Chdir(s.tempDir)
	s.Require().NoError(err)

	// プロジェクト構造を分析
	structure, err := analyzeProjectStructure(s.tempDir)
	s.Require().NoError(err)

	// 結果の検証
	s.Equal("apps/packages", structure.RootType)
	
	// 新しいディレクトリパターンを含む検証 - 期待値を修正
	s.Len(structure.Directories, 6)
	s.Contains(structure.Directories, "apps/web/components")
	s.Contains(structure.Directories, "apps/admin/components")
	s.Contains(structure.Directories, "packages/ui/components")
	s.Contains(structure.Directories, "apps/web/app")
	s.Contains(structure.Directories, "apps/admin/app")
	s.Contains(structure.Directories, "packages/ui/src")

	// 親ディレクトリが含まれる場合、子ディレクトリが除外されることを確認
	s.NotContains(structure.Directories, "apps/web/components/Button")
	s.NotContains(structure.Directories, "packages/ui/components/user-card")

	// ファイル統計の検証 (従来のコンポーネントディレクトリ)
	webStats := structure.FileStats["apps/web/components"]
	s.Equal(2, webStats.CamelCaseCount)  // ファイル + ディレクトリを含む
	s.Equal(1, webStats.KebabCaseCount)
	s.Equal(3, webStats.TotalFiles)      // 標準ファイル + ディレクトリ型コンポーネントのindex.tsx

	adminStats := structure.FileStats["apps/admin/components"]
	s.Equal(1, adminStats.CamelCaseCount)
	s.Equal(1, adminStats.KebabCaseCount)
	s.Equal(2, adminStats.TotalFiles)

	uiStats := structure.FileStats["packages/ui/components"]
	s.Equal(1, uiStats.CamelCaseCount)
	s.Equal(2, uiStats.KebabCaseCount)  // 通常ファイル + ディレクトリを含む
	s.Equal(3, uiStats.TotalFiles)      // 標準ファイル + ディレクトリ型コンポーネントのindex.tsx
	
	// 新しい対象ディレクトリのファイル統計を検証
	webAppStats := structure.FileStats["apps/web/app"]
	s.Equal(1, webAppStats.CamelCaseCount)
	s.Equal(1, webAppStats.KebabCaseCount)
	s.Equal(2, webAppStats.TotalFiles)
	
	adminAppStats := structure.FileStats["apps/admin/app"]
	s.Equal(1, adminAppStats.CamelCaseCount)
	s.Equal(1, adminAppStats.KebabCaseCount)
	s.Equal(2, adminAppStats.TotalFiles)
	
	uiSrcStats := structure.FileStats["packages/ui/src"]
	s.Equal(1, uiSrcStats.CamelCaseCount)
	s.Equal(1, uiSrcStats.KebabCaseCount)
	s.Equal(2, uiSrcStats.TotalFiles)
}

func (s *AnalyzerTestSuite) TestFindProjectRoot() {
	// テスト用の一時ディレクトリをプロジェクトルートとして設定
	// package.jsonファイルを追加してプロジェクトルートとして検出できるようにする
	packageJsonPath := filepath.Join(s.tempDir, "package.json")
	err := os.WriteFile(packageJsonPath, []byte(`{"name": "test-project"}`), 0644)
	s.Require().NoError(err)

	// カレントディレクトリを一時的にプロジェクトルート直下のサブディレクトリに変更
	originalDir, err := os.Getwd()
	s.Require().NoError(err)
	defer os.Chdir(originalDir)

	// サブディレクトリを作成して移動
	subDir := filepath.Join(s.tempDir, "scripts", "rename")
	err = os.MkdirAll(subDir, 0755)
	s.Require().NoError(err)
	err = os.Chdir(subDir)
	s.Require().NoError(err)

	// findProjectRoot関数を呼び出してプロジェクトルートを検出
	projectRoot, err := findProjectRoot()
	s.Require().NoError(err)
	
	// パスを標準化して比較（MacOSの/privateプレフィックスに対応）
	expectedPath, err := filepath.EvalSymlinks(s.tempDir)
	s.Require().NoError(err)
	actualPath, err := filepath.EvalSymlinks(projectRoot)
	s.Require().NoError(err)
	
	// 期待通りにプロジェクトルートが検出できているか確認
	s.Equal(expectedPath, actualPath, "プロジェクトルートが正しく検出されるべき")
}

func (s *AnalyzerTestSuite) TestHasProjectRootMarkers() {
	// プロジェクトルートとして検出されるべきディレクトリを設定
	validRootDir := filepath.Join(s.tempDir, "valid-root")
	err := os.MkdirAll(validRootDir, 0755)
	s.Require().NoError(err)

	// 各種マーカーを追加
	// 1. package.jsonのみ
	packageJsonPath := filepath.Join(validRootDir, "package.json")
	err = os.WriteFile(packageJsonPath, []byte(`{"name": "test-project"}`), 0644)
	s.Require().NoError(err)
	
	// プロジェクトルートとして検出されないディレクトリ
	invalidRootDir := filepath.Join(s.tempDir, "invalid-root")
	err = os.MkdirAll(invalidRootDir, 0755)
	s.Require().NoError(err)

	// 有効なディレクトリには正しいマーカーがある
	s.True(hasProjectRootMarkers(validRootDir), "有効なプロジェクトルートが正しく検出されるべき")

	// 無効なディレクトリにはマーカーがない
	s.False(hasProjectRootMarkers(invalidRootDir), "無効なディレクトリはプロジェクトルートとして検出されるべきでない")

	// 2. apps ディレクトリのみ
	appsDir := filepath.Join(validRootDir, "apps")
	os.Remove(packageJsonPath) // package.jsonを削除
	err = os.MkdirAll(appsDir, 0755)
	s.Require().NoError(err)

	s.True(hasProjectRootMarkers(validRootDir), "apps ディレクトリがあるディレクトリは有効なプロジェクトルート")

	// 3. packages ディレクトリのみ
	packagesDir := filepath.Join(validRootDir, "packages")
	os.RemoveAll(appsDir) // appsを削除
	err = os.MkdirAll(packagesDir, 0755)
	s.Require().NoError(err)

	s.True(hasProjectRootMarkers(validRootDir), "packages ディレクトリがあるディレクトリは有効なプロジェクトルート")
}

// ディレクトリコンポーネント検知のテスト
func (s *AnalyzerTestSuite) TestAnalyzeFilesWithDirectoryComponents() {
	// カレントディレクトリを一時的にテストディレクトリに変更
	originalDir, err := os.Getwd()
	s.Require().NoError(err)
	defer os.Chdir(originalDir)
	
	err = os.Chdir(s.tempDir)
	s.Require().NoError(err)

	// components ディレクトリを直接分析してディレクトリ型コンポーネントの検出を確認
	stats := analyzeFiles("apps/web/components")
	
	// 通常のファイルとディレクトリ型コンポーネントを合わせて検出されるか確認
	s.Equal(3, stats.TotalFiles) // 2個の通常ファイル + index.tsx
	s.Equal(2, stats.CamelCaseCount) // MyComponent.tsx と Button ディレクトリ
	s.Equal(1, stats.KebabCaseCount) // user-profile.tsx のみ
	
	// ディレクトリ型コンポーネントのみのケース
	statsDir := analyzeFiles("packages/ui/components/user-card")
	s.Equal(1, statsDir.TotalFiles) // index.tsx のみ
	s.Equal(0, statsDir.CamelCaseCount) // ケバブケースディレクトリなのでキャメルケースは0
	s.Equal(1, statsDir.KebabCaseCount) // ディレクトリ名がケバブケース
}

// 親子関係のディレクトリ除外テスト
func (s *AnalyzerTestSuite) TestRemoveChildDirectories() {
	// テスト用のパス配列を作成
	paths := []string{
		"apps/web/app",
		"apps/web/app/components",
		"apps/admin/app",
		"packages/ui/src",
		"packages/ui/src/components",
		"packages/ui/components",
	}
	
	// 親子関係のディレクトリを除外
	result := removeChildDirectories(paths)
	
	// 検証 - 期待値を修正
	s.Len(result, 4)
	s.Contains(result, "apps/web/app")
	s.Contains(result, "apps/admin/app")
	s.Contains(result, "packages/ui/src")
	s.Contains(result, "packages/ui/components")
	
	// 子ディレクトリは除外されているはず
	s.NotContains(result, "apps/web/app/components")
	s.NotContains(result, "packages/ui/src/components")
}

func TestAnalyzerSuite(t *testing.T) {
	suite.Run(t, new(AnalyzerTestSuite))
} 