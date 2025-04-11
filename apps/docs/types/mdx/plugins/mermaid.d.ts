/**
 * mermaidライブラリの型定義
 * ダイアグラム生成ライブラリのTypeScript型定義
 */
declare module 'mermaid' {
  /**
   * Mermaidの設定オプション
   */
  interface MermaidConfig {
    /** 自動読み込み設定 */
    startOnLoad?: boolean;
    /** テーマ設定 */
    theme?: 'default' | 'neutral' | 'base' | 'dark' | 'forest' | 'null';
    /** セキュリティレベル設定 */
    securityLevel?: 'loose' | 'strict' | 'antiscript' | 'sandbox';
    /** フォントファミリー */
    fontFamily?: string;
    /** ログレベル設定 */
    logLevel?:
      | 0
      | 1
      | 2
      | 3
      | 4
      | 5
      | 'trace'
      | 'debug'
      | 'info'
      | 'warn'
      | 'error'
      | 'fatal';
    /** フローチャート固有の設定 */
    flowchart?: Record<string, unknown>;
    /** シーケンス図固有の設定 */
    sequence?: Record<string, unknown>;
    /** ガントチャート固有の設定 */
    gantt?: Record<string, unknown>;
    /** 円グラフ固有の設定 */
    pie?: Record<string, unknown>;
    /** ER図固有の設定 */
    er?: Record<string, unknown>;
    /** クラス図固有の設定 */
    classDiagram?: Record<string, unknown>;
    /** 状態遷移図固有の設定 */
    stateDiagram?: Record<string, unknown>;
    /** フォントサイズ */
    fontSize?: number;
    /** テーマ変数 */
    themeVariables?: Record<string, string>;
    /** その他の設定 */
    [key: string]: unknown;
  }

  /**
   * Mermaidを初期化する
   * @param config - 初期化設定
   */
  export function initialize(config: MermaidConfig): void;

  /**
   * ダイアグラムをレンダリングする
   * @param id - レンダリング対象の要素ID
   * @param text - ダイアグラム定義テキスト
   * @returns SVG文字列を含むオブジェクト
   */
  export function render(id: string, text: string): Promise<{ svg: string }>;

  /**
   * ダイアグラム定義をパースする
   * @param text - パース対象のダイアグラム定義テキスト
   */
  export function parse(text: string): void;

  /**
   * パースエラーを処理する
   * @param error - 発生したエラー
   */
  export function parseError(error: Error): void;
}
