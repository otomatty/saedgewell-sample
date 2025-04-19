#!/usr/bin/env ts-node

/**
 * このスクリプトは以下の機能を実行します:
 * 1. Journalsカテゴリのディレクトリを検索
 * 2. 各日付ディレクトリにあるindex.jsonファイルを読み込む
 * 3. 指定されたリポジトリまたはユーザーのGitHubコミット情報を取得
 * 4. コミット情報をindex.jsonに追加して保存
 *
 * 使用方法:
 * リポジトリ指定: $ bun run update:journal:commits -- --owner <GitHubユーザー名> --repo <リポジトリ名>
 * ユーザー指定: $ bun run update:journal:commits -- --user <GitHubユーザー名>
 *
 * オプション:
 * --owner <名前>        GitHubのリポジトリ所有者
 * --repo <名前>         GitHubのリポジトリ名
 * --user <名前>         GitHubのユーザー名（すべてのリポジトリから取得）
 * --date <日付>         この日付のみを処理（YYYY-MM-DD形式、デフォルトは今日）
 * --from-date <日付>    この日付から処理を開始（YYYY-MM-DD形式）
 * --to-date <日付>      この日付まで処理（YYYY-MM-DD形式、デフォルトは今日）
 * --skip-existing       既にコミット情報が存在するディレクトリをスキップ
 * --verbose             詳細なログを表示
 * --debug               デバッグ情報を表示（API呼び出しの詳細など）
 * --help, -h            このヘルプを表示
 */

import {
  parseCommandLineArgs,
  displayHelp,
  validateOptions,
} from './lib/github-journal/cli.js';
import type { Options } from './lib/github-journal/types.js';
import { logger, LogLevel } from './lib/github-journal/logger.js';
import {
  getAllUserCommitsForDate,
  getCommitsForDate,
  checkTokenScope,
  getAllUserCommitsForDateRange,
} from './lib/github-journal/github-api.js';
import {
  findJournalDirs,
  filterDateDirs,
  readJournalFile,
  updateJournalCommits,
  getJournalsPath,
} from './lib/github-journal/journal-file.js';
import * as path from 'node:path';

// メイン処理
async function main(): Promise<void> {
  try {
    // コマンドライン引数のパース
    const options = parseCommandLineArgs();
    const {
      owner,
      repo,
      username,
      date,
      fromDate,
      toDate,
      skipExisting,
      verbose,
      help,
      debug,
    } = options;

    // 環境変数の確認
    checkGitHubToken();

    // ヘルプオプションが指定されていれば表示して終了
    if (help) {
      displayHelp();
      process.exit(0);
    }

    // オプションの検証
    validateOptions(options);

    // ロガーの設定
    configureLogger(verbose, debug);

    // 環境情報の出力
    logger.startProcess('GitHubコミット情報取得');
    logEnvironmentInfo(options);

    // トークンのスコープを確認
    await checkTokenScope();

    // ジャーナルパスの取得
    const journalsPath = getJournalsPath();

    // 詳細ログ
    if (verbose) {
      logger.debug(`現在の作業ディレクトリ: ${process.cwd()}`);
      logger.debug(`検索パス: ${journalsPath}`);
    }

    // 日付ディレクトリを探索
    logger.info('日付ディレクトリを探索中...');
    const allDateDirs = await findJournalDirs(journalsPath, journalsPath);

    // 処理対象の日付ディレクトリをフィルタリング
    const dateDirs = filterDateDirs(allDateDirs, fromDate, toDate as string);

    logger.info(
      `${dateDirs.length}個の日付ディレクトリを処理対象として発見しました。`
    );

    // 統計情報
    let processedCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    // 日付範囲が指定されており、ユーザー指定の場合は一括取得処理を行う
    if (
      username &&
      dateDirs.length > 1 &&
      (fromDate || date) &&
      (toDate || date)
    ) {
      const startDate = fromDate || date || '';
      const endDate = toDate || date || '';

      if (startDate && endDate) {
        logger.info(
          `日付範囲一括処理モードを使用: ${startDate} から ${endDate}`
        );

        // 日付範囲内のコミットを一括取得
        try {
          const commitsByDate = await getAllUserCommitsForDateRange(
            startDate,
            endDate,
            username
          );

          // 各日付ディレクトリを処理
          for (const dateDir of dateDirs) {
            const dirName = path.basename(dateDir);

            try {
              // ジャーナルファイルの読み込み
              const indexData = await readJournalFile(dateDir);

              // スキップ条件チェック
              if (
                skipExisting &&
                indexData.commits &&
                indexData.commits.length > 0
              ) {
                logger.info(
                  `${dirName}: コミット情報が既に存在するためスキップします。`
                );
                skippedCount++;
                continue;
              }

              processedCount++;

              // 該当日付のコミットを取得
              const commits = commitsByDate[dirName] || [];
              logger.info(
                `${dirName}: ${username}のコミットを${commits.length}件発見しました。`
              );

              // コミット情報を更新
              if (commits.length > 0) {
                const addedCount = await updateJournalCommits(
                  dateDir,
                  indexData,
                  commits
                );

                if (addedCount > 0) {
                  logger.info(
                    `${dirName}: index.jsonを更新しました。${addedCount}件の新しいコミットを追加しました。`
                  );
                  updatedCount++;
                } else {
                  logger.info(
                    `${dirName}: 新しいコミットはありませんでした。更新は行いません。`
                  );
                }
              } else {
                logger.info(`${dirName}: コミットが見つかりませんでした。`);
              }
            } catch (error) {
              logger.error(`${dirName}: 処理中にエラーが発生しました:`, error);
              errorCount++;
            }
          }
        } catch (error) {
          logger.error('一括コミット取得中にエラーが発生しました:', error);

          // エラーが発生した場合は、個別処理モードに切り替える
          logger.info('個別処理モードに切り替えます。');
          await processDateDirsIndividually(
            dateDirs,
            username,
            owner,
            repo,
            skipExisting,
            { processedCount, skippedCount, updatedCount, errorCount }
          );
        }
      } else {
        // 日付指定がない場合は個別に処理
        await processDateDirsIndividually(
          dateDirs,
          username,
          owner,
          repo,
          skipExisting,
          { processedCount, skippedCount, updatedCount, errorCount }
        );
      }
    } else {
      // 個別に処理（従来の方法）
      await processDateDirsIndividually(
        dateDirs,
        username,
        owner,
        repo,
        skipExisting,
        { processedCount, skippedCount, updatedCount, errorCount }
      );
    }

    // 処理結果のサマリー表示
    logger.showStats({
      発見した日付ディレクトリ: `${allDateDirs.length}個`,
      処理対象のディレクトリ: `${dateDirs.length}個`,
      処理したディレクトリ: `${processedCount}個`,
      スキップしたディレクトリ: `${skippedCount}個`,
      更新したディレクトリ: `${updatedCount}個`,
      エラーが発生したディレクトリ: `${errorCount}個`,
    });

    logger.endProcess('GitHubコミット情報取得');
  } catch (error) {
    logger.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

/**
 * 日付ディレクトリを個別に処理する関数
 * @param dateDirs 処理対象の日付ディレクトリ配列
 * @param username ユーザー名
 * @param owner リポジトリ所有者
 * @param repo リポジトリ名
 * @param skipExisting 既存コミット情報をスキップするかどうか
 * @param counters 統計カウンター
 */
async function processDateDirsIndividually(
  dateDirs: string[],
  username: string,
  owner: string,
  repo: string,
  skipExisting: boolean,
  counters: {
    processedCount: number;
    skippedCount: number;
    updatedCount: number;
    errorCount: number;
  }
): Promise<void> {
  // 各日付ディレクトリを処理
  for (const dateDir of dateDirs) {
    const dirName = path.basename(dateDir);

    try {
      // ジャーナルファイルの読み込み
      const indexData = await readJournalFile(dateDir);

      // 既にコミット情報が存在し、スキップオプションが有効な場合はスキップ
      if (skipExisting && indexData.commits && indexData.commits.length > 0) {
        logger.info(
          `${dirName}: コミット情報が既に存在するためスキップします。`
        );
        counters.skippedCount++;
        continue;
      }

      // コミット情報を取得
      logger.info(`${dirName}: GitHubコミット情報を取得中...`);
      counters.processedCount++;

      let commits = [];

      if (username) {
        // ユーザーの全リポジトリからコミットを取得
        commits = await getAllUserCommitsForDate(dirName, username);
        logger.info(
          `${dirName}: ${username}のコミットを${commits.length}件発見しました。`
        );
      } else {
        // 特定リポジトリからコミットを取得
        commits = await getCommitsForDate(dirName, owner, repo);
        logger.info(
          `${dirName}: ${owner}/${repo}のコミットを${commits.length}件発見しました。`
        );
      }

      // コミット情報を更新
      if (commits.length > 0) {
        const addedCount = await updateJournalCommits(
          dateDir,
          indexData,
          commits
        );

        if (addedCount > 0) {
          logger.info(
            `${dirName}: index.jsonを更新しました。${addedCount}件の新しいコミットを追加しました。`
          );
          counters.updatedCount++;
        } else {
          logger.info(
            `${dirName}: 新しいコミットはありませんでした。更新は行いません。`
          );
        }
      } else {
        logger.info(`${dirName}: コミットが見つかりませんでした。`);
      }
    } catch (error) {
      logger.error(`${dirName}: 処理中にエラーが発生しました:`, error);
      counters.errorCount++;
    }
  }
}

/**
 * GitHub TOKENの存在を確認し、必要に応じて警告を表示
 */
function checkGitHubToken(): void {
  if (!process.env.GITHUB_TOKEN) {
    console.warn(
      '\x1b[33m警告: GITHUB_TOKENが設定されていません。API制限が厳しく適用されます。\x1b[0m'
    );
    console.warn(
      '環境変数GITHUB_TOKENを設定するか、.env.localファイルに追加してください。'
    );
    console.warn(
      '例: export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    );
  }
}

/**
 * ロガーを設定
 * @param verbose 詳細モード
 * @param debug デバッグモード
 */
function configureLogger(verbose: boolean, debug?: boolean): void {
  // デバッグモードが有効ならデバッグレベル、詳細モードなら情報レベル、それ以外は警告レベルに設定
  if (debug) {
    logger.setLevel(LogLevel.DEBUG);
    logger.setVerbose(true);
  } else if (verbose) {
    logger.setLevel(LogLevel.INFO);
    logger.setVerbose(true);
  } else {
    logger.setLevel(LogLevel.INFO);
    logger.setVerbose(false);
  }
}

/**
 * 環境情報をログに出力
 * @param options コマンドラインオプション
 */
function logEnvironmentInfo(options: Options): void {
  const {
    owner,
    repo,
    username,
    date,
    fromDate,
    toDate,
    skipExisting,
    verbose,
    debug,
  } = options;

  logger.info('環境情報:');
  logger.info(
    `- GitHub Actions: ${process.env.GITHUB_ACTIONS ? 'はい' : 'いいえ'}`
  );
  logger.info(`- ユーザー名: ${username || '指定なし'}`);
  logger.info(`- 特定リポジトリ: ${owner ? `${owner}/${repo}` : '指定なし'}`);

  if (date) {
    logger.info(`- 処理日: ${date}（今日のコミットのみ）`);
  } else {
    logger.info(`- 処理開始日: ${fromDate || '指定なし'}`);
    logger.info(`- 処理終了日: ${toDate}`);
  }

  logger.info(`- 既存スキップ: ${skipExisting ? 'はい' : 'いいえ'}`);
  logger.info(`- 詳細ログ: ${verbose ? 'はい' : 'いいえ'}`);
  logger.info(`- デバッグモード: ${debug ? 'はい' : 'いいえ'}`);
  logger.info(
    `- GITHUB_TOKEN: ${process.env.GITHUB_TOKEN ? '設定済み' : '未設定'}`
  );

  // デバッグモードの場合はノードバージョンなども表示
  if (debug) {
    logger.debug('システム情報:');
    logger.debug(`- Node.js: ${process.version}`);
    logger.debug(`- プラットフォーム: ${process.platform}`);
    logger.debug(`- アーキテクチャ: ${process.arch}`);

    // 環境変数（トークンを除く）
    const envVars = Object.keys(process.env)
      .filter(
        (key) =>
          !key.includes('TOKEN') &&
          !key.includes('KEY') &&
          !key.includes('SECRET')
      )
      .reduce(
        (obj, key) => {
          obj[key] = process.env[key];
          return obj;
        },
        {} as Record<string, string | undefined>
      );

    logger.debug('環境変数（一部）:', envVars);
  }
}

// メイン処理の実行
main();
