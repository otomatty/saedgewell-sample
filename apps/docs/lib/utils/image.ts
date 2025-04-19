/**
 * 画像URL最適化ユーティリティ
 */

/**
 * デフォルト画像パス
 */
export const DEFAULT_THUMBNAIL_PATH = '/thumbnails/no-image.svg';

/**
 * メモリ内キャッシュ（OGP画像URL用）
 * キー: 元のURL, 値: OGP画像のURL
 */
const ogpUrlCache = new Map<string, { url: string; timestamp: number }>();

/**
 * キャッシュの有効期限（24時間）
 */
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

/**
 * メモリキャッシュからOGP画像URLを取得する
 * @param url 元のURL
 * @returns キャッシュされたOGP画像URL、またはnull
 */
function getCachedOgpUrl(url: string): string | null {
  const cached = ogpUrlCache.get(url);
  if (!cached) return null;

  // キャッシュの有効期限をチェック
  if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
    ogpUrlCache.delete(url);
    return null;
  }

  return cached.url;
}

/**
 * OGP画像URLをメモリキャッシュに保存する
 * @param url 元のURL
 * @param ogpUrl OGP画像URL
 */
function cacheOgpUrl(url: string, ogpUrl: string): void {
  ogpUrlCache.set(url, { url: ogpUrl, timestamp: Date.now() });
}

/**
 * URLがWebサイトのURLかどうかを判断する
 * @param url URL
 * @returns WebサイトのURLかどうか
 */
function isWebsiteUrl(url: string): boolean {
  // URLが http:// または https:// で始まり、画像ファイル拡張子で終わらない場合はWebサイトのURL
  return (
    (url.startsWith('http://') || url.startsWith('https://')) &&
    !url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i) &&
    !url.includes('gyazo.com') &&
    !url.includes('i.gyazo.com')
  );
}

/**
 * WebサイトのURLからOGP画像を取得するURLを生成する
 * @param url WebサイトのURL
 * @returns OGP画像取得APIのURL
 */
function getOgImageUrl(url: string): string {
  // URLをエンコード
  const encodedUrl = encodeURIComponent(url);
  // OGP画像取得APIのURLを返す
  return `/api/og-image?url=${encodedUrl}`;
}

/**
 * 画像URLをプロキシするかどうかを判断する
 * @param url 画像URL
 * @returns プロキシが必要かどうか
 */
function shouldProxyImage(url: string): boolean {
  // 相対パスの場合はプロキシ不要
  if (url.startsWith('/')) {
    return false;
  }

  // Gyazo画像はプロキシ不要（next.config.mjsで許可済み）
  if (url.includes('gyazo.com') || url.includes('i.gyazo.com')) {
    return false;
  }

  // その他のURLはプロキシ必要
  return true;
}

/**
 * 画像URLをプロキシAPIを通して取得するURLに変換する
 * @param url 元の画像URL
 * @returns プロキシAPI経由のURL
 */
function getProxiedImageUrl(url: string): string {
  // URLをエンコード
  const encodedUrl = encodeURIComponent(url);
  // プロキシAPIのURLを返す
  return `/api/proxy-image?url=${encodedUrl}`;
}

/**
 * Gyazo URLを適切な画像URLに変換する関数
 * @param url Gyazo URL
 * @param width 希望する画像の幅
 * @returns 最適化されたGyazo画像URL
 */
function optimizeGyazoUrl(url: string, width = 1200): string {
  // すでに i.gyazo.com 形式の場合は、サイズパラメータを追加
  if (url.includes('i.gyazo.com')) {
    // URLにクエリパラメータがあるかチェック
    const hasQuery = url.includes('?');
    // 適切なサイズパラメータを追加
    return `${url}${hasQuery ? '&' : '?'}w=${width}`;
  }

  // 通常の gyazo.com/ID 形式を i.gyazo.com/ID.png に変換し、サイズパラメータを追加
  if (url.includes('gyazo.com/')) {
    const id = url.split('gyazo.com/')[1];
    return `https://i.gyazo.com/${id}.png?w=${width}`;
  }

  return url;
}

/**
 * 画像URLを最適化する関数
 * 適用順序:
 * 1. OGP画像を取得
 * 2. Gyazoから画像を取得
 * 3. public/thumbnailsから取得
 * 4. 画像が取得できない場合はno-image.webpを表示
 *
 * @param url 元の画像URL
 * @param width 希望する画像の幅（Gyazo画像のみ適用）
 * @returns 最適化された画像URL
 */
export async function optimizeImageUrl(
  url: string,
  width = 1200
): Promise<string> {
  // URLが指定されていない場合はデフォルト画像を返す
  if (!url) {
    return DEFAULT_THUMBNAIL_PATH;
  }

  // 1. WebサイトのURLの場合はOGP画像を取得
  if (isWebsiteUrl(url)) {
    try {
      // まずキャッシュをチェック
      const cachedUrl = getCachedOgpUrl(url);
      if (cachedUrl) {
        return cachedUrl;
      }

      // OGP画像取得APIのパス
      const ogImagePath = getOgImageUrl(url);

      // 現在の実行環境に基づいて適切なベースURLを取得
      let baseUrl = '';
      if (typeof window !== 'undefined') {
        // ブラウザ環境の場合はwindow.locationから取得
        baseUrl = window.location.origin;
      } else {
        // サーバー環境の場合は環境変数かデフォルト値を使用
        baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:7511';
      }

      // 絶対URLの構築（相対パスの場合のみ）
      const fetchUrl = ogImagePath.startsWith('http')
        ? ogImagePath
        : new URL(ogImagePath, baseUrl).toString();

      // fetchオプションを設定（タイムアウトを5秒に短縮）
      const fetchOptions = {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      };

      // 絶対URLを使用してリクエスト
      const response = await fetch(fetchUrl, fetchOptions);

      if (response.ok) {
        try {
          const data = await response.json();
          if (data.url) {
            // 見つかったOGP画像が相対パスの場合、絶対パスに変換
            let finalImageUrl: string;
            if (data.url.startsWith('/') && !data.url.startsWith('//')) {
              try {
                const urlObj = new URL(url);
                const absoluteOgImageUrl = `${urlObj.origin}${data.url}`;
                finalImageUrl = getProxiedImageUrl(absoluteOgImageUrl);
              } catch (e) {
                finalImageUrl = getProxiedImageUrl(data.url);
              }
            } else {
              finalImageUrl = getProxiedImageUrl(data.url);
            }

            // 結果をキャッシュに保存
            cacheOgpUrl(url, finalImageUrl);
            return finalImageUrl;
          }
        } catch (jsonError) {
          return DEFAULT_THUMBNAIL_PATH;
        }
      }
      return DEFAULT_THUMBNAIL_PATH;
    } catch (error) {
      return DEFAULT_THUMBNAIL_PATH;
    }
  }

  // 2. Gyazo画像の場合は最適化
  if (url.includes('gyazo.com') || url.includes('i.gyazo.com')) {
    return optimizeGyazoUrl(url, width);
  }

  // 3. /thumbnails/ で始まる相対パスの場合、publicディレクトリからの参照とみなす
  if (url.startsWith('/thumbnails/')) {
    return url;
  }

  // 4. その他の画像URLの場合はプロキシを通して取得
  if (shouldProxyImage(url)) {
    return getProxiedImageUrl(url);
  }

  // それ以外の場合はそのまま返す
  return url;
}

/**
 * 同期的に画像URLを最適化する関数（非同期処理が使えない場合用）
 * @param url 元の画像URL
 * @param width 希望する画像の幅（Gyazo画像のみ適用）
 * @returns 最適化された画像URL
 */
export function optimizeImageUrlSync(url: string, width = 1200): string {
  // URLが指定されていない場合はデフォルト画像を返す
  if (!url) {
    return DEFAULT_THUMBNAIL_PATH;
  }

  // WebサイトのURLの場合は同期的に処理できないため、
  // クライアント側でのレンダリング時にはOGP画像取得APIのパスをそのまま返す
  if (isWebsiteUrl(url)) {
    // OGP画像取得APIのパスを生成
    const ogImagePath = getOgImageUrl(url);

    // クライアント側では画像がそのまま表示されるように、og-imageではなくoptimize-imageを使用
    // optimize-imageエンドポイントは内部で非同期処理を行い、適切な画像URLを返す
    return `/api/optimize-image?url=${encodeURIComponent(url)}`;
  }

  // Gyazo画像の場合は最適化
  if (url.includes('gyazo.com') || url.includes('i.gyazo.com')) {
    return optimizeGyazoUrl(url, width);
  }

  // /thumbnails/ で始まる相対パスの場合、publicディレクトリからの参照とみなす
  if (url.startsWith('/thumbnails/')) {
    return url;
  }

  // その他の画像URLの場合はプロキシを通して取得
  if (shouldProxyImage(url)) {
    return getProxiedImageUrl(url);
  }

  // それ以外の場合はそのまま返す
  return url;
}

/**
 * 画像のプレースホルダーSVGをBase64エンコードした文字列を生成する
 * @param width 画像の幅
 * @param height 画像の高さ
 * @param color 背景色
 * @returns Base64エンコードされたSVG
 */
export function generatePlaceholderImage(
  width = 1200,
  height = 675,
  color = '#f2f2f2'
): string {
  // よりモダンなグラデーションプレースホルダー
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.8" />
        <stop offset="100%" stop-color="${color}" stop-opacity="0.6" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#g)" />
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * 16:9のアスペクト比に基づいて高さを計算する
 * @param width 画像の幅
 * @returns 16:9のアスペクト比に基づいた高さ
 */
export function calculateAspectRatioHeight(width: number): number {
  return Math.round((width * 9) / 16);
}

/**
 * クライアント側での画像のプリロード機能
 * @param url 画像URL
 */
export function preloadImage(url: string): void {
  if (typeof window === 'undefined') return;

  // URLが空または既にプリロード済みの場合は処理しない
  if (!url) return;

  // 画像のプリロード
  const img = new window.Image();
  img.src = url;
}

/**
 * 複数の画像をプリロードする
 * @param urls 画像URLの配列
 */
export function preloadImages(urls: string[]): void {
  if (typeof window === 'undefined') return;

  for (const url of urls) {
    if (url) preloadImage(url);
  }
}
