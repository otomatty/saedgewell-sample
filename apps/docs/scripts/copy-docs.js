/**
 * Vercelデプロイ用に.docsディレクトリをコピーするスクリプト
 *
 * このスクリプトは、モノレポのプロジェクトルートにある.docsディレクトリを
 * アプリディレクトリにコピーすることで、Vercelデプロイ時にドキュメントを
 * 正しく参照できるようにします。
 *
 * ファイルサイズを削減するために最適化も行います。
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

// 現在の作業ディレクトリ
const currentDir = process.cwd();
console.log(`現在のディレクトリ: ${currentDir}`);

// Vercel環境かどうかを確認
const isVercel = process.env.VERCEL === '1';
console.log(`Vercel環境: ${isVercel ? 'はい' : 'いいえ'}`);

// 不要なファイルとディレクトリを除外パターン
const excludePatterns = [
  // 一般的な除外パターン
  '.git',
  'node_modules',
  '.github',
  '.next',

  // 画像と大きなメディアファイル - 拡張子ベース
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.mp4',
  '.webm',
  '.mov',
  '.zip',
  '.pdf',
  '.psd',
  '.ai',
  '.eps',
  '.tiff',
  '.raw',
  '.bmp',
  '.ico',
  '.avi',
  '.mkv',
  '.flv',

  // バイナリとキャッシュファイル
  '.cache',
  'dist',
  'build',
  '.DS_Store',
  'thumbs.db',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',

  // 不要なドキュメント
  'examples',
  'sample-data',
  'test',
  'tests',
  'CHANGELOG.md',
  'LICENSE',
  'CONTRIBUTING.md',
  'SECURITY.md',

  // 大きい可能性のあるディレクトリ
  'backups',
  'assets/large',
  'assets/videos',
  'attachments',
  'screenshots',
  'diagrams',
  'images',
  'img',
  'media',
  'video',
];

// 大きいファイルのサイズ制限 (バイト単位)
const MAX_FILE_SIZE = 500 * 1024; // 500KB

// ファイルパスが除外パターンに一致するかチェック
/**
 * ファイルパスが除外パターンに一致するかチェックする関数
 * @param {string} filePath - チェック対象のファイルパス
 * @returns {boolean} 除外すべき場合はtrue、そうでない場合はfalse
 */
function shouldExclude(filePath) {
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // ファイル拡張子が除外パターンに含まれる場合はスキップ
  if (excludePatterns.includes(ext)) {
    return true;
  }

  // ディレクトリ名またはファイル名が除外パターンに含まれる場合はスキップ
  for (const pattern of excludePatterns) {
    if (filePath.includes(pattern) || fileName === pattern) {
      return true;
    }
  }

  // ファイルサイズをチェック（ディレクトリでない場合）
  try {
    if (fs.statSync(filePath).isFile()) {
      const stats = fs.statSync(filePath);
      if (stats.size > MAX_FILE_SIZE) {
        console.log(
          `サイズ超過のため除外: ${filePath} (${Math.round(stats.size / 1024)}KB)`
        );
        return true;
      }
    }
  } catch (error) {
    console.error(
      `ファイルサイズチェック中にエラーが発生しました: ${filePath}`,
      error
    );
  }

  return false;
}

// .docsディレクトリを検索する可能性のあるパス
const possiblePaths = [
  // モノレポのルートディレクトリ（通常の構造）
  path.join(currentDir, '../..', '.docs'),
  // 別のパス構造の場合（ビルド環境によって異なる可能性あり）
  path.join(currentDir, '../../..', '.docs'),
  // モノレポのルートが存在するかのチェック（git情報を使用）
  null,
];

// git情報を使用してモノレポのルートを検索
try {
  // gitのトップレベルディレクトリを取得
  const gitRootOutput = execSync('git rev-parse --show-toplevel', {
    stdio: ['pipe', 'pipe', 'ignore'],
  })
    .toString()
    .trim();
  if (gitRootOutput) {
    const gitRootDocsPath = path.join(gitRootOutput, '.docs');
    console.log(`Git リポジトリルートから検索: ${gitRootDocsPath}`);
    possiblePaths.push(gitRootDocsPath);
  }
} catch (error) {
  console.log(
    'Gitコマンドの実行に失敗しました。これは通常、Vercel環境では発生します。'
  );
}

// コピー先のディレクトリ
const targetDir = path.join(currentDir, '.docs');

// すでにコピー先ディレクトリが存在する場合は処理をスキップ
if (fs.existsSync(targetDir)) {
  console.log(`.docsディレクトリはすでに存在しています: ${targetDir}`);

  // Vercel環境では既存のdocsディレクトリを最適化
  if (isVercel) {
    console.log('Vercel環境のため、既存のdocsディレクトリを最適化します...');
    optimizeDirectory(targetDir);
  }

  process.exit(0);
}

// パスを順番に試して.docsディレクトリを検索
let sourceDirFound = false;
for (const sourceDir of possiblePaths) {
  if (sourceDir && fs.existsSync(sourceDir)) {
    console.log(`ソースディレクトリが見つかりました: ${sourceDir}`);
    sourceDirFound = true;

    try {
      // ディレクトリを再帰的にコピー
      console.log(`${sourceDir} から ${targetDir} にコピーしています...`);
      copyDirectory(sourceDir, targetDir);
      console.log('コピーが完了しました！');
      break;
    } catch (error) {
      console.error('コピー中にエラーが発生しました:', error);
    }
  }
}

if (!sourceDirFound) {
  console.error('警告: .docsディレクトリが見つかりませんでした。');
  console.error(
    'Vercel環境では、ビルドの前に.docsディレクトリを手動で追加する必要があります。'
  );

  // エラーで終了せず、ディレクトリを作成して続行します
  console.log('空の.docsディレクトリを作成します...');
  fs.mkdirSync(targetDir, { recursive: true });

  // 主要なサブディレクトリを作成
  const subDirs = ['documents', 'wiki', 'development', 'journals'];
  for (const dir of subDirs) {
    fs.mkdirSync(path.join(targetDir, dir), { recursive: true });
  }

  // サンプルファイルを作成
  const sampleContent = `---
title: サンプルドキュメント
date: ${new Date().toISOString().split('T')[0]}
status: published
---

# サンプルドキュメント

これはVercelデプロイ用に自動生成されたサンプルドキュメントです。
実際のドキュメントを表示するには、リポジトリの.docsディレクトリをVercelに適切に設定する必要があります。
`;

  fs.writeFileSync(path.join(targetDir, 'wiki', 'sample.mdx'), sampleContent);
  console.log('サンプルドキュメントを作成しました。');
}

/**
 * ディレクトリを再帰的にコピーする関数
 * @param {string} source コピー元のディレクトリパス
 * @param {string} target コピー先のディレクトリパス
 */
function copyDirectory(source, target) {
  // ターゲットディレクトリが存在しない場合は作成
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // ソースディレクトリの内容を取得
  const items = fs.readdirSync(source, { withFileTypes: true });

  let copied = 0;
  let skipped = 0;

  // 各アイテムを処理
  for (const item of items) {
    const sourcePath = path.join(source, item.name);
    const targetPath = path.join(target, item.name);

    // 除外パターンに一致するファイルはスキップ
    if (shouldExclude(sourcePath)) {
      console.log(`除外: ${sourcePath}`);
      skipped++;
      continue;
    }

    if (item.isDirectory()) {
      // ディレクトリの場合は再帰的にコピー
      const result = copyDirectory(sourcePath, targetPath);
      copied += result.copied;
      skipped += result.skipped;
    } else {
      // ファイルの場合はコピー
      fs.copyFileSync(sourcePath, targetPath);
      copied++;
    }
  }

  // Vercel環境では統計を出力
  if (source === possiblePaths[0] || source === possiblePaths[1]) {
    console.log(
      `コピー統計: ${copied}ファイルをコピー、${skipped}ファイルをスキップしました`
    );
  }

  return { copied, skipped };
}

/**
 * 既存のディレクトリを最適化する関数
 * 大きいファイルや不要なファイルを削除
 * @param {string} directory 最適化するディレクトリ
 */
function optimizeDirectory(directory) {
  let removed = 0;

  // ディレクトリ内のアイテムを取得
  const items = fs.readdirSync(directory, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(directory, item.name);

    if (item.isDirectory()) {
      // ディレクトリの場合は再帰的に最適化
      removed += optimizeDirectory(itemPath);
    } else if (shouldExclude(itemPath)) {
      // 除外すべきファイルは削除
      try {
        fs.unlinkSync(itemPath);
        console.log(`削除: ${itemPath}`);
        removed++;
      } catch (error) {
        console.error(
          `ファイル削除中にエラーが発生しました: ${itemPath}`,
          error
        );
      }
    }
  }

  return removed;
}
