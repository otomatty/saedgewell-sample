/**
 * バージョン情報提供APIルート
 *
 * このファイルはアプリケーションの現在のGitコミットハッシュを返すAPIエンドポイントを定義します。
 * フロントエンドからアプリケーションのバージョンを確認するために使用され、
 * デプロイされたバージョンの追跡やデバッグに役立ちます。
 */

/**
 * 静的生成を強制
 * ビルドが有効な間は可能な限り長くキャッシュするため
 */
export const dynamic = 'force-static';

// 各種デプロイプラットフォームで使用される既知のGit環境変数
// VercelやCloudflare Pages以外のプラットフォームを使用する場合は
// 独自の実装を提供してください
const KNOWN_GIT_ENV_VARS = [
  'CF_PAGES_COMMIT_SHA', // Cloudflare Pages
  'VERCEL_GIT_COMMIT_SHA', // Vercel
  'GIT_HASH', // 汎用
];

/**
 * GETリクエストハンドラー
 *
 * 現在のGitコミットハッシュをプレーンテキストとして返します。
 *
 * @returns テキスト形式のGitハッシュを含むレスポンス
 */
export const GET = async () => {
  const currentGitHash = await getGitHash();

  return new Response(currentGitHash, {
    headers: {
      'content-type': 'text/plain',
    },
  });
};

/**
 * Gitハッシュを取得する関数
 *
 * 以下の順序でGitハッシュの取得を試みます：
 * 1. 既知の環境変数から取得
 * 2. gitコマンドを実行して取得
 *
 * @returns 現在のGitコミットハッシュ、または取得できない場合は空文字列
 */
async function getGitHash() {
  // 既知の環境変数からGitハッシュを取得
  for (const envVar of KNOWN_GIT_ENV_VARS) {
    if (process.env[envVar]) {
      return process.env[envVar];
    }
  }

  // 環境変数で見つからない場合はgitコマンドを実行
  try {
    return await getHashFromProcess();
  } catch (error) {
    console.warn(
      `[警告] Gitハッシュを取得できませんでした: ${JSON.stringify(error)}。フォールバック値を提供することをお勧めします。`
    );

    return '';
  }
}

/**
 * プロセスからGitハッシュを取得する関数
 *
 * Node.js環境でのみgitコマンドを実行し、
 * エッジランタイムでは実行しません。
 *
 * @returns gitコマンドから取得したコミットハッシュ
 */
async function getHashFromProcess() {
  // エッジランタイムではNode.jsコマンドの実行を避ける
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (process.env.NODE_ENV !== 'development') {
      console.warn(
        '環境変数にGitハッシュが見つかりませんでした。gitコマンドにフォールバックします。この警告を避けるには、既知のGitハッシュ環境変数を提供してください。'
      );
    }

    const { execSync } = await import('node:child_process');

    // 最新のコミットの短いハッシュを取得
    return execSync('git log --pretty=format:"%h" -n1').toString().trim();
  }

  console.log(
    '環境変数にGitハッシュが見つかりませんでした。gitコマンドにフォールバックします。この警告を避けるには、既知のGitハッシュ環境変数を提供してください。'
  );
}
