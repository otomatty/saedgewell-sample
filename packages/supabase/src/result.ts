/**
 * result.ts
 *
 * 成功または失敗の結果を表現するためのResult型を定義します。
 * これはauth-callback.service.tsで使用されます。
 */

/**
 * 成功または失敗を表すResultクラス
 * @template T 成功時の値の型
 * @template E 失敗時のエラーの型
 */
export class Result<T, E> {
  private constructor(
    private readonly _value: T | null,
    private readonly _error: E | null,
    private readonly _isOk: boolean
  ) {}

  /**
   * 成功結果を作成します
   * @param value 成功時の値
   * @returns 成功を表すResult
   */
  static ok<T, E>(value: T): Result<T, E> {
    return new Result<T, E>(value, null, true);
  }

  /**
   * 失敗結果を作成します
   * @param error エラー値
   * @returns 失敗を表すResult
   */
  static error<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(null, error, false);
  }

  /**
   * 結果が成功かどうかを返します
   */
  get isOk(): boolean {
    return this._isOk;
  }

  /**
   * 結果が失敗かどうかを返します
   */
  get isErr(): boolean {
    return !this._isOk;
  }

  /**
   * 成功時の値を返します
   * 失敗の場合はnullを返します
   */
  get value(): T | null {
    return this._value;
  }

  /**
   * 失敗時のエラーを返します
   * 成功の場合はnullを返します
   */
  get error(): E | null {
    return this._error;
  }

  /**
   * 成功時に指定された関数を実行します
   * @param fn 成功時に実行する関数
   * @returns 新しいResult
   */
  map<U>(fn: (value: T) => U): Result<U, E> {
    return this.isOk && this._value !== null
      ? Result.ok<U, E>(fn(this._value))
      : Result.error<U, E>(this._error as E);
  }

  /**
   * 失敗時に指定された関数を実行します
   * @param fn 失敗時に実行する関数
   * @returns 新しいResult
   */
  mapError<U>(fn: (error: E) => U): Result<T, U> {
    return this.isErr && this._error !== null
      ? Result.error<T, U>(fn(this._error))
      : Result.ok<T, U>(this._value as T);
  }
}
