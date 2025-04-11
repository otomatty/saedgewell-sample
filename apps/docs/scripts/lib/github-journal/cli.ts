/**
 * コマンドライン引数の処理モジュール
 */

import type { Options } from './types.js';
import { getJSTDateString } from '../date-utils.js';

/**
 * コマンドライン引数をパースしてOptionsオブジェクトを返す
 * @returns パース済みのオプション
 */
export function parseCommandLineArgs(): Options {
  const args = process.argv.slice(2);
  const options: Options = {
    owner: '',
    repo: '',
    username: '',
    date: null,
    fromDate: null,
    toDate: null,
    skipExisting: false,
    verbose: false,
    help: false,
    debug: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--owner' && i + 1 < args.length) {
      options.owner = args[i + 1] || '';
      i++;
    } else if (args[i] === '--repo' && i + 1 < args.length) {
      options.repo = args[i + 1] || '';
      i++;
    } else if (args[i] === '--user' && i + 1 < args.length) {
      options.username = args[i + 1] || '';
      i++;
    } else if (args[i] === '--date' && i + 1 < args.length) {
      // YYYY-MM-DD形式かどうかチェックのみ行う（未来日付も許容する）
      const dateStr = args[i + 1];
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        options.date = dateStr;
        i++;
      } else {
        console.error(`無効な日付形式です: "${dateStr}"`);
        console.error('日付はYYYY-MM-DD形式で指定してください');
        process.exit(1);
      }
    } else if (args[i] === '--from-date' && i + 1 < args.length) {
      // YYYY-MM-DD形式かどうかチェックのみ行う（未来日付も許容する）
      const dateStr = args[i + 1];
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        options.fromDate = dateStr;
        i++;
      } else {
        console.error(`無効な日付形式です: "${dateStr}"`);
        console.error('日付はYYYY-MM-DD形式で指定してください');
        process.exit(1);
      }
    } else if (args[i] === '--to-date' && i + 1 < args.length) {
      // YYYY-MM-DD形式かどうかチェックのみ行う（未来日付も許容する）
      const dateStr = args[i + 1];
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        options.toDate = dateStr;
        i++;
      } else {
        console.error(`無効な日付形式です: "${dateStr}"`);
        console.error('日付はYYYY-MM-DD形式で指定してください');
        process.exit(1);
      }
    } else if (args[i] === '--skip-existing') {
      options.skipExisting = true;
    } else if (args[i] === '--verbose') {
      options.verbose = true;
    } else if (args[i] === '--debug') {
      options.debug = true;
      options.verbose = true; // デバッグモードは詳細モードも含む
    } else if (args[i] === '--help' || args[i] === '-h') {
      options.help = true;
    }
  }

  // 今日の日付をデフォルトに設定
  const todayDate = getJSTDateString();

  // --dateが指定されていない場合はデフォルトで今日の日付を使用
  if (!options.date && !options.fromDate && !options.toDate) {
    options.date = todayDate;
  }

  // --dateが指定されている場合はfrom-dateとto-dateを同じ日付に設定
  if (options.date) {
    options.fromDate = options.date;
    options.toDate = options.date;
  }

  // to-dateが指定されていない場合は今日の日付を使用
  if (!options.toDate) {
    options.toDate = todayDate;
  }

  return options;
}

/**
 * ヘルプメッセージを表示する
 */
export function displayHelp(): void {
  console.log(`
GitHubコミット情報を取得して日付ディレクトリのindex.jsonに追加するスクリプト

使用方法:
  bun run update:journal:commits -- --user <GitHubユーザー名>
  bun run update:journal:commits -- --owner <GitHubユーザー名> --repo <リポジトリ名>

オプション:
  --user <名前>           GitHubのユーザー名（すべてのリポジトリから取得）
  --owner <名前>          GitHubのリポジトリ所有者
  --repo <名前>           GitHubのリポジトリ名
  --date <YYYY-MM-DD>     この日付のみを処理（デフォルトは今日）
  --from-date <YYYY-MM-DD> この日付から処理を開始
  --to-date <YYYY-MM-DD>  この日付まで処理（デフォルトは今日）
  --skip-existing         既にコミット情報が存在するディレクトリをスキップ
  --verbose               詳細なログを表示
  --debug                 デバッグ情報を表示（API呼び出しの詳細など）
  --help, -h              このヘルプを表示

環境変数:
  GITHUB_TOKEN            GitHubのアクセストークン（API制限緩和のため推奨）

例:
  # 今日のコミットを取得（デフォルト）
  bun run update:journal:commits -- --user otomatty

  # 特定の日付のコミットのみを取得
  bun run update:journal:commits -- --user otomatty --date 2023-04-01

  # 特定のリポジトリから指定日までのコミットを取得
  bun run update:journal:commits -- --owner otomatty --repo saedgewell --from-date 2023-01-01 --to-date 2023-03-31

  # 既存のコミット情報があるディレクトリはスキップして高速化
  bun run update:journal:commits -- --user otomatty --skip-existing
`);
}

/**
 * コマンドラインオプションの検証
 * @param options パース済みのオプション
 */
export function validateOptions(options: Options): void {
  if ((!options.owner || !options.repo) && !options.username) {
    console.error(
      'エラー: --user または --owner と --repo のどちらかを指定してください。'
    );
    console.error(
      'ヘルプを表示するには --help または -h オプションを使用してください。'
    );
    process.exit(1);
  }
}
