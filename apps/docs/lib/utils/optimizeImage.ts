import { DEFAULT_THUMBNAIL_PATH } from './image';

/**
 * APIを使用して画像URLを最適化する関数
 * @param url 最適化したい画像のURL
 * @returns 最適化された画像URLまたはエラー時はデフォルト画像のURL
 */
export const optimizeImageWithApi = async (url: string): Promise<string> => {
  if (!url) return DEFAULT_THUMBNAIL_PATH;

  try {
    // 相対パスを絶対パスに変換
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `/api/optimize-image?url=${encodedUrl}`;

    // SSRの場合はbaseUrlを追加しない
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const absoluteApiUrl = baseUrl
      ? new URL(apiUrl, baseUrl).toString()
      : apiUrl;

    const response = await fetch(absoluteApiUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        return data.url;
      }
    }
    return DEFAULT_THUMBNAIL_PATH;
  } catch (error) {
    console.error(`Error optimizing image URL: ${url}`, error);
    return DEFAULT_THUMBNAIL_PATH;
  }
};

/**
 * 画像をプリロードする関数
 * @param url プリロードする画像のURL
 * @returns ロード状態を示すPromise
 */
export const preloadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !url) {
      reject(new Error('No URL provided or not in browser environment'));
      return;
    }

    const img = new window.Image();

    img.onload = () => {
      resolve(img);
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`));
    };

    img.src = url;
  });
};
