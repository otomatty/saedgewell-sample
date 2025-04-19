/**
 * ロガーモジュール
 * ログ出力の一元管理を行う
 */

/**
 * ログレベルの定義
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * ログの色コード
 */
const Colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

/**
 * ロガークラス
 */
export class Logger {
  private level: LogLevel;
  private verboseMode: boolean;

  /**
   * コンストラクタ
   * @param level ログレベル
   * @param verbose 詳細モードフラグ
   */
  constructor(level: LogLevel = LogLevel.INFO, verbose = false) {
    this.level = level;
    this.verboseMode = verbose;
  }

  /**
   * ログレベルを設定
   * @param level ログレベル
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * 詳細モードを設定
   * @param verbose 詳細モードフラグ
   */
  setVerbose(verbose: boolean): void {
    this.verboseMode = verbose;
  }

  /**
   * DEBUGレベルのログを出力
   * @param message メッセージ
   * @param data 追加データ（オプション）
   */
  debug(message: string, data?: unknown): void {
    if (this.level <= LogLevel.DEBUG || this.verboseMode) {
      console.log(`${Colors.dim}[DEBUG] ${message}${Colors.reset}`);
      if (data !== undefined && this.verboseMode) {
        console.log(data);
      }
    }
  }

  /**
   * INFOレベルのログを出力
   * @param message メッセージ
   * @param data 追加データ（オプション）
   */
  info(message: string, data?: unknown): void {
    if (this.level <= LogLevel.INFO) {
      console.log(`${Colors.blue}[INFO]${Colors.reset} ${message}`);
      if (data !== undefined && this.verboseMode) {
        console.log(data);
      }
    }
  }

  /**
   * WARNレベルのログを出力
   * @param message メッセージ
   * @param data 追加データ（オプション）
   */
  warn(message: string, data?: unknown): void {
    if (this.level <= LogLevel.WARN) {
      console.log(`${Colors.yellow}[WARN] ${message}${Colors.reset}`);
      if (data !== undefined) {
        console.log(data);
      }
    }
  }

  /**
   * ERRORレベルのログを出力
   * @param message メッセージ
   * @param error エラーオブジェクト（オプション）
   */
  error(message: string, error?: unknown): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`${Colors.red}[ERROR] ${message}${Colors.reset}`);
      if (error) {
        if (error instanceof Error) {
          console.error(`${Colors.red}${error.message}${Colors.reset}`);
          if (this.verboseMode && error.stack) {
            console.error(`${Colors.dim}${error.stack}${Colors.reset}`);
          }
        } else {
          console.error(error);
        }
      }
    }
  }

  /**
   * 処理の開始を通知するログを出力
   * @param processName プロセス名
   */
  startProcess(processName: string): void {
    console.log(`${Colors.green}=== ${processName} 開始 ===${Colors.reset}`);
  }

  /**
   * 処理の完了を通知するログを出力
   * @param processName プロセス名
   */
  endProcess(processName: string): void {
    console.log(`${Colors.green}=== ${processName} 完了 ===${Colors.reset}`);
  }

  /**
   * 統計情報を表示
   * @param stats 統計情報のオブジェクト
   */
  showStats(stats: Record<string, number | string>): void {
    console.log(`\n${Colors.bright}処理結果サマリー:${Colors.reset}`);
    for (const [key, value] of Object.entries(stats)) {
      console.log(`- ${key}: ${value}`);
    }
  }
}

// シングルトンインスタンス
export const logger = new Logger();
