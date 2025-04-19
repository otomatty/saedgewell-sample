const fs = require('node:fs');
const path = require('node:path');

// パッケージのルートディレクトリを取得
const packageRoot = path.resolve(__dirname, '..');

// package.jsonを読み込む
const packageJsonPath = path.join(packageRoot, 'package.json');
const packageJson = require(packageJsonPath);

// exportsディレクトリ内のすべてのJSONファイルを読み込む
const exportsDir = path.join(packageRoot, 'config/exports');
const exportFiles = fs
  .readdirSync(exportsDir)
  .filter((file) => file.endsWith('.json'));

// マージ戦略の設定
const MERGE_STRATEGY = {
  // 競合時に警告を表示し、後から読み込まれたファイルの値を使用（デフォルト）
  WARN_AND_OVERRIDE: 'warn-and-override',
  // 競合時にエラーを発生させる
  ERROR_ON_CONFLICT: 'error-on-conflict',
  // 競合時に名前空間を使用
  USE_NAMESPACE: 'use-namespace',
  // 競合時にファイルの優先順位に基づいて解決
  USE_PRIORITY: 'use-priority',
};

// 使用するマージ戦略を選択
const mergeStrategy = MERGE_STRATEGY.USE_NAMESPACE;

// 名前空間の設定（USE_NAMESPACE戦略用）
/** @type {Record<string, string>} */
const namespaces = {
  'makerkit.json': 'makerkit',
  'magicui.json': 'magicui',
  // 他のファイルの名前空間をここに追加
};

// ファイルの優先順位を定義（USE_PRIORITY戦略用）
/** @type {Record<string, number>} */
const filePriorities = {
  'makerkit.json': 10,
  'magicui.json': 5,
  // 他のファイルの優先順位をここに追加
};

// 優先順位に基づいてファイルをソート（USE_PRIORITY戦略用）
if (mergeStrategy === MERGE_STRATEGY.USE_PRIORITY) {
  exportFiles.sort((a, b) => {
    const priorityA = filePriorities[a] || 0;
    const priorityB = filePriorities[b] || 0;

    // 優先順位が同じ場合はファイル名でソート
    if (priorityA === priorityB) {
      return a.localeCompare(b);
    }

    // 優先順位の高い順（数値が大きい順）にソート
    return priorityB - priorityA;
  });
}

// すべてのexportsをマージ
/** @type {Record<string, string>} */
const mergedExports = {};
// 競合を追跡するためのマップ
/** @type {Record<string, string[]>} */
const conflictMap = {};
// キーのソースファイルを追跡するためのマップ
/** @type {Record<string, string>} */
const keySourceMap = {};

// 競合を検出しながらマージ
for (const file of exportFiles) {
  const filePath = path.join(exportsDir, file);
  const fileExports = require(filePath);

  // 各エクスポートキーについて処理
  for (const key in fileExports.exports) {
    const value = fileExports.exports[key];

    // 競合チェック
    if (key in mergedExports) {
      // 競合の記録
      if (!conflictMap[key]) {
        conflictMap[key] = [keySourceMap[key] || '不明なファイル'];
      }
      conflictMap[key].push(file);

      // 選択したマージ戦略に基づいて処理
      switch (mergeStrategy) {
        case MERGE_STRATEGY.ERROR_ON_CONFLICT: {
          throw new Error(
            `エラー: キー "${key}" が複数のファイルで定義されています: ${conflictMap[key]?.join(', ') || key}`
          );
        }

        case MERGE_STRATEGY.USE_NAMESPACE: {
          // 名前空間を使用して競合を回避
          const namespace = namespaces[file] || path.basename(file, '.json');
          const namespacedKey = `./${namespace}${key.startsWith('./') ? key.substring(1) : key}`;
          mergedExports[namespacedKey] = value;
          console.warn(
            `警告: キー "${key}" が複数のファイルで定義されています。名前空間 "${namespace}" を使用します: ${namespacedKey}`
          );
          break;
        }

        case MERGE_STRATEGY.USE_PRIORITY: {
          // 優先順位が高いファイルが先に処理されるため、既存の値を保持
          console.warn(
            `警告: キー "${key}" が複数のファイルで定義されています: ${conflictMap[key]?.join(', ') || key}`
          );
          console.warn(
            `  優先順位に基づき、"${keySourceMap[key] || '不明なファイル'}" の定義が使用されます。`
          );
          break;
        }

        // WARN_AND_OVERRIDEとdefaultを分離
        case MERGE_STRATEGY.WARN_AND_OVERRIDE: {
          // 警告を表示し、後から読み込まれたファイルの値で上書き
          console.warn(
            `警告: キー "${key}" が複数のファイルで定義されています: ${conflictMap[key]?.join(', ') || key}`
          );
          console.warn(`  後者の定義 (${file}) が使用されます。`);
          mergedExports[key] = value;
          keySourceMap[key] = file;
          break;
        }

        default: {
          // デフォルトの動作（WARN_AND_OVERRIDEと同じ）
          console.warn(
            `警告: キー "${key}" が複数のファイルで定義されています: ${conflictMap[key]?.join(', ') || key}`
          );
          console.warn(`  後者の定義 (${file}) が使用されます。`);
          mergedExports[key] = value;
          keySourceMap[key] = file;
          break;
        }
      }
    } else {
      // 競合がない場合は通常通り追加
      mergedExports[key] = value;
      keySourceMap[key] = file;
    }
  }
}

// package.jsonのexportsを更新
packageJson.exports = mergedExports;

// 更新したpackage.jsonを書き込む
fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

console.log('Exports successfully merged!');
