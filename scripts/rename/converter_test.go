package main

import (
	"fmt"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/suite"
)

type ConverterTestSuite struct {
	suite.Suite
	tempDir   string
	projectRoot string // converterが内部でprojectRootを使うため
	originalDir string // 元のディレクトリに戻るため
}

// SetupTest は各テストの前に実行されます
func (s *ConverterTestSuite) SetupTest() {
	// 元のディレクトリを保存
	originalDir, err := os.Getwd()
	s.Require().NoError(err)
	s.originalDir = originalDir

	// テスト用の一時プロジェクトルートを作成
	tempDir, err := os.MkdirTemp("", "converter-test-*")
	s.Require().NoError(err)
	s.tempDir = tempDir
	s.projectRoot = tempDir // このテストスイートでは一時ディレクトリをルートとする

	// テスト用のディレクトリ構造とファイルを作成
	dirs := []string{
		"components/common",
		"components/features/UserProfile",
		"utils",
		// ディレクトリ型コンポーネント用
		"components/common/IconButton",
		"components/features/user-avatar",
		// 新しい検索パターン用
		"apps/web/app",
		"apps/admin/app",
		"packages/ui/src",
	}
	for _, dir := range dirs {
		err := os.MkdirAll(filepath.Join(s.tempDir, dir), 0755)
		s.Require().NoError(err)
	}

	// テスト用のファイルを作成 (インポート関係も含む)
	files := map[string]string{
		"components/common/Button.tsx":      "export const Button = () => <button>Click Me</button>;",
		"components/common/input-field.tsx": "export const InputField = () => <input type='text' />",
		"components/features/UserProfile/AvatarImage.tsx": `
import { Button } from '../common/Button';
export const AvatarImage = () => <img src="avatar.png" alt="avatar" />;
`,
		"components/features/UserProfile/user-card.tsx": `
import { AvatarImage } from './AvatarImage';
import { InputField } from '../common/input-field';
export const UserCard = () => <div><AvatarImage /><InputField /></div>;
`,
		"utils/helpers.ts": "export const formatName = (name: string) => name.toUpperCase();", // .tsファイル (対象外)
		"README.md":        "# Test Project", // 対象外
		
		// ディレクトリ型コンポーネント
		"components/common/IconButton/index.tsx": `
import { Button } from '../Button';
export const IconButton = ({ icon }) => <Button>{icon}</Button>;
`,
		"components/features/user-avatar/index.tsx": `
import { IconButton } from '../../common/IconButton';
export const UserAvatar = ({ src }) => <div><img src={src} /><IconButton icon="edit" /></div>;
`,
		
		// 新しい検索パターン用のファイル
		"apps/web/app/AppLayout.tsx": `
export const AppLayout = ({ children }) => <div className="app-layout">{children}</div>;
`,
		"apps/web/app/page-container.tsx": `
import { AppLayout } from './AppLayout';
export const PageContainer = ({ content }) => <AppLayout>{content}</AppLayout>;
`,
		"apps/admin/app/AdminDashboard.tsx": `
export const AdminDashboard = () => <div>Admin Dashboard</div>;
`,
		"packages/ui/src/Theme.tsx": `
export const Theme = ({ children }) => <div className="theme-provider">{children}</div>;
`,
		"packages/ui/src/button-styles.tsx": `
export const buttonStyles = { primary: "bg-blue-500", secondary: "bg-gray-500" };
`,
	}

	for path, content := range files {
		filePath := filepath.Join(s.tempDir, path)
		err := os.WriteFile(filePath, []byte(content), 0644)
		s.Require().NoError(err)
	}

	// プロジェクトルートに移動 (converter内の関数がカレントディレクトリを基準にする場合があるため)
	err = os.Chdir(s.tempDir)
	s.Require().NoError(err)
}

// TearDownTest は各テストの後に実行されます
func (s *ConverterTestSuite) TearDownTest() {
	// 元のディレクトリに戻る
	err := os.Chdir(s.originalDir)
	s.Require().NoError(err)
	// テスト用の一時ディレクトリを削除
	os.RemoveAll(s.tempDir)
}

// findTsxJsxFiles のテスト
func (s *ConverterTestSuite) TestFindTsxJsxFiles() {
	// テスト用のダミーConfig
	config := Config{
		ExcludeDirectories: []string{},
	}
	
	files, err := findTsxJsxFiles(s.projectRoot, config)
	s.Require().NoError(err)
	s.Len(files, 11, "Should find 11 tsx/jsx files")

	// 相対パスで期待されるファイルリスト (順不同で比較するためMapを使用)
	expectedFiles := map[string]bool{
		// 元のコンポーネントディレクトリ内のファイル
		filepath.Join("components", "common", "Button.tsx"):      true,
		filepath.Join("components", "common", "input-field.tsx"): true,
		filepath.Join("components", "features", "UserProfile", "AvatarImage.tsx"): true,
		filepath.Join("components", "features", "UserProfile", "user-card.tsx"): true,
		// ディレクトリ型コンポーネントのファイル
		filepath.Join("components", "common", "IconButton", "index.tsx"): true,
		filepath.Join("components", "features", "user-avatar", "index.tsx"): true,
		// 新しい検索パターン (apps/*/app) のファイル
		filepath.Join("apps", "web", "app", "AppLayout.tsx"): true,
		filepath.Join("apps", "web", "app", "page-container.tsx"): true,
		filepath.Join("apps", "admin", "app", "AdminDashboard.tsx"): true,
		// 新しい検索パターン (packages/ui/src) のファイル
		filepath.Join("packages", "ui", "src", "Theme.tsx"): true,
		filepath.Join("packages", "ui", "src", "button-styles.tsx"): true,
	}

	foundFiles := make(map[string]bool)
	for _, file := range files {
		relPath, err := filepath.Rel(s.projectRoot, file)
		s.Require().NoError(err)
		foundFiles[relPath] = true
	}

	s.Equal(expectedFiles, foundFiles)
}

// updateImportPaths のテスト (CamelCase -> kebab-case)
func (s *ConverterTestSuite) TestUpdateImportPaths_CamelToKebab() {
	// 更新対象のファイルと変更内容
	fileToUpdate := filepath.Join(s.projectRoot, "components", "features", "UserProfile", "AvatarImage.tsx") // Button.tsx をインポートしている
	oldBaseName := "Button"
	newBaseName := "button"
	config := Config{ ConversionDirection: "camel-to-kebab" } // ダミーのConfig

	// 更新処理を実行
	updateImportPaths(fileToUpdate, oldBaseName, newBaseName, config)

	// ファイル内容を読み取って検証
	content, err := os.ReadFile(fileToUpdate)
	s.Require().NoError(err)
	s.Contains(string(content), "from '../common/button'")

	// 別のファイル/変更でテスト
	fileToUpdate2 := filepath.Join(s.projectRoot, "components", "features", "UserProfile", "user-card.tsx") // AvatarImage.tsx をインポート
	oldBaseName2 := "AvatarImage"
	newBaseName2 := "avatar-image"

	updateImportPaths(fileToUpdate2, oldBaseName2, newBaseName2, config)

	content2, err := os.ReadFile(fileToUpdate2)
	s.Require().NoError(err)
	s.Contains(string(content2), "from './avatar-image'")
	// input-field は変更していないので、元のままか確認
	s.Contains(string(content2), "from '../common/input-field'")
}

// updateImportPaths のテスト (kebab-case -> CamelCase)
func (s *ConverterTestSuite) TestUpdateImportPaths_KebabToCamel() {
    // 更新対象のファイルと変更内容
    fileToUpdate := filepath.Join(s.projectRoot, "components", "features", "UserProfile", "user-card.tsx") // input-field.tsx をインポート
    oldBaseName := "input-field"
    newBaseName := "InputField"
	config := Config{ ConversionDirection: "kebab-to-camel" } // ダミーのConfig

    // 更新処理を実行
    updateImportPaths(fileToUpdate, oldBaseName, newBaseName, config)

    // ファイル内容を読み取って検証
    content, err := os.ReadFile(fileToUpdate)
    s.Require().NoError(err)
    s.Contains(string(content), "from '../common/InputField'")
    // AvatarImage は変更していないので、元のままか確認
    s.Contains(string(content), "from './AvatarImage'")
}

// processFiles のテスト
func (s *ConverterTestSuite) TestProcessFiles() {
	// 元のfindProjectRoot関数を保存
	origFindProjectRoot := findProjectRoot

	// テスト用のモック関数
	mockFindProjectRoot := func() (string, error) {
		return s.projectRoot, nil
	}

	// テスト用の関数を設定
	findProjectRoot = mockFindProjectRoot
	// テスト後に元の関数に戻す
	defer func() { findProjectRoot = origFindProjectRoot }()

	// configファイルのクローンを作成し、ドライラン用とファイル変換用に分ける
	configDryRun := Config{
		TargetDir: "components/common",
		ConversionDirection: "camel-to-kebab",
		ExcludePatterns: []string{},
		DryRun: true, // 実際のファイル変更はしない
	}

	configActual := Config{
		TargetDir: "components/common",
		ConversionDirection: "camel-to-kebab",
		ExcludePatterns: []string{},
		DryRun: false, // 実際にファイルを変換
	}

	// 変換前の状態を確認
	buttonPath := filepath.Join(s.tempDir, "components/common/Button.tsx")
	_, err := os.Stat(buttonPath)
	s.Require().NoError(err, "Button.tsx ファイルが存在する必要があります")

	// アイコンボタンのディレクトリを確認
	iconButtonPath := filepath.Join(s.tempDir, "components/common/IconButton")
	_, err = os.Stat(iconButtonPath)
	s.Require().NoError(err, "IconButton ディレクトリが存在する必要があります")

	// 最初にドライランで確認する
	processFiles(configDryRun)

	// ドライランでは元のファイルとディレクトリは維持されるはず
	_, err = os.Stat(buttonPath)
	s.Require().NoError(err, "ドライラン後も Button.tsx ファイルが存在する必要があります")
	_, err = os.Stat(iconButtonPath)
	s.Require().NoError(err, "ドライラン後も IconButton ディレクトリが存在する必要があります")

	// icon-button ディレクトリは存在しないはず
	iconButtonKebabPath := filepath.Join(s.tempDir, "components/common/icon-button")
	_, err = os.Stat(iconButtonKebabPath)
	s.True(os.IsNotExist(err), "ドライラン段階では icon-button ディレクトリは存在しないはず")

	// 実際にファイルを変換する
	processFiles(configActual)

	// Button.tsx は SkipRenameList に含まれているはずなので変化なし
	_, err = os.Stat(buttonPath)
	s.Require().NoError(err, "Button.tsx ファイルはスキップリストに含まれるため存在する必要があります")

	// IconButton ディレクトリは icon-button に変換されるはず
	_, err = os.Stat(iconButtonKebabPath)
	s.Require().NoError(err, "変換後は icon-button ディレクトリが存在する必要があります")
	
	// 元のディレクトリは存在しないはず
	_, err = os.Stat(iconButtonPath)
	s.True(os.IsNotExist(err), "変換後は IconButton ディレクトリは存在しないはずです")

	// パスを標準化して比較（MacOSの/privateプレフィックスに対応）
	expectedDir, err := filepath.EvalSymlinks(s.projectRoot)
	s.Require().NoError(err)
	currentDir, err := os.Getwd()
	s.Require().NoError(err)
	actualDir, err := filepath.EvalSymlinks(currentDir)
	s.Require().NoError(err)
	
	// テスト後のクリーンアップ: プロジェクトルートへの移動を確認
	s.Equal(expectedDir, actualDir, "カレントディレクトリがプロジェクトルートのままであることを確認")
}

// processFiles のテスト (複数ディレクトリのケース)
func (s *ConverterTestSuite) TestProcessFilesMultipleTargets() {
	// 元のfindProjectRoot関数を保存
	origFindProjectRoot := findProjectRoot
	
	// テスト用のモック関数
	mockFindProjectRoot := func() (string, error) {
		return s.projectRoot, nil
	}
	
	// テスト用の関数を設定
	findProjectRoot = mockFindProjectRoot
	// テスト後に元の関数に戻す
	defer func() { findProjectRoot = origFindProjectRoot }()

	// UserProfile ディレクトリ内のケバブケースファイルをキャメルケースに変換
	configKebabToCamel := Config{
		TargetDir: "components/features/UserProfile",
		ConversionDirection: "kebab-to-camel",
		ExcludePatterns: []string{},
		DryRun: false, // 実際にファイルを変換
	}

	// 変換前のファイルパス
	userCardPath := filepath.Join(s.tempDir, "components/features/UserProfile/user-card.tsx")
	_, err := os.Stat(userCardPath)
	s.Require().NoError(err, "user-card.tsx ファイルが存在する必要があります")

	// 変換を実行
	processFiles(configKebabToCamel)

	// user-card.tsx は UserCard.tsx になるはず
	userCardCamelPath := filepath.Join(s.tempDir, "components/features/UserProfile/UserCard.tsx")
	_, err = os.Stat(userCardCamelPath)
	s.Require().NoError(err, "変換後は UserCard.tsx ファイルが存在する必要があります")

	// 元のファイルは存在しないはず
	_, err = os.Stat(userCardPath)
	if !os.IsNotExist(err) {
		s.Fail("変換後は user-card.tsx ファイルは存在しないはずです")
	}

	// インポートパスも自動的に更新されていることを確認
	content, err := os.ReadFile(userCardCamelPath)
	s.Require().NoError(err)
	contentStr := string(content)
	s.Contains(contentStr, "import { AvatarImage } from './AvatarImage'", "インポートパスが正しく保持されているか確認")

	// パスを標準化して比較（MacOSの/privateプレフィックスに対応）
	expectedDir, err := filepath.EvalSymlinks(s.projectRoot)
	s.Require().NoError(err)
	currentDir, err := os.Getwd()
	s.Require().NoError(err)
	actualDir, err := filepath.EvalSymlinks(currentDir)
	s.Require().NoError(err)
	
	// テスト後のクリーンアップ: プロジェクトルートへの移動を確認
	s.Equal(expectedDir, actualDir, "カレントディレクトリがプロジェクトルートのままであることを確認")
}

// findDirectoryComponents のテスト
func (s *ConverterTestSuite) TestFindDirectoryComponents() {
	// テスト用のダミーConfig
	config := Config{
		ExcludeDirectories: []string{},
	}
	
	dirs, err := findDirectoryComponents(s.projectRoot, config)
	s.Require().NoError(err)
	s.Len(dirs, 2, "Should find 2 directory components")

	// 期待されるディレクトリパス（相対）
	expectedDirs := map[string]bool{
		filepath.Join(s.projectRoot, "components", "common", "IconButton"):     true,
		filepath.Join(s.projectRoot, "components", "features", "user-avatar"): true,
	}

	// 期待通りのディレクトリが見つかったか検証
	s.Len(dirs, len(expectedDirs))
	for _, dir := range dirs {
		s.True(expectedDirs[dir], fmt.Sprintf("ディレクトリ %s が見つかりませんでした", dir))
	}
}

// processDirComponent のテスト（キャメルケース → ケバブケース）
func (s *ConverterTestSuite) TestProcessDirComponent_CamelToKebab() {
	// IconButton ディレクトリを処理（キャメルケース→ケバブケース）
	dirPath := filepath.Join(s.projectRoot, "components", "common", "IconButton")
	config := Config{
		ConversionDirection: "camel-to-kebab",
		ExcludePatterns:     []string{},
		DryRun:              false,
	}

	// 処理前にディレクトリが存在することを確認
	_, err := os.Stat(dirPath)
	s.Require().NoError(err)

	// ディレクトリコンポーネントを処理
	result, err := processDirComponent(dirPath, config)
	s.Require().NoError(err)
	s.Equal("IconButton", result.OldBaseName)
	s.Equal("icon-button", result.NewBaseName)

	// 一時ディレクトリを使用せず直接テストする（実際の変換は行わない）
	// 結果オブジェクトの検証のみ
	s.Equal(filepath.Join(s.projectRoot, "components", "common", "icon-button"), result.NewPath)
}

// processDirComponent のテスト（ケバブケース → キャメルケース）
func (s *ConverterTestSuite) TestProcessDirComponent_KebabToCamel() {
	// user-avatar ディレクトリを処理（ケバブケース→キャメルケース）
	dirPath := filepath.Join(s.projectRoot, "components", "features", "user-avatar")
	config := Config{
		ConversionDirection: "kebab-to-camel",
		ExcludePatterns:     []string{},
		DryRun:              false,
	}

	// 処理前にディレクトリが存在することを確認
	_, err := os.Stat(dirPath)
	s.Require().NoError(err)

	// ディレクトリコンポーネントを処理
	result, err := processDirComponent(dirPath, config)
	s.Require().NoError(err)
	s.Equal("user-avatar", result.OldBaseName)
	s.Equal("UserAvatar", result.NewBaseName)

	// 結果オブジェクトの検証
	s.Equal(filepath.Join(s.projectRoot, "components", "features", "UserAvatar"), result.NewPath)
}

// ディレクトリコンポーネントの実際の変換テスト
func (s *ConverterTestSuite) TestProcessFilesWithDirectoryComponents() {
	// 元のfindProjectRoot関数を保存
	origFindProjectRoot := findProjectRoot

	// テスト用のモック関数
	mockFindProjectRoot := func() (string, error) {
		return s.projectRoot, nil
	}

	// テスト用の関数を設定
	findProjectRoot = mockFindProjectRoot
	// テスト後に元の関数に戻す
	defer func() { findProjectRoot = origFindProjectRoot }()

	// ディレクトリコンポーネントの変換（キャメルケース→ケバブケース）
	config := Config{
		TargetDir:           "components/common",
		ConversionDirection: "camel-to-kebab",
		ExcludePatterns:     []string{},
		DryRun:              false,
	}

	// 変換前の状態を確認
	iconButtonPath := filepath.Join(s.tempDir, "components/common/IconButton")
	_, err := os.Stat(iconButtonPath)
	s.Require().NoError(err, "IconButton ディレクトリが存在する必要があります")

	// 変換を実行
	processFiles(config)

	// 変換後の状態をチェック
	iconButtonKebabPath := filepath.Join(s.tempDir, "components/common/icon-button")
	_, err = os.Stat(iconButtonKebabPath)
	s.Require().NoError(err, "変換後は icon-button ディレクトリが存在する必要があります")

	// 元のディレクトリは存在しないはず
	_, err = os.Stat(iconButtonPath)
	s.True(os.IsNotExist(err), "変換後は IconButton ディレクトリは存在しないはずです")

	// index.tsx ファイルも新しいディレクトリ内に存在するか確認
	indexFilePath := filepath.Join(iconButtonKebabPath, "index.tsx")
	_, err = os.Stat(indexFilePath)
	s.Require().NoError(err, "変換後の index.tsx ファイルが存在する必要があります")

	// インポートパスも自動的に更新されていることを確認
	userAvatarIndexPath := filepath.Join(s.tempDir, "components/features/user-avatar/index.tsx")
	content, err := os.ReadFile(userAvatarIndexPath)
	s.Require().NoError(err)
	s.Contains(string(content), "import { IconButton } from '../../common/icon-button'", "インポートパスが更新されているはず")
}

// 新しい検索パターン（apps/*/app）のテスト
func (s *ConverterTestSuite) TestProcessFilesWithAppsAppPattern() {
	// 元のfindProjectRoot関数を保存
	origFindProjectRoot := findProjectRoot

	// テスト用のモック関数
	mockFindProjectRoot := func() (string, error) {
		return s.projectRoot, nil
	}

	// テスト用の関数を設定
	findProjectRoot = mockFindProjectRoot
	// テスト後に元の関数に戻す
	defer func() { findProjectRoot = origFindProjectRoot }()

	// apps/web/app ディレクトリを処理（キャメルケース→ケバブケース）
	config := Config{
		TargetDir:           "apps/web/app",
		ConversionDirection: "camel-to-kebab",
		ExcludePatterns:     []string{},
		DryRun:              false,
	}

	// 変換前の状態を確認
	appLayoutPath := filepath.Join(s.tempDir, "apps/web/app/AppLayout.tsx")
	_, err := os.Stat(appLayoutPath)
	s.Require().NoError(err, "AppLayout.tsx ファイルが存在する必要があります")

	// 変換を実行
	processFiles(config)

	// 変換後の状態をチェック
	appLayoutKebabPath := filepath.Join(s.tempDir, "apps/web/app/app-layout.tsx")
	_, err = os.Stat(appLayoutKebabPath)
	s.Require().NoError(err, "変換後は app-layout.tsx ファイルが存在する必要があります")

	// 元のファイルは存在しないはず
	_, err = os.Stat(appLayoutPath)
	s.True(os.IsNotExist(err), "変換後は AppLayout.tsx ファイルは存在しないはずです")

	// インポートパスも自動的に更新されていることを確認
	pageContainerPath := filepath.Join(s.tempDir, "apps/web/app/page-container.tsx")
	content, err := os.ReadFile(pageContainerPath)
	s.Require().NoError(err)
	s.Contains(string(content), "import { AppLayout } from './app-layout'", "インポートパスが更新されているはず")
}

// 新しい検索パターン（packages/ui/src）のテスト
func (s *ConverterTestSuite) TestProcessFilesWithPackagesUIPattern() {
	// 元のfindProjectRoot関数を保存
	origFindProjectRoot := findProjectRoot

	// テスト用のモック関数
	mockFindProjectRoot := func() (string, error) {
		return s.projectRoot, nil
	}

	// テスト用の関数を設定
	findProjectRoot = mockFindProjectRoot
	// テスト後に元の関数に戻す
	defer func() { findProjectRoot = origFindProjectRoot }()

	// packages/ui/src ディレクトリを処理（ケバブケース→キャメルケース）
	config := Config{
		TargetDir:           "packages/ui/src",
		ConversionDirection: "kebab-to-camel",
		ExcludePatterns:     []string{},
		DryRun:              false,
	}

	// 変換前の状態を確認
	buttonStylesPath := filepath.Join(s.tempDir, "packages/ui/src/button-styles.tsx")
	_, err := os.Stat(buttonStylesPath)
	s.Require().NoError(err, "button-styles.tsx ファイルが存在する必要があります")

	// 変換を実行
	processFiles(config)

	// 変換後の状態をチェック
	buttonStylesCamelPath := filepath.Join(s.tempDir, "packages/ui/src/ButtonStyles.tsx")
	_, err = os.Stat(buttonStylesCamelPath)
	s.Require().NoError(err, "変換後は ButtonStyles.tsx ファイルが存在する必要があります")

	// 元のファイルは存在しないはず
	_, err = os.Stat(buttonStylesPath)
	s.True(os.IsNotExist(err), "変換後は button-styles.tsx ファイルは存在しないはずです")
}

// テストスイートを実行
func TestConverterSuite(t *testing.T) {
	suite.Run(t, new(ConverterTestSuite))
} 