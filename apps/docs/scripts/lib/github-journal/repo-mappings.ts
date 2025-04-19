/**
 * リポジトリのマッピング関連を処理するモジュール
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { promisify } from 'node:util';
import { logger } from './logger.js';

const readFile = promisify(fs.readFile);

/**
 * リポジトリマッピングの型定義
 */
export interface RepoMapping {
  main: string;
  samples: string[];
}

/**
 * マッピング設定ファイルの構造
 */
export interface RepoMappingConfig {
  mappings: RepoMapping[];
}

/**
 * プロジェクトルートパスを取得
 */
function getProjectRoot(): string {
  return process.env.PROJECT_ROOT || process.cwd();
}

/**
 * リポジトリマッピング設定ファイルのパスを取得
 */
export function getMappingFilePath(): string {
  return path.join(getProjectRoot(), '.docs', 'repo-mappings.json');
}

/**
 * リポジトリマッピング設定ファイルを読み込む
 * @returns リポジトリマッピング設定
 */
export async function loadRepositoryMappings(): Promise<RepoMappingConfig> {
  try {
    const filePath = getMappingFilePath();

    // ファイルが存在するか確認
    if (!fs.existsSync(filePath)) {
      logger.warn(
        `リポジトリマッピング設定ファイルが見つかりません: ${filePath}`
      );
      return { mappings: [] };
    }

    // ファイルを読み込み、JSON解析
    const content = await readFile(filePath, 'utf8');
    const config = JSON.parse(content) as RepoMappingConfig;

    logger.info(
      `リポジトリマッピング設定を読み込みました。${config.mappings.length}件のマッピングが定義されています。`
    );

    return config;
  } catch (error) {
    logger.error(
      'リポジトリマッピング設定の読み込み中にエラーが発生しました:',
      error
    );
    // エラー時は空の設定を返す
    return { mappings: [] };
  }
}

/**
 * 除外すべきサンプルリポジトリのリストを取得
 * @returns 除外すべきリポジトリ名の配列
 */
export async function getExcludedRepositories(): Promise<string[]> {
  const config = await loadRepositoryMappings();
  // すべてのサンプルリポジトリをフラット化して取得
  const excludedRepos = config.mappings.flatMap((mapping) => mapping.samples);

  logger.debug(`除外対象リポジトリ: ${excludedRepos.join(', ')}`);
  return excludedRepos;
}

/**
 * サンプルリポジトリマッピング設定ファイルを作成
 */
export async function createSampleMappingFile(): Promise<void> {
  const filePath = getMappingFilePath();

  // ファイルが既に存在する場合は何もしない
  if (fs.existsSync(filePath)) {
    return;
  }

  const sampleConfig: RepoMappingConfig = {
    mappings: [
      {
        main: 'your-private-repo',
        samples: ['your-public-sample'],
      },
    ],
  };

  try {
    // ディレクトリが存在するか確認
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // サンプル設定ファイル作成
    await promisify(fs.writeFile)(
      filePath,
      JSON.stringify(sampleConfig, null, 2),
      'utf8'
    );

    logger.info(
      `サンプルリポジトリマッピング設定ファイルを作成しました: ${filePath}`
    );
  } catch (error) {
    logger.error('サンプル設定ファイル作成中にエラーが発生しました:', error);
  }
}
