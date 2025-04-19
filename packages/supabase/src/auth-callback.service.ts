/**
 * auth-callback.service.ts
 *
 * このファイルはSupabaseの認証コールバック処理を管理するサービスを提供します。
 * OAuth認証やマジックリンク認証などの外部認証プロバイダーからのコールバック処理を扱います。
 *
 * 主な機能:
 * - トークンハッシュの検証と適切なリダイレクト処理
 * - 認証コードとセッションの交換
 * - エラーハンドリングと適切なエラーメッセージの生成
 *
 * 処理の流れ:
 * 1. createAuthCallbackService関数でAuthCallbackServiceのインスタンスを作成
 * 2. AuthCallbackServiceクラスが以下の主要メソッドを提供:
 *    - verifyTokenHash: メール認証やパスワードリセットなどのフローで使用
 *    - exchangeCodeForSession: OAuth認証フローで使用
 * 3. エラー発生時は適切なエラーメッセージを生成し、エラーページにリダイレクト
 *
 * 特記事項:
 * - 異なるブラウザでの認証試行など、一般的なエラーケースに対する特別な処理が実装されています
 * - 認証フローの複雑なエッジケースを処理するための堅牢な実装が含まれています
 *
 * 使用例:
 * ```
 * // auth-callback.tsなどのルートハンドラ内で
 * const supabase = getSupabaseServerClient();
 * const service = createAuthCallbackService(supabase);
 *
 * // トークンハッシュの検証
 * const url = await service.verifyTokenHash(request, {
 *   redirectPath: '/dashboard'
 * });
 *
 * // または認証コードとセッションの交換
 * const { nextPath } = await service.exchangeCodeForSession(request, {
 *   redirectPath: '/dashboard'
 * });
 * ```
 *
 * 注意点:
 * - このサービスはサーバーサイドでのみ使用することを想定しています
 * - 認証コールバックの処理は複雑なため、このサービスを使用して適切に処理することが重要です
 */
import 'server-only';

// @supabase/supabase-js からの EmailOtpType, AuthError, Session のインポートを削除
// import type {
//   AuthError,
//   EmailOtpType,
//   SupabaseClient as OriginalSupabaseClient,
//   Session,
// } from '@supabase/supabase-js';

/**
 * 汎用的な認証エラーインターフェース
 */
interface AuthCallbackError {
  message: string;
  status?: number;
  code?: string | number; // オプショナルな code プロパティを追加
  // 必要に応じて他のプロパティを追加
}

/**
 * 汎用的な認証セッションインターフェース
 */
interface AuthCallbackSession {
  // セッションに必要な最低限のプロパティを定義
  // 例: accessToken?: string; user?: AuthCallbackUser | null;
  [key: string]: unknown; // より柔軟性を持たせる
}

/**
 * 汎用的な認証ユーザーインターフェース
 */
interface AuthCallbackUser {
  // ユーザーに必要な最低限のプロパティを定義
  // 例: id: string; email?: string;
  [key: string]: unknown; // より柔軟性を持たせる
}

/**
 * 認証クライアントインターフェース (汎用化版)
 * Supabaseクライアントから必要な機能のみを抽出したインターフェース
 */
export interface AuthClientInterface {
  auth: {
    verifyOtp(params: {
      type: string; // EmailOtpType から string に変更
      token_hash: string;
    }): Promise<{
      data?: { user?: AuthCallbackUser | null } | null; // 汎用的な型に変更
      error?: AuthCallbackError | null; // 汎用的なエラー型に変更
    }>;
    exchangeCodeForSession(code: string): Promise<{
      data: {
        session: AuthCallbackSession | null; // 汎用的な型に変更
      } | null;
      error: AuthCallbackError | null; // 汎用的なエラー型に変更
    }>;
  };
}

/**
 * クッキーを操作するためのサービスインターフェース
 */
export interface CookiesService {
  get(name: string): string | undefined;
  set(name: string, value: string, options?: CookieOptions): void;
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

  static ok<T, E>(value: T): Result<T, E> {
    return new Result<T, E>(value, null, true);
  }

  static error<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(null, error, false);
  }

  get isOk(): boolean {
    return this._isOk;
  }

  get isErr(): boolean {
    return !this._isOk;
  }

  get value(): T | null {
    return this._value;
  }

  get error(): E | null {
    return this._error;
  }
}

/**
 * 認証コールバックのパラメータ
 */
export interface CallbackParams {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
}

/**
 * エラーコード列挙型
 */
export enum ErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  OAUTH_ERROR = 'OAUTH_ERROR',
  STATE_ERROR = 'STATE_ERROR',
  STATE_MISMATCH = 'STATE_MISMATCH',
  CODE_ERROR = 'CODE_ERROR',
  SESSION_ERROR = 'SESSION_ERROR',
  CODE_VERIFIER_ERROR = 'CODE_VERIFIER_ERROR',
  EXCHANGE_ERROR = 'EXCHANGE_ERROR',
  REDIRECT_ERROR = 'REDIRECT_ERROR',
  INVALID_REDIRECT = 'INVALID_REDIRECT',
}

/**
 * @name createAuthCallbackService
 * @description Creates an instance of the AuthCallbackService
 * @param client
 */
export function createAuthCallbackService(client: AuthClientInterface) {
  return new AuthCallbackService(client);
}

/**
 * @name AuthCallbackService
 * @description Service for handling auth callbacks in Supabase
 *
 * This service handles a variety of situations and edge cases in Supabase Auth.
 *
 */
class AuthCallbackService {
  // PKCE認証用のクッキー名
  private readonly STATE_COOKIE = 'sb-oauth-state';
  private readonly CODE_VERIFIER_COOKIE = 'sb-oauth-code-verifier';
  private readonly REDIRECT_TO_COOKIE = 'sb-redirect-to';

  constructor(private readonly client: AuthClientInterface) {}

  /**
   * OAuth認証コールバック処理を行います
   *
   * @param cookies クッキーサービス
   * @param callbackParams コールバックパラメータ
   * @param searchParams URLのクエリパラメータ
   * @returns リダイレクトURLまたはエラーコード
   */
  public async oAuthCallback(
    cookies: CookiesService,
    callbackParams: CallbackParams,
    searchParams: Record<string, string | string[]>
  ): Promise<Result<string, ErrorCode>> {
    // stateパラメーターを検証する
    if (!callbackParams.state) {
      return Result.error<string, ErrorCode>(ErrorCode.STATE_ERROR);
    }

    // stateパラメーターのトークンを取得する
    const stateFromCookie = cookies.get(this.STATE_COOKIE);

    if (!stateFromCookie || stateFromCookie !== callbackParams.state) {
      this.clearPKCECookies(cookies); // 不一致の場合はクッキーをクリア
      return Result.error<string, ErrorCode>(ErrorCode.STATE_MISMATCH);
    }

    // codeパラメーターを検証する
    if (!callbackParams.code) {
      return Result.error<string, ErrorCode>(ErrorCode.CODE_ERROR);
    }

    // codeを交換してセッションを取得する
    let sessionResult: Result<AuthCallbackSession | null, ErrorCode>;
    try {
      sessionResult = await this.exchangeCodeForSessionWithCookies(
        cookies,
        callbackParams.code
      );
    } catch (error) {
      return Result.error<string, ErrorCode>(ErrorCode.SESSION_ERROR);
    }

    if (sessionResult.isErr && sessionResult.error) {
      return Result.error<string, ErrorCode>(sessionResult.error);
    }

    // PKCEフローの状態をリセットする
    this.clearPKCECookies(cookies);

    // 正常にセッションが取得できれば、リダイレクト先URLを返す
    return this.getRedirectUrl(cookies);
  }

  /**
   * @name verifyTokenHash
   * @description Verifies the token hash and type and redirects the user to the next page
   * This should be used when using a token hash to verify the user's email
   * @param request
   * @param params
   */
  async verifyTokenHash(
    request: Request,
    params: {
      redirectPath: string;
      errorPath?: string;
    }
  ): Promise<URL> {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const host = request.headers.get('host');

    // set the host to the request host since outside of Vercel it gets set as "localhost"
    if (url.host.includes('localhost:') && !host?.includes('localhost')) {
      url.host = host as string;
      url.port = '';
    }

    url.pathname = params.redirectPath;

    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as string | null;
    const callbackParam =
      searchParams.get('next') ?? searchParams.get('callback');

    let nextPath: string | null = null;
    const callbackUrl = callbackParam ? new URL(callbackParam) : null;

    // if we have a callback url, we check if it has a next path
    if (callbackUrl) {
      // if we have a callback url, we check if it has a next path
      const callbackNextPath = callbackUrl.searchParams.get('next');

      // if we have a next path in the callback url, we use that
      if (callbackNextPath) {
        nextPath = callbackNextPath;
      } else {
        nextPath = callbackUrl.pathname;
      }
    }

    const errorPath = params.errorPath ?? '/auth/callback/error';

    // remove the query params from the url
    searchParams.delete('token_hash');
    searchParams.delete('type');
    searchParams.delete('next');

    // if we have a next path, we redirect to that path
    if (nextPath) {
      url.pathname = nextPath;
    }

    if (token_hash && type) {
      const { error } = await this.client.auth.verifyOtp({
        type,
        token_hash,
      });

      if (!error) {
        return url;
      }

      if (error.code) {
        url.searchParams.set('code', error.code.toString());
      }

      const errorMessage = getAuthErrorMessage({
        error: error.message,
        code: error.code?.toString(),
      });

      url.searchParams.set('error', errorMessage);
    }

    // return the user to an error page with some instructions
    url.pathname = errorPath;

    return url;
  }

  /**
   * @name exchangeCodeForSession
   * @description Exchanges the auth code for a session and redirects the user to the next page or an error page
   * @param request
   * @param params
   */
  async exchangeCodeForSession(
    request: Request,
    params: {
      redirectPath: string;
      errorPath?: string;
    }
  ): Promise<{
    nextPath: string;
  }> {
    const requestUrl = new URL(request.url);
    const searchParams = requestUrl.searchParams;

    const authCode = searchParams.get('code');
    const error = searchParams.get('error');
    const nextUrlPathFromParams = searchParams.get('next');
    const errorPath = params.errorPath ?? '/auth/callback/error';

    const nextUrl = nextUrlPathFromParams ?? params.redirectPath;

    if (authCode) {
      try {
        const { data, error } =
          await this.client.auth.exchangeCodeForSession(authCode);

        // if we have an error, we redirect to the error page
        if (error) {
          return onError({
            code: error.code?.toString(),
            error: error.message,
            path: errorPath,
          });
        }
      } catch (error) {
        return {
          nextPath: errorPath,
        };
      }
    } else if (error) {
      // if we have an error, we redirect to the error page
      return onError({
        error,
        path: errorPath,
      });
    }

    return {
      nextPath: nextUrl,
    };
  }

  /**
   * コードをセッションと交換し、関連するクッキーを処理します
   *
   * @param cookies クッキーサービス
   * @param code 認証コード
   * @returns セッションまたはエラーコード
   */
  private async exchangeCodeForSessionWithCookies(
    cookies: CookiesService,
    code: string
  ): Promise<Result<AuthCallbackSession | null, ErrorCode>> {
    const codeVerifier = cookies.get(this.CODE_VERIFIER_COOKIE);

    if (!codeVerifier) {
      return Result.error<AuthCallbackSession | null, ErrorCode>(
        ErrorCode.CODE_VERIFIER_ERROR
      );
    }

    try {
      const { data, error } =
        await this.client.auth.exchangeCodeForSession(code);

      // エラーハンドリング
      if (error) {
        const errorCodeStr = error.code?.toString(); // 文字列に変換
        console.error(
          `OAuth Error: ${error.message}`,
          { errorCode: errorCodeStr, details: error } // オブジェクトとして渡す
        );
        this.clearPKCECookies(cookies);
        return Result.error<AuthCallbackSession | null, ErrorCode>(
          ErrorCode.EXCHANGE_ERROR
        );
      }

      // セッションデータが存在しない場合や、セッションがnullの場合
      if (!data || !data.session) {
        console.error(
          'Session Error: No session data received after code exchange.'
        );
        this.clearPKCECookies(cookies); // エラー時にクッキーをクリア
        return Result.error<AuthCallbackSession | null, ErrorCode>(
          ErrorCode.SESSION_ERROR
        );
      }

      return Result.ok<AuthCallbackSession | null, ErrorCode>(data.session);
    } catch (e) {
      let errorMessage = 'Unknown error during code exchange';
      let errorCode: string | number | undefined = undefined;
      const originalError = e;

      // Check if e is an object with potential 'message' and 'code' properties
      if (e instanceof Error) {
        errorMessage = e.message;
        // Check for non-standard code property on Error
        const errorWithCode = e as Error & { code?: string | number }; // Type assertion with potential code
        if (
          typeof errorWithCode.code === 'string' ||
          typeof errorWithCode.code === 'number'
        ) {
          errorCode = errorWithCode.code;
        }
      } else if (typeof e === 'object' && e !== null) {
        // Error インスタンスでないオブジェクトの場合もチェック
        const potentialError = e as { message?: unknown; code?: unknown };
        if (typeof potentialError.message === 'string') {
          errorMessage = potentialError.message;
        }
        if (
          typeof potentialError.code === 'string' ||
          typeof potentialError.code === 'number'
        ) {
          errorCode = potentialError.code;
        }
      }
      // それ以外の場合（文字列やプリミティブなど）はデフォルトメッセージを使用

      const errorCodeStrFromCatch = errorCode?.toString(); // 文字列に変換
      console.error(
        `Unexpected error: ${errorMessage}`,
        { errorCode: errorCodeStrFromCatch, errorDetails: originalError } // オブジェクトとして渡す
      );
      this.clearPKCECookies(cookies);
      return Result.error<AuthCallbackSession | null, ErrorCode>(
        ErrorCode.UNKNOWN_ERROR
      );
    }
  }

  /**
   * リダイレクトURLを取得します
   *
   * @param cookies クッキーサービス
   * @returns リダイレクトURLまたはエラーコード
   */
  public async getRedirectUrl(
    cookies: CookiesService
  ): Promise<Result<string, ErrorCode>> {
    try {
      const redirectTo = cookies.get(this.REDIRECT_TO_COOKIE);

      if (!redirectTo) {
        return Result.error<string, ErrorCode>(ErrorCode.REDIRECT_ERROR);
      }

      const isValidUrl = await this.isValidRedirectUrl(redirectTo);

      if (!isValidUrl) {
        return Result.error<string, ErrorCode>(ErrorCode.INVALID_REDIRECT);
      }

      return Result.ok<string, ErrorCode>(redirectTo);
    } catch (error) {
      return Result.error<string, ErrorCode>(ErrorCode.UNKNOWN_ERROR);
    }
  }

  /**
   * 許可されたリダイレクトURLのリストを取得します
   */
  private async getAllowedRedirectUrls(): Promise<string[]> {
    try {
      // 実装されるリダイレクトURL取得ロジック...
      // 例: const urls = await this.someService.getAllowedRedirectUrls();

      // この例では静的なURLリストを返します
      return [
        'http://localhost:3000',
        'http://saedgewell.test',
        'http://docs.saedgewell.test',
        'http://admin.saedgewell.test',
        'https://saedgewell.test',
        'https://docs.saedgewell.test',
        'https://admin.saedgewell.test',
        'https://saedgewell.net',
        'https://docs.saedgewell.net',
        'https://admin.saedgewell.net',
      ];
    } catch (error) {
      return [];
    }
  }

  /**
   * リダイレクトURLが有効かどうかを確認します
   *
   * @param url チェックするURL
   * @returns 有効な場合はtrue、そうでない場合はfalse
   */
  private async isValidRedirectUrl(url: string): Promise<boolean> {
    try {
      const allowedUrls = await this.getAllowedRedirectUrls();
      const parsedUrl = new URL(url);

      // origin部分（protocol + hostname + port）のみを比較
      return allowedUrls.some((allowedUrl) => {
        try {
          const parsedAllowedUrl = new URL(allowedUrl);
          return parsedUrl.origin === parsedAllowedUrl.origin;
        } catch {
          return false;
        }
      });
    } catch (error) {
      return false;
    }
  }

  /**
   * PKCE認証フローで使用するクッキーをクリアします
   *
   * @param cookies クッキーサービス
   */
  private clearPKCECookies(cookies: CookiesService): void {
    cookies.delete(this.STATE_COOKIE);
    cookies.delete(this.CODE_VERIFIER_COOKIE);
  }

  /**
   * エラーコードに基づいてエラーレスポンスを処理します
   *
   * @param errorCode エラーコード
   * @param error オプションのエラーオブジェクト
   * @param errorDescription オプションのエラー説明
   * @returns エラーを示すResultオブジェクト
   */
  private handleCallbackError(
    errorCode: ErrorCode,
    error?: AuthCallbackError | null,
    errorDescription?: string | null
  ): Result<string, ErrorCode> {
    const message = error?.message || 'Unknown callback error';
    const code = error?.code;
    let errorCodeString: string | undefined = undefined; // string | undefined で初期化

    // code の型をチェックして文字列に変換
    if (typeof code === 'string') {
      errorCodeString = code;
    } else if (typeof code === 'number') {
      errorCodeString = code.toString();
    }
    // code が null または undefined の場合、errorCodeString は undefined のまま

    console.error(`${errorCode}: ${message}`, {
      errorDescription,
      errorCode: errorCodeString, // ここでは確実に string | undefined
      originalError: error,
    });

    return Result.error<string, ErrorCode>(errorCode);
  }
}

function onError({
  error,
  path,
  code,
}: {
  error: string;
  path: string;
  code?: string;
}) {
  const url = new URL(path, 'http://localhost');

  if (code) {
    url.searchParams.set('code', code);
  }

  const errorMessage = getAuthErrorMessage({
    error,
    code,
  });

  url.searchParams.set('error', errorMessage);

  return {
    nextPath: url.toString().replace('http://localhost', ''),
  };
}

/**
 * Checks if the given error message indicates a verifier error.
 * We check for this specific error because it's highly likely that the
 * user is trying to sign in using a different browser than the one they
 * used to request the sign in link. This is a common mistake, so we
 * want to provide a helpful error message.
 */
function isVerifierError(error: string) {
  const verifierErrors = [
    'pkce_verifier',
    'OTP',
    'Verifier',
    'PKCE',
    'expired',
  ];

  return verifierErrors.some((verifierError) =>
    error.toLowerCase().includes(verifierError.toLowerCase())
  );
}

/**
 * @name getAuthErrorMessage
 * @description Get the auth error message from the error code
 * @param params
 */
function getAuthErrorMessage(params: { error: string; code?: string }) {
  const { error, code } = params;

  if (isVerifierError(error)) {
    return '認証セッションの有効期限が切れています。別のブラウザやデバイスで認証を試みた場合は、同じブラウザで最初から認証フローをやり直してください。';
  }

  if (code === 'PGRST301') {
    return '認証に失敗しました。もう一度お試しください。';
  }

  // fallback error message
  return error;
}
