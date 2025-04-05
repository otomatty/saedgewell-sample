import { v4 as uuid } from 'uuid';

/**
 * ランダムなファイル名を生成する
 * @param originalFileName 元のファイル名
 * @returns ランダムなUUIDを使用したファイル名
 */
export function generateRandomFileName(originalFileName: string): string {
  const fileExtension = originalFileName.split('.').pop() || 'png';
  return `${uuid()}.${fileExtension}`;
}

/**
 * ファイルのMIMEタイプからファイル拡張子を取得する
 * @param mimeType MIMEタイプ (例: 'image/jpeg')
 * @returns ファイル拡張子 (例: 'jpg')
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeTypeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };

  return mimeTypeMap[mimeType] || 'png';
}

/**
 * Blob URLを作成する
 * @param file Fileオブジェクト
 * @returns Blob URL
 */
export function createBlobUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Blob URLを解放する
 * @param url Blob URL
 */
export function revokeBlobUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * ファイルサイズを人間が読みやすい形式に変換する
 * @param bytes バイト数
 * @returns 人間が読みやすいファイルサイズ (例: '1.5 MB')
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

/**
 * 画像かどうかをMIMEタイプで判定する
 * @param mimeType MIMEタイプ
 * @returns 画像かどうか
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}
