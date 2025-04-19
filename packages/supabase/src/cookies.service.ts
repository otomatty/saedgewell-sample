/**
 * cookies.service.ts
 *
 * クッキーを管理するためのインターフェースを定義します。
 * これはauth-callback.service.tsで使用されます。
 */

/**
 * クッキーを操作するためのサービスインターフェース
 */
export interface CookiesService {
  /**
   * 指定された名前のクッキーを取得します
   * @param name クッキーの名前
   * @returns クッキーの値、存在しない場合はundefined
   */
  get(name: string): string | undefined;

  /**
   * クッキーを設定します
   * @param name クッキーの名前
   * @param value クッキーの値
   * @param options クッキーのオプション
   */
  set(name: string, value: string, options?: CookieOptions): void;

  /**
   * クッキーを削除します
   * @param name 削除するクッキーの名前
   * @param options クッキーのオプション
   */
  delete(name: string, options?: CookieOptions): void;
}

/**
 * クッキーのオプション
 */
export interface CookieOptions {
  domain?: string;
  path?: string;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}
