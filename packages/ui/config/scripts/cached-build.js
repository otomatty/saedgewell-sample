#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execSync } = require('node:child_process');
const glob = require('glob');

// キャッシュディレクトリ（node_modulesの外部に配置）
const CACHE_DIR = path.join(__dirname, '../../.cache/tsup-cache');

// コマンドライン引数を取得
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(
    '使用方法: node cached-build.js <コンポーネントグループ> <ビルドコマンド>'
  );
  process.exit(1);
}

const componentGroup = args[0]; // 例: 'shadcn', 'makerkit', 'magicui', 'utils'
const buildCommand = args[1]; // 例: 'build:dts:shadcn'

// キャッシュファイルのパス
const cacheFilePath = path.join(CACHE_DIR, `${componentGroup}.hash`);

// キャッシュディレクトリが存在しない場合は作成
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// ソースファイルのパターン
let sourcePattern;
switch (componentGroup) {
  case 'shadcn':
    sourcePattern = 'src/shadcn/**/*.{ts,tsx}';
    break;
  case 'makerkit':
    sourcePattern = 'src/makerkit/**/*.{ts,tsx}';
    break;
  case 'magicui':
    sourcePattern = 'src/magicui/**/*.{ts,tsx}';
    break;
  case 'custom':
    sourcePattern = 'src/custom/**/*.{ts,tsx}';
    break;
  case 'utils':
    sourcePattern = 'src/lib/utils/**/*.{ts,tsx}';
    break;
  default:
    console.error(`不明なコンポーネントグループ: ${componentGroup}`);
    process.exit(1);
}

// ソースファイルのリストを取得
const sourceFiles = glob.sync(sourcePattern, {
  cwd: path.join(__dirname, '../..'),
});

// ソースファイルのハッシュを計算
function calculateHash() {
  const hash = crypto.createHash('md5');

  // 各ファイルの内容とパスをハッシュに追加
  for (const file of sourceFiles.sort()) {
    const filePath = path.join(__dirname, '../..', file);
    const content = fs.readFileSync(filePath, 'utf8');
    hash.update(`${file}:${content}`);
  }

  // 設定ファイルもハッシュに含める
  const configFile = path.join(
    __dirname,
    '../tsup/dts',
    `dts.${componentGroup}.config.ts`
  );
  if (fs.existsSync(configFile)) {
    const configContent = fs.readFileSync(configFile, 'utf8');
    hash.update(configContent);
  }

  return hash.digest('hex');
}

// 現在のハッシュを計算
const currentHash = calculateHash();

// キャッシュされたハッシュを取得
let cachedHash = '';
if (fs.existsSync(cacheFilePath)) {
  cachedHash = fs.readFileSync(cacheFilePath, 'utf8').trim();
}

// ハッシュが一致する場合はビルドをスキップ
if (currentHash === cachedHash) {
  console.log(
    `🔄 ${componentGroup}の型定義に変更はありません。ビルドをスキップします。`
  );
  process.exit(0);
}

// ハッシュが一致しない場合はビルドを実行
console.log(
  `🔨 ${componentGroup}の型定義に変更があります。ビルドを実行します...`
);

try {
  // ビルドコマンドを実行
  execSync(`bun run ${buildCommand}`, { stdio: 'inherit' });

  // ビルドが成功したら新しいハッシュを保存
  fs.writeFileSync(cacheFilePath, currentHash);

  console.log(
    `✅ ${componentGroup}の型定義ビルドが完了しました。キャッシュを更新しました。`
  );
} catch (error) {
  console.error(`❌ ${componentGroup}の型定義ビルドに失敗しました:`, error);
  process.exit(1);
}
